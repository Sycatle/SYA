//! HTTP route handlers for conversation APIs.

use actix_web::{web, HttpResponse, Responder};

use crate::auth_extractor::AuthenticatedUser;
use crate::models::{CreateConversation, NewMessage};
use crate::services::conversation::ConversationService;
use crate::services::ollama::OllamaService;
use serde::Deserialize;
use tracing::error;
use std::collections::HashSet;

/// POST `/api/conversations` - create a new conversation for the current user.
pub async fn create_conversation(
    service: web::Data<ConversationService>,
    ollama: web::Data<OllamaService>,
    user: AuthenticatedUser,
    payload: web::Json<CreateConversation>,
) -> impl Responder {
    // Validate input manually
    let req = payload.into_inner();
    if let Some(ref model) = req.model {
        if model.len() > 50 {
            return HttpResponse::BadRequest().body("Model name must be less than 50 characters");
        }
        // Validate that the model exists
        match ollama.list_local_models().await {
            Ok(models_json) => {
                if let Some(models) = models_json.get("models") {
                    if let Some(models_array) = models.as_array() {
                        let available_models: HashSet<String> = models_array
                            .iter()
                            .filter_map(|m| m.get("name").and_then(|n| n.as_str()))
                            .map(|s| s.to_string())
                            .collect();
                        
                        if !available_models.contains(model) {
                            return HttpResponse::BadRequest().body("Invalid model name");
                        }
                    }
                }
            }
            Err(_) => {
                // If we can't verify the model, reject the request
                return HttpResponse::BadRequest().body("Unable to verify model availability");
            }
        }
    }
    if let Some(ref prompt) = req.system_prompt {
        if prompt.len() > 1000 {
            return HttpResponse::BadRequest().body("System prompt must be less than 1000 characters");
        }
    }

    let user_id = user.0;

    match service.create_conversation(user_id, &req).await {
        Ok(conv) => HttpResponse::Ok().json(conv),
        Err(e) => {
            error!("create_conversation error: {e}");
            HttpResponse::InternalServerError().body("Internal server error")
        },
    }
}

/// GET `/api/conversations` - list conversations for the user.
pub async fn list_conversations(
    service: web::Data<ConversationService>,
    user: AuthenticatedUser,
) -> impl Responder {
    let user_id = user.0;

    match service.list_conversations(user_id).await {
        Ok(list) => HttpResponse::Ok().json(list),
        Err(e) => {
            error!("list_conversations error: {e}");
            HttpResponse::InternalServerError().body("Internal server error")
        },
    }
}

/// GET `/api/conversations/{id}` - fetch a conversation and its messages.
pub async fn get_conversation(
    service: web::Data<ConversationService>,
    user: AuthenticatedUser,
    path: web::Path<uuid::Uuid>,
) -> impl Responder {
    let user_id = user.0;

    match service
        .get_conversation_detail(user_id, path.into_inner())
        .await
    {
        Ok(Some(detail)) => HttpResponse::Ok().json(detail),
        Ok(None) => HttpResponse::NotFound().finish(),
        Err(e) => {
            error!("get_conversation error: {e}");
            HttpResponse::InternalServerError().body("Internal server error")
        },
    }
}

/// DELETE `/api/conversations/{id}` - remove a conversation.
pub async fn delete_conversation(
    service: web::Data<ConversationService>,
    user: AuthenticatedUser,
    path: web::Path<uuid::Uuid>,
) -> impl Responder {
    let user_id = user.0;

    match service
        .delete_conversation(user_id, path.into_inner())
        .await
    {
        Ok(true) => HttpResponse::NoContent().finish(),
        Ok(false) => HttpResponse::NotFound().finish(),
        Err(e) => {
            error!("delete_conversation error: {e}");
            HttpResponse::InternalServerError().body("Internal server error")
        },
    }
}

/// POST `/api/conversations/{id}/messages` - append a message and get the assistant reply.
pub async fn add_message(
    service: web::Data<ConversationService>,
    user: AuthenticatedUser,
    path: web::Path<uuid::Uuid>,
    payload: web::Json<NewMessage>,
) -> impl Responder {
    // Validate input manually
    let req = payload.into_inner();
    if req.role != "user" && req.role != "assistant" && req.role != "system" {
        return HttpResponse::BadRequest().body("Invalid role. Must be 'user', 'assistant', or 'system'");
    }
    if req.content.len() > 10000 {
        return HttpResponse::BadRequest().body("Message content must be less than 10000 characters");
    }
    if req.content.is_empty() {
        return HttpResponse::BadRequest().body("Message content cannot be empty");
    }

    let user_id = user.0;
    let conversation_id = path.into_inner();

    match service.add_message(user_id, conversation_id, &req).await {
        Ok(msg) => HttpResponse::Ok().json(msg),
        Err(e) => {
            error!("add_message error: {e}");
            HttpResponse::InternalServerError().body("Internal server error")
        }
    }
}

/// GET `/api/conversations/{id}/messages` - list messages chronologically.
pub async fn list_messages(
    service: web::Data<ConversationService>,
    user: AuthenticatedUser,
    path: web::Path<uuid::Uuid>,
) -> impl Responder {
    let user_id = user.0;

    match service.list_messages(user_id, path.into_inner()).await {
        Ok(Some(list)) => HttpResponse::Ok().json(list),
        Ok(None) => HttpResponse::NotFound().finish(),
        Err(e) => {
            error!("list_messages error: {e}");
            HttpResponse::InternalServerError().body("Internal server error")
        },
    }
}

#[derive(Deserialize)]
pub struct UpdateModel {
    pub model: String,
}

/// PATCH `/api/conversations/{id}` - update conversation model.
pub async fn update_model(
    service: web::Data<ConversationService>,
    user: AuthenticatedUser,
    path: web::Path<uuid::Uuid>,
    payload: web::Json<UpdateModel>,
) -> impl Responder {
    let user_id = user.0;

    match service
        .update_conversation_model(user_id, path.into_inner(), &payload.model)
        .await
    {
        Ok(Some(conv)) => HttpResponse::Ok().json(conv),
        Ok(None) => HttpResponse::NotFound().finish(),
        Err(e) => {
            error!("update_model error: {e}");
            HttpResponse::InternalServerError().body("Internal server error")
        },
    }
}
