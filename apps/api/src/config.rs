use std::env;

#[derive(Clone)]
pub struct Config {
    pub server_addr: String,
    pub ollama_url: String,
    pub database_url: String,
    pub jwt_secret: String,
}

impl Config {
    pub fn from_env() -> Self {
        Self {
            server_addr: env::var("SERVER_ADDR").unwrap_or_else(|_| "0.0.0.0:3001".to_string()),
            ollama_url: env::var("OLLAMA_URL")
                .unwrap_or_else(|_| "http://ollama:11434/".to_string()),
            database_url: env::var("DATABASE_URL").unwrap_or_else(|_| {
                "postgresql://postgres:postgres@localhost:5432/sya_db".to_string()
            }),
            jwt_secret: env::var("JWT_SECRET").unwrap_or_else(|_| "secret".to_string()),
        }
    }
}
