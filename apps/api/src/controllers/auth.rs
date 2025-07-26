//! Handlers for authentication-related HTTP endpoints.

use actix_web::{web, HttpResponse, Responder};
use tracing::error;
use regex::Regex;

use crate::auth_extractor::AuthenticatedUser;
use crate::models::{AuthResponse, LoginRequest, RegisterRequest};
use crate::services::{auth::AuthService, user::UserService};

// Email validation regex
static EMAIL_REGEX: once_cell::sync::Lazy<Regex> = once_cell::sync::Lazy::new(|| {
    Regex::new(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$").unwrap()
});

fn is_valid_email(email: &str) -> bool {
    EMAIL_REGEX.is_match(email)
}

/// Register a new user and immediately return an authentication token.
pub async fn register(
    users: web::Data<UserService>,
    auth: web::Data<AuthService>,
    payload: web::Json<RegisterRequest>,
) -> impl Responder {
    let req = payload.into_inner();

    // Validate input manually
    if req.email.is_empty() || !is_valid_email(&req.email) {
        return HttpResponse::BadRequest().body("Invalid email format");
    }
    if req.password.len() < 8 || req.password.len() > 128 {
        return HttpResponse::BadRequest().body("Password must be between 8 and 128 characters");
    }
    if let Some(ref name) = req.display_name {
        if name.len() > 100 {
            return HttpResponse::BadRequest().body("Display name must be less than 100 characters");
        }
    }

    let hash = match auth.hash_password(&req.password) {
        Ok(h) => h,
        Err(_) => return HttpResponse::InternalServerError().finish(),
    };

    match users.create_user(&req.email, &hash, &req.display_name).await {
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
        }
    }
}

/// Authenticate a user and return a fresh token.
pub async fn login(
    users: web::Data<UserService>,
    auth: web::Data<AuthService>,
    payload: web::Json<LoginRequest>,
) -> impl Responder {
    let req = payload.into_inner();

    // Validate input manually
    if req.email.is_empty() || !is_valid_email(&req.email) {
        return HttpResponse::BadRequest().body("Invalid email format");
    }
    if req.password.is_empty() {
        return HttpResponse::BadRequest().body("Password cannot be empty");
    }

    match users.find_by_email(&req.email).await {
        Ok(Some(u)) if auth.verify_password(&req.password, &u.password_hash) => {
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

/// Retrieve the authenticated user (no new token).
pub async fn me(
    users: web::Data<UserService>,
    _auth: web::Data<AuthService>,
    user: AuthenticatedUser,
) -> impl Responder {
    match users.find_by_id(user.0).await {
        Ok(Some(db_user)) => {
            let public_user: crate::models::user::UserPublic = db_user.into();
            HttpResponse::Ok().json(serde_json::json!({ "user": public_user }))
        }
        Ok(None) => HttpResponse::Unauthorized().finish(),
        Err(e) => {
            error!("me error: {e}");
            HttpResponse::InternalServerError().body("Internal server error")
        }
    }
}
