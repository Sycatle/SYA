use crate::handlers::{health, ollama};
use actix_web::web;
pub mod auth;
pub mod chat;

pub fn register_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/api/health").route(web::get().to(health::ping)));
    cfg.service(web::resource("/api/ollama").route(web::get().to(ollama::ping)));
    cfg.service(web::resource("/api/chat").route(web::post().to(chat::chat)));
    cfg.service(web::resource("/api/register").route(web::post().to(auth::register)));
    cfg.service(web::resource("/api/login").route(web::post().to(auth::login)));
    cfg.service(web::resource("/api/me").route(web::get().to(auth::me)));
}
