//! Utility service for password hashing and JWT management.

use argon2::{
    password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use rand_core::OsRng;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: Uuid,
    pub exp: usize,
}

/// Handles password hashing and JWT token creation/verification.
#[derive(Clone)]
pub struct AuthService {
    secret: String,
}

impl AuthService {
    /// Create a new `AuthService` using the provided secret.
    pub fn new(secret: String) -> Self {
        Self { secret }
    }

    /// Hash a password using Argon2.
    pub fn hash_password(&self, password: &str) -> Result<String, argon2::password_hash::Error> {
        let salt = SaltString::generate(&mut OsRng);
        let hash = Argon2::default()
            .hash_password(password.as_bytes(), &salt)?
            .to_string();
        Ok(hash)
    }

    /// Verify a plaintext password against its hash.
    pub fn verify_password(&self, password: &str, hash: &str) -> bool {
        let parsed_hash = PasswordHash::new(hash).ok();
        if let Some(ph) = parsed_hash {
            Argon2::default()
                .verify_password(password.as_bytes(), &ph)
                .is_ok()
        } else {
            false
        }
    }

    /// Generate a JWT for the given user id.
    pub fn generate_token(&self, user_id: Uuid) -> Result<String, jsonwebtoken::errors::Error> {
        let expiration = Utc::now() + Duration::minutes(15);
        let claims = Claims {
            sub: user_id,
            exp: expiration.timestamp() as usize,
        };
        encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.secret.as_ref()),
        )
    }

    /// Validate a JWT and return its claims if valid.
    pub fn verify_token(&self, token: &str) -> Option<Claims> {
        decode::<Claims>(
            token,
            &DecodingKey::from_secret(self.secret.as_ref()),
            &Validation::default(),
        )
        .map(|data| data.claims)
        .ok()
    }

    /// Extract and verify the token from a request, returning the associated user id.
    pub fn user_id_from_request(&self, req: &actix_web::HttpRequest) -> Option<Uuid> {
        req.headers()
            .get("Authorization")
            .and_then(|h| h.to_str().ok())
            .and_then(|s| s.strip_prefix("Bearer "))
            .and_then(|token| self.verify_token(token))
            .map(|c| c.sub)
    }
}
