use std::sync::RwLock;
use once_cell::sync::Lazy;
use crate::models::Message;

pub static GLOBAL_HISTORY: Lazy<RwLock<Vec<Message>>> = Lazy::new(|| {
    RwLock::new(Vec::new())
});
