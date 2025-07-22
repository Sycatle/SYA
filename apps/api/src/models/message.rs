//! Message structures used throughout the API.

use serde::{Deserialize, Serialize};

/// A message exchanged with the LLM API.
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Message {
    pub role: String,
    pub content: String,
}

/// Row returned from the `messages` table.
#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct MessageRow {
    pub id: uuid::Uuid,
    pub conversation_id: uuid::Uuid,
    pub sender_role: String,
    pub content: String,
    pub token_count: Option<i32>,
    pub is_streamed: bool,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

/// Payload for creating a new message.
#[derive(Debug, Serialize, Deserialize)]
pub struct NewMessage {
    pub role: String,
    pub content: String,
}
