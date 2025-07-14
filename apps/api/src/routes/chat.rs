use crate::models::ChatRequest;
use crate::services::ollama::OllamaService;
use actix_web::{web, HttpResponse, Responder};

pub async fn chat(
    service: web::Data<OllamaService>,
    payload: web::Json<ChatRequest>,
) -> impl Responder {
    match service.generate(&payload.prompt, &payload.history).await {
        Ok(result) => HttpResponse::Ok().json(result),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": e.to_string()
        })),
    }
}
