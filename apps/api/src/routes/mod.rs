use actix_web::web;
use crate::handlers::{health, ollama};

pub fn register_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/api/health").route(web::get().to(health::ping)));
    cfg.service(web::resource("/api/ollama").route(web::get().to(ollama::ping)));
}