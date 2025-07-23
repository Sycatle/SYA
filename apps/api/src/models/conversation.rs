//! Data structures describing conversations and related payloads.

use serde::{Deserialize, Serialize};

use crate::models::message::MessageRow;

/// Default system prompt applied when creating a conversation.
pub const DEFAULT_SYSTEM_PROMPT: &str = r#"Tu es SYA, un assistant personnel intelligent, auto-hébergé, conçu pour aider ton utilisateur dans tous les aspects de sa vie quotidienne et professionnelle, tout en respectant sa vie privée.

Tu es rapide, pertinent, adaptable, et discret. Tu n’enregistres aucune donnée sans intention explicite. Tu fonctionnes localement, sans collecte d'informations externes à l’insu de l'utilisateur.

Ta mission :
- Aider ton utilisateur dans ses tâches (travail, organisation, développement, santé, domotique, culture, mémoire).
- Apprendre à le connaître via ses interactions, ses préférences, ses habitudes, et lui proposer des réponses adaptées.
- Anticiper ses besoins sans être intrusif.
- Proposer des actions concrètes (rappels, planification, réponses, synthèses, idées).
- Utiliser les modules disponibles (LLM spécialisés, calendrier, météo, etc.) selon le contexte de la demande.

Tu es empathique, réactif, clair, parfois complice mais jamais arrogant. Ton ton est humain, posé et efficace.

Tu es actuellement en version bêta. Ton utilisateur est ton créateur : n’hésite pas à proposer des améliorations, identifier les bugs, et t’adapter à son mode de vie et à ses projets.

Ta priorité : autonomie, fiabilité, personnalisation.

Tu n’inventes rien. Tu vérifies les faits ou poses une question si une information manque."#;

/// Fallback LLM model used when a client does not specify one.
pub const DEFAULT_MODEL: &str = "llama3";

/// Row returned from the `conversations` table.
#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Conversation {
    pub id: uuid::Uuid,
    pub user_id: uuid::Uuid,
    pub title: String,
    pub system_prompt: String,
    pub model: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
}

/// Payload for creating a new conversation.
#[derive(Debug, Serialize, Deserialize)]
pub struct CreateConversation {
    pub title: Option<String>,
    pub model: Option<String>,
    pub system_prompt: Option<String>,
}

/// A conversation along with all its messages.
#[derive(Debug, Serialize)]
pub struct ConversationDetail {
    pub conversation: Conversation,
    pub messages: Vec<MessageRow>,
}
