use crate::models::Message;
use once_cell::sync::Lazy;
use std::sync::RwLock;

pub static GLOBAL_HISTORY: Lazy<RwLock<Vec<Message>>> = Lazy::new(|| RwLock::new(Vec::new()));
