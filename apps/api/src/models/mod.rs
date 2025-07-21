//! Aggregate all API data models.

pub mod conversation;
pub mod message;
pub mod user;

pub use conversation::{
    Conversation,
    ConversationDetail,
    CreateConversation,
    DEFAULT_MODEL,
    DEFAULT_SYSTEM_PROMPT,
};
pub use message::{Message, MessageRow, NewMessage};
pub use user::{AuthResponse, LoginRequest, RegisterRequest, User};
