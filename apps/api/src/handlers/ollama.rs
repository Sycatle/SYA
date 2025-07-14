use actix_web::{HttpResponse, Responder};
use crate::services::ollama::ping_ollama;

pub async fn ping() -> impl Responder {
    match ping_ollama().await {
        Ok(result) => HttpResponse::Ok().body(format!("✅ Ollama répond : {}", result)),
        Err(e) => HttpResponse::InternalServerError().body(format!("❌ Erreur : {}", e)),
    }
}
