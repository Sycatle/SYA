use std::env;

pub struct Config {
    pub server_addr: String,
}

impl Config {
    pub fn from_env() -> Self {
        let server_addr = env::var("SERVER_ADDR").unwrap_or_else(|_| "0.0.0.0:3001".to_string());
        Config { server_addr }
    }
}
