use std::env;

pub struct Config {
    pub server_addr: String,
    pub ollama_url: String,
}

impl Config {
    pub fn from_env() -> Self {
        Self {
            server_addr: env::var("SERVER_ADDR").expect("SERVER_ADDR not set"),
            ollama_url: env::var("OLLAMA_URL").expect("OLLAMA_URL not set"),
        }
    }
}
