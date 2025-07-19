use actix_web::{dev::Payload, error::ErrorUnauthorized, web, FromRequest, HttpRequest};
use std::future::{ready, Ready};
use uuid::Uuid;

use crate::services::auth::AuthService;

/// Extractor ensuring the request contains a valid JWT.
/// Returns the associated user id on success.
#[derive(Debug, Clone, Copy)]
pub struct AuthenticatedUser(pub Uuid);

impl FromRequest for AuthenticatedUser {
    type Error = actix_web::Error;
    type Future = Ready<Result<Self, Self::Error>>;

    fn from_request(req: &HttpRequest, _: &mut Payload) -> Self::Future {
        let auth_service = req.app_data::<web::Data<AuthService>>();
        if let Some(service) = auth_service {
            if let Some(uid) = service.user_id_from_request(req) {
                return ready(Ok(AuthenticatedUser(uid)));
            }
        }
        ready(Err(ErrorUnauthorized("Invalid or missing token")))
    }
}
