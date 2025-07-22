//! Business logic for creating and manipulating conversations.

use crate::models::{
    Conversation, ConversationDetail, CreateConversation, Message, MessageRow, NewMessage,
};
use crate::services::ollama::OllamaService;
use anyhow::{anyhow, Context, Result};
use sqlx::PgPool;
use tracing::{error, info};
use uuid::Uuid;

const TITLE_PROMPT: &str = "Génère un titre court et percutant (3 à 6 mots) résumant la conversation ci-dessus. Pas de guillemets, pas de ponctuation autour, pas de nom propre ni d’info perso. Reste neutre et direct.";

#[derive(Clone)]
pub struct ConversationService {
    pool: PgPool,
    ollama: OllamaService,
}

impl ConversationService {
    pub fn new(pool: PgPool, ollama: OllamaService) -> Self {
        Self { pool, ollama }
    }

    pub async fn create_conversation(
        &self,
        user_id: Uuid,
        payload: &CreateConversation,
    ) -> Result<Conversation> {
        let model = payload
            .model
            .clone()
            .unwrap_or_else(|| crate::models::DEFAULT_MODEL.to_string());

        let system_prompt = payload
            .system_prompt
            .clone()
            .unwrap_or_else(|| crate::models::DEFAULT_SYSTEM_PROMPT.to_string());

        let conv = sqlx::query_as::<_, Conversation>(
            "INSERT INTO conversations (user_id, title, system_prompt, model) VALUES ($1, COALESCE($2, 'Nouvelle conversation'), COALESCE($3, ''), $4) RETURNING *",
        )
        .bind(user_id)
        .bind(&payload.title)
        .bind(&system_prompt)
        .bind(&model)
        .fetch_one(&self.pool)
        .await
        .context("Erreur lors de la création de la conversation")?;

        sqlx::query("INSERT INTO messages (conversation_id, sender_role, content) VALUES ($1, 'system', $2)")
            .bind(conv.id)
            .bind(&system_prompt)
            .execute(&self.pool)
            .await
            .context("Erreur lors de l'enregistrement du system prompt")?;

        Ok(conv)
    }

    pub async fn list_conversations(&self, user_id: Uuid) -> Result<Vec<Conversation>> {
        sqlx::query_as::<_, Conversation>(
            "SELECT * FROM conversations WHERE user_id = $1 ORDER BY updated_at DESC",
        )
        .bind(user_id)
        .fetch_all(&self.pool)
        .await
        .context("Erreur lors de la récupération des conversations")
    }

    pub async fn get_conversation_detail(
        &self,
        user_id: Uuid,
        conv_id: Uuid,
    ) -> Result<Option<ConversationDetail>> {
        let conversation = sqlx::query_as::<_, Conversation>(
            "SELECT * FROM conversations WHERE id = $1 AND user_id = $2",
        )
        .bind(conv_id)
        .bind(user_id)
        .fetch_optional(&self.pool)
        .await
        .context("Erreur lors de la récupération de la conversation")?;

        if let Some(conv) = conversation {
            let messages = self
                .fetch_conversation_messages(conv.id)
                .await
                .unwrap_or_default();
            Ok(Some(ConversationDetail {
                conversation: conv,
                messages,
            }))
        } else {
            Ok(None)
        }
    }

    pub async fn delete_conversation(&self, user_id: Uuid, conv_id: Uuid) -> Result<bool> {
        let result = sqlx::query("DELETE FROM conversations WHERE id = $1 AND user_id = $2")
            .bind(conv_id)
            .bind(user_id)
            .execute(&self.pool)
            .await
            .context("Erreur lors de la suppression de la conversation")?;

        Ok(result.rows_affected() > 0)
    }

    pub async fn add_message(
        &self,
        user_id: Uuid,
        conv_id: Uuid,
        new_msg: &NewMessage,
    ) -> Result<MessageRow> {
        // 1. Vérifier l'existence de la conversation
        let conv = self
            .fetch_conversation_owned_by_user(user_id, conv_id)
            .await
            .context("Conversation non trouvée ou accès refusé")?;

        // 2. Stocker le message utilisateur
        self.store_user_message(conv_id, new_msg)
            .await
            .context("Erreur lors de l'enregistrement du message utilisateur")?;

        // 3. Reconstituer l'historique pour le LLM
        let history = self
            .build_conversation_history(&conv)
            .await
            .context("Erreur lors de la construction de l'historique de conversation")?;

        // 4. Générer et stocker la réponse AI
        let assistant = self
            .generate_and_store_ai_reply(&conv, &history)
            .await
            .context("Erreur lors de la génération ou l'enregistrement de la réponse AI")?;

        // 5. Déclencher l'update de titre en asynchrone (non bloquant)
        let pool_clone = self.pool.clone();
        let conv_id_clone = conv_id;
        let model_clone = conv.model.clone();
        let history_clone = history.clone();
        let ollama_clone = self.ollama.clone();

        // Appel synchrone à update_title_if_needed pour éviter le problème de Send dans tokio::spawn
        tokio::spawn(async move {
            // On capture l'erreur en String pour garantir Send
            if let Err(e) = update_title_if_needed_safe(
                pool_clone,
                ollama_clone,
                conv_id_clone,
                &model_clone,
                &history_clone,
            )
            .await
            {
                error!("Erreur lors de la génération du titre : {}", e);
            }
        });

        // 6. Update le timestamp d'activité
        self.update_conversation_timestamp(conv_id)
            .await
            .context("Erreur lors de la mise à jour du timestamp de la conversation")?;

        Ok(assistant)
    }

    pub async fn list_messages(
        &self,
        user_id: Uuid,
        conv_id: Uuid,
    ) -> Result<Option<Vec<MessageRow>>> {
        if !self.user_owns_conversation(user_id, conv_id).await? {
            return Ok(None);
        }
        let messages = self.fetch_conversation_messages(conv_id).await?;
        Ok(Some(messages))
    }

    // --- PRIVATE HELPERS ---

    async fn fetch_conversation_owned_by_user(
        &self,
        user_id: Uuid,
        conv_id: Uuid,
    ) -> Result<Conversation> {
        let conv = sqlx::query_as::<_, Conversation>(
            "SELECT * FROM conversations WHERE id = $1 AND user_id = $2",
        )
        .bind(conv_id)
        .bind(user_id)
        .fetch_optional(&self.pool)
        .await
        .context("Erreur lors de la recherche de la conversation")?
        .ok_or_else(|| anyhow!("Conversation non trouvée"))?;
        Ok(conv)
    }

    async fn store_user_message(&self, conv_id: Uuid, new_msg: &NewMessage) -> Result<()> {
        sqlx::query(
            "INSERT INTO messages (conversation_id, sender_role, content) VALUES ($1, $2, $3)",
        )
        .bind(&conv_id)
        .bind(&new_msg.role)
        .bind(&new_msg.content)
        .execute(&self.pool)
        .await
        .context("Erreur lors de l'insertion du message utilisateur")?;
        Ok(())
    }

    async fn build_conversation_history(&self, conv: &Conversation) -> Result<Vec<Message>> {
        let mut history = Vec::new();
        if !conv.system_prompt.is_empty() {
            history.push(Message {
                role: "system".to_string(),
                content: conv.system_prompt.clone(),
            });
        }
        
        let existing = self
            .fetch_conversation_messages(conv.id)
            .await
            .context("Erreur lors de la récupération des messages de la conversation")?;

        let mut history: Vec<Message> = existing
            .into_iter()
            .map(|m| Message {
                role: m.sender_role,
                content: m.content,
            })
            .collect();

        if !history.iter().any(|m| m.role == "system") && !conv.system_prompt.is_empty() {
            history.insert(
                0,
                Message {
                    role: "system".to_string(),
                    content: conv.system_prompt.clone(),
                },
            );
        }

        Ok(history)
    }

    async fn fetch_conversation_messages(&self, conv_id: Uuid) -> Result<Vec<MessageRow>> {
        sqlx::query_as::<_, MessageRow>(
            "SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC",
        )
        .bind(conv_id)
        .fetch_all(&self.pool)
        .await
        .context("Erreur lors de la récupération des messages")
    }

    async fn generate_and_store_ai_reply(
        &self,
        conv: &Conversation,
        history: &[Message],
    ) -> Result<MessageRow> {
        let ai_result = self.ollama.chat(&conv.model, history).await.map_err(|e| {
            anyhow!("Erreur lors de l'appel à Ollama pour la génération de la réponse AI: {e}")
        })?;
        let assistant_content = ai_result
            .get("message")
            .and_then(|m| m.get("content"))
            .and_then(|v| v.as_str())
            .unwrap_or("")
            .trim()
            .to_string();

        let assistant = sqlx::query_as::<_, MessageRow>(
            "INSERT INTO messages (conversation_id, sender_role, content) VALUES ($1, 'assistant', $2) RETURNING *",
        )
        .bind(&conv.id)
        .bind(assistant_content)
        .fetch_one(&self.pool)
        .await
        .context("Erreur lors de l'insertion du message assistant")?;

        info!("AI reply generated and stored for conversation {}", conv.id);

        Ok(assistant)
    }

    async fn update_conversation_timestamp(&self, conv_id: Uuid) -> Result<()> {
        sqlx::query("UPDATE conversations SET updated_at = now() WHERE id = $1")
            .bind(&conv_id)
            .execute(&self.pool)
            .await
            .context("Erreur lors de la mise à jour du timestamp")?;
        Ok(())
    }

    async fn user_owns_conversation(&self, user_id: Uuid, conv_id: Uuid) -> Result<bool> {
        let exists = sqlx::query_scalar::<_, i64>(
            "SELECT 1 FROM conversations WHERE id = $1 AND user_id = $2",
        )
        .bind(&conv_id)
        .bind(&user_id)
        .fetch_optional(&self.pool)
        .await
        .context("Erreur lors de la vérification de la propriété de la conversation")?
        .is_some();
        Ok(exists)
    }
}

// -------- ASYNC TITLE GENERATION TASK --------

async fn update_title_if_needed_safe(
    pool: PgPool,
    ollama: OllamaService,
    conv_id: Uuid,
    model: &str,
    history: &[Message],
) -> Result<(), String> {
    let user_message_count: (i64,) = sqlx::query_as(
        "SELECT COUNT(*) FROM messages WHERE conversation_id = $1 AND sender_role = 'user'",
    )
    .bind(&conv_id)
    .fetch_one(&pool)
    .await
    .unwrap_or((0,));

    if user_message_count.0 >= 3 {
        let mut title_history = history.to_vec();
        title_history.push(Message {
            role: "user".to_string(),
            content: TITLE_PROMPT.to_string(),
        });

        // On capture toute erreur en String ici
        let json = ollama
            .chat(model, &title_history)
            .await
            .map_err(|e| format!("Erreur Ollama: {e}"))?;

        let summary = json
            .get("message")
            .and_then(|m| m.get("content"))
            .and_then(|v| v.as_str())
            .map(|s| {
                s.trim()
                    .trim_matches('"')
                    .trim_end_matches('.')
                    .split_whitespace()
                    .take(6)
                    .collect::<Vec<_>>()
                    .join(" ")
            })
            .unwrap_or_else(|| "Nouvelle conversation".to_string());

        sqlx::query("UPDATE conversations SET title = $1 WHERE id = $2")
            .bind(&summary)
            .bind(&conv_id)
            .execute(&pool)
            .await
            .map_err(|e| format!("Erreur SQL: {e}"))?;
    }
    Ok(())
}
