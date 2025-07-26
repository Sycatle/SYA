//! Handlers for authentication-related HTTP endpoints.

use actix_web::{web, HttpResponse, Responder};

use crate::auth_extractor::AuthenticatedUser;
use crate::models::{AuthResponse, LoginRequest, RegisterRequest};
use crate::services::{auth::AuthService, user::UserService};
use tracing::error;

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
        Err(e) => {
            error!("register error: {e}");
            HttpResponse::BadRequest().body("Invalid request")
        },
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
        Err(e) => {
            error!("login error: {e}");
            HttpResponse::InternalServerError().body("Internal server error")
        },
    }
}

/// Retrieve the authenticated user (no new token).
pub async fn me(
    users: web::Data<UserService>,
    _auth: web::Data<AuthService>,
    user: AuthenticatedUser,
) -> impl Responder {
    match users.find_by_id(user.0).await {
        Ok(Some(db_user)) => {
            let public_user: crate::models::user::UserPublic = db_user.into();
            HttpResponse::Ok().json(public_user)
        },
        Ok(None) => HttpResponse::Unauthorized().finish(),
        Err(e) => {
            error!("me error: {e}");
            HttpResponse::InternalServerError().body("Internal server error")
        },
    }
}
