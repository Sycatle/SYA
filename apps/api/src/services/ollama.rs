use reqwest::Client;
use std::env;
use std::error::Error;

pub async fn ping_ollama() -> Result<String, Box<dyn Error>> {
    let client = Client::new();

    // Utilise la variable d'environnement OLLAMA_URL ou un fallback
    let url = env::var("OLLAMA_URL").unwrap_or_else(|_| "http://ollama:11434/".to_string());

    // Utilise l'instance client au lieu de client::get
    let response = client.get(&url).send().await?;

    let status = response.status();
    let body = response.text().await?;

    Ok(format!("Status: {}, Body: {}", status, body))
}
