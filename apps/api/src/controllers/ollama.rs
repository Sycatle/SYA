use crate::auth_extractor::AuthenticatedUser;
use crate::services::ollama::OllamaService;
use actix_web::{web, HttpResponse, Responder};
use serde::Deserialize;

pub async fn ping(service: web::Data<OllamaService>, _user: AuthenticatedUser) -> impl Responder {
    match service.ping().await {
        Ok(result) => HttpResponse::Ok().body(format!("✅ Ollama répond : {}\n", result)),
        Err(e) => HttpResponse::InternalServerError().body(format!("❌ Erreur : {}\n", e)),
    }
}

pub async fn list_local_models(
    service: web::Data<OllamaService>,
    _user: AuthenticatedUser,
) -> impl Responder {
    match service.list_local_models().await {
        Ok(json) => HttpResponse::Ok().json(json),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

pub async fn list_remote_models(
    service: web::Data<OllamaService>,
    _user: AuthenticatedUser,
) -> impl Responder {
    match service.list_available_models().await {
        Ok(json) => HttpResponse::Ok().json(json),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

#[derive(Deserialize)]
pub struct PullRequest {
    pub name: String,
}

pub async fn pull_model(
    service: web::Data<OllamaService>,
    _user: AuthenticatedUser,
    payload: web::Json<PullRequest>,
) -> impl Responder {
    match service.pull_model(&payload.name).await {
        Ok(json) => HttpResponse::Ok().json(json),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}
