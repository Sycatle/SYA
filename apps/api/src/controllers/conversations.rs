//! HTTP route handlers for conversation APIs.

use actix_web::{web, HttpResponse, Responder};

use crate::auth_extractor::AuthenticatedUser;
use crate::models::{CreateConversation, NewMessage};
use crate::services::conversation::ConversationService;
use serde::Deserialize;
use tracing::error;

/// POST `/api/conversations` - create a new conversation for the current user.
pub async fn create_conversation(
    service: web::Data<ConversationService>,
    user: AuthenticatedUser,
    payload: web::Json<CreateConversation>,
) -> impl Responder {
    let user_id = user.0;

    match service.create_conversation(user_id, &payload).await {
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
    let user_id = user.0;

    match service
        .add_message(user_id, path.into_inner(), &payload)
        .await
    {
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
