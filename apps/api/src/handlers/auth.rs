//! Handlers for authentication-related HTTP endpoints.

use actix_web::{web, HttpResponse, Responder};

use crate::auth_extractor::AuthenticatedUser;
use crate::models::{AuthResponse, LoginRequest, RegisterRequest};
use crate::services::{auth::AuthService, user::UserService};

/// Register a new user and immediately return an authentication token.
pub async fn register(
    users: web::Data<UserService>,
    auth: web::Data<AuthService>,
    payload: web::Json<RegisterRequest>,
) -> impl Responder {
    let hash = match auth.hash_password(&payload.password) {
        Ok(h) => h,
        Err(_) => return HttpResponse::InternalServerError().finish(),
    };

    match users
        .create_user(&payload.email, &hash, &payload.display_name)
        .await
    {
        Ok(user) => match auth.generate_token(user.id) {
            Ok(token) => HttpResponse::Ok().json(AuthResponse {
                token,
                user: user.into(),
            }),
            Err(_) => HttpResponse::InternalServerError().finish(),
        },
        Err(e) => HttpResponse::BadRequest().body(e.to_string()),
    }
}

/// Authenticate a user and return a fresh token.
pub async fn login(
    users: web::Data<UserService>,
    auth: web::Data<AuthService>,
    payload: web::Json<LoginRequest>,
) -> impl Responder {
    match users.find_by_email(&payload.email).await {
        Ok(Some(u)) if auth.verify_password(&payload.password, &u.password_hash) => {
            match auth.generate_token(u.id) {
                Ok(token) => HttpResponse::Ok().json(AuthResponse {
                    token,
                    user: u.into(),
                }),
                Err(_) => HttpResponse::InternalServerError().finish(),
            }
        }
        Ok(_) => HttpResponse::Unauthorized().finish(),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

/// Retrieve the authenticated user and issue a new token.
pub async fn me(
    users: web::Data<UserService>,
    auth: web::Data<AuthService>,
    user: AuthenticatedUser,
) -> impl Responder {
    match users.find_by_id(user.0).await {
        Ok(Some(db_user)) => match auth.generate_token(db_user.id) {
            Ok(new_token) => HttpResponse::Ok().json(AuthResponse {
                token: new_token,
                user: db_user.into(),
            }),
            Err(_) => HttpResponse::InternalServerError().finish(),
        },
        Ok(None) => HttpResponse::Unauthorized().finish(),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}
