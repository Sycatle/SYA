use actix_web::{web, HttpRequest, HttpResponse, Responder};
use sqlx::PgPool;

use crate::models::{AuthResponse, LoginRequest, RegisterRequest, User};
use crate::services::auth::AuthService;

pub async fn register(
    pool: web::Data<PgPool>,
    auth: web::Data<AuthService>,
    payload: web::Json<RegisterRequest>,
) -> impl Responder {
    let hash = match auth.hash_password(&payload.password) {
        Ok(h) => h,
        Err(_) => return HttpResponse::InternalServerError().finish(),
    };

    let result = sqlx::query_as::<_, User>(
        "INSERT INTO users (email, password_hash, display_name) VALUES ($1, $2, $3) RETURNING *",
    )
    .bind(&payload.email)
    .bind(hash)
    .bind(&payload.display_name)
    .fetch_one(&**pool)
    .await;

    match result {
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

pub async fn login(
    pool: web::Data<PgPool>,
    auth: web::Data<AuthService>,
    payload: web::Json<LoginRequest>,
) -> impl Responder {
    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE email = $1")
        .bind(&payload.email)
        .fetch_optional(&**pool)
        .await
        .unwrap_or(None);

    if let Some(u) = user {
        if auth.verify_password(&payload.password, &u.password_hash) {
            if let Ok(token) = auth.generate_token(u.id) {
                return HttpResponse::Ok().json(AuthResponse {
                    token,
                    user: u.into(),
                });
            } else {
                return HttpResponse::InternalServerError().finish();
            }
        }
    }

    HttpResponse::Unauthorized().finish()
}

pub async fn me(
    pool: web::Data<PgPool>,
    auth: web::Data<AuthService>,
    req: HttpRequest,
) -> impl Responder {
    let token = req
        .headers()
        .get("Authorization")
        .and_then(|h| h.to_str().ok())
        .and_then(|s| s.strip_prefix("Bearer "));

    if let Some(token) = token {
        if let Some(claims) = auth.verify_token(token) {
            if let Ok(user) = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
                .bind(claims.sub)
                .fetch_one(&**pool)
                .await
            {
                if let Ok(new_token) = auth.generate_token(user.id) {
                    return HttpResponse::Ok().json(AuthResponse {
                        token: new_token,
                        user: user.into(),
                    });
                }
            }
        }
    }

    HttpResponse::Unauthorized().finish()
}
