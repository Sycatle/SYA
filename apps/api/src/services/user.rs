//! Data access layer for working with users.

use sqlx::PgPool;
use uuid::Uuid;

use crate::models::User;

/// Service responsible for interacting with `User` records in the database.
#[derive(Clone)]
pub struct UserService {
    pool: PgPool,
}

impl UserService {
    /// Create a new `UserService` using the provided database connection pool.
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    /// Persist a new user and return the created record.
    pub async fn create_user(
        &self,
        email: &str,
        password_hash: &str,
        display_name: &Option<String>,
    ) -> Result<User, sqlx::Error> {
        sqlx::query_as::<_, User>(
            "INSERT INTO users (email, password_hash, display_name) VALUES ($1, $2, $3) RETURNING *",
        )
        .bind(email)
        .bind(password_hash)
        .bind(display_name)
        .fetch_one(&self.pool)
        .await
    }

    /// Fetch a user by their e-mail address.
    pub async fn find_by_email(&self, email: &str) -> Result<Option<User>, sqlx::Error> {
        sqlx::query_as::<_, User>("SELECT * FROM users WHERE email = $1")
            .bind(email)
            .fetch_optional(&self.pool)
            .await
    }

    /// Fetch a user by their unique identifier.
    pub async fn find_by_id(&self, id: Uuid) -> Result<Option<User>, sqlx::Error> {
        sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
            .bind(id)
            .fetch_optional(&self.pool)
            .await
    }
}
