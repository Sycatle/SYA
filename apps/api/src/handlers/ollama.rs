use crate::services::ollama::OllamaService;
use actix_web::{web, HttpResponse, Responder};

pub async fn ping(service: web::Data<OllamaService>) -> impl Responder {
    match service.ping().await {
        Ok(result) => HttpResponse::Ok().body(format!("✅ Ollama répond : {}\n", result)),
        Err(e) => HttpResponse::InternalServerError().body(format!("❌ Erreur : {}\n", e)),
    }
}
