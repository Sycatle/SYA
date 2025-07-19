//! Data structures describing conversations and related payloads.

use serde::{Deserialize, Serialize};

use crate::models::message::MessageRow;

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
#[derive(Debug, Deserialize)]
pub struct CreateConversation {
    pub title: Option<String>,
    pub system_prompt: Option<String>,
    pub model: Option<String>,
}

/// A conversation along with all its messages.
#[derive(Debug, Serialize)]
pub struct ConversationDetail {
    pub conversation: Conversation,
    pub messages: Vec<MessageRow>,
}
