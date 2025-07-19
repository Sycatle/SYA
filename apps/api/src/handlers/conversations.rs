//! HTTP route handlers for conversation APIs.

use actix_web::{web, HttpRequest, HttpResponse, Responder};

use crate::models::{CreateConversation, NewMessage};
use crate::services::{auth::AuthService, conversation::ConversationService};

/// POST `/api/conversations` - create a new conversation for the current user.
pub async fn create_conversation(
    service: web::Data<ConversationService>,
    auth: web::Data<AuthService>,
    req: HttpRequest,
    payload: web::Json<CreateConversation>,
) -> impl Responder {
    let user_id = match auth.user_id_from_request(&req) {
        Some(id) => id,
        None => return HttpResponse::Unauthorized().finish(),
    };

    match service.create_conversation(user_id, &payload).await {
        Ok(conv) => HttpResponse::Ok().json(conv),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

/// GET `/api/conversations` - list conversations for the user.
pub async fn list_conversations(
    service: web::Data<ConversationService>,
    auth: web::Data<AuthService>,
    req: HttpRequest,
) -> impl Responder {
    let user_id = match auth.user_id_from_request(&req) {
        Some(id) => id,
        None => return HttpResponse::Unauthorized().finish(),
    };

    match service.list_conversations(user_id).await {
        Ok(list) => HttpResponse::Ok().json(list),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

/// GET `/api/conversations/{id}` - fetch a conversation and its messages.
pub async fn get_conversation(
    service: web::Data<ConversationService>,
    auth: web::Data<AuthService>,
    req: HttpRequest,
    path: web::Path<uuid::Uuid>,
) -> impl Responder {
    let user_id = match auth.user_id_from_request(&req) {
        Some(id) => id,
        None => return HttpResponse::Unauthorized().finish(),
    };

    match service
        .get_conversation_detail(user_id, path.into_inner())
        .await
    {
        Ok(Some(detail)) => HttpResponse::Ok().json(detail),
        Ok(None) => HttpResponse::NotFound().finish(),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

/// DELETE `/api/conversations/{id}` - remove a conversation.
pub async fn delete_conversation(
    service: web::Data<ConversationService>,
    auth: web::Data<AuthService>,
    req: HttpRequest,
    path: web::Path<uuid::Uuid>,
) -> impl Responder {
    let user_id = match auth.user_id_from_request(&req) {
        Some(id) => id,
        None => return HttpResponse::Unauthorized().finish(),
    };

    match service
        .delete_conversation(user_id, path.into_inner())
        .await
    {
        Ok(true) => HttpResponse::NoContent().finish(),
        Ok(false) => HttpResponse::NotFound().finish(),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

/// POST `/api/conversations/{id}/messages` - append a message and get the assistant reply.
pub async fn add_message(
    service: web::Data<ConversationService>,
    auth: web::Data<AuthService>,
    req: HttpRequest,
    path: web::Path<uuid::Uuid>,
    payload: web::Json<NewMessage>,
) -> impl Responder {
    let user_id = match auth.user_id_from_request(&req) {
        Some(id) => id,
        None => return HttpResponse::Unauthorized().finish(),
    };

    match service
        .add_message(user_id, path.into_inner(), &payload)
        .await
    {
        Ok(msg) => HttpResponse::Ok().json(msg),
        Err(e) => {
            if e.to_string() == "conversation not found" {
                HttpResponse::NotFound().finish()
            } else {
                HttpResponse::InternalServerError().body(e.to_string())
            }
        }
    }
}

/// GET `/api/conversations/{id}/messages` - list messages chronologically.
pub async fn list_messages(
    service: web::Data<ConversationService>,
    auth: web::Data<AuthService>,
    req: HttpRequest,
    path: web::Path<uuid::Uuid>,
) -> impl Responder {
    let user_id = match auth.user_id_from_request(&req) {
        Some(id) => id,
        None => return HttpResponse::Unauthorized().finish(),
    };

    match service.list_messages(user_id, path.into_inner()).await {
        Ok(Some(list)) => HttpResponse::Ok().json(list),
        Ok(None) => HttpResponse::NotFound().finish(),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}
