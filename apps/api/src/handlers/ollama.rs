use actix_web::{HttpResponse, Responder, web};
use crate::services::ollama::OllamaService;

pub async fn ping(service: web::Data<OllamaService>) -> impl Responder {
    match service.ping().await {
        Ok(result) => HttpResponse::Ok().body(format!("✅ Ollama répond : {}", result)),
        Err(e) => HttpResponse::InternalServerError().body(format!("❌ Erreur : {}", e)),
    }
}
