//! Client wrapper for interacting with the Ollama API.

use crate::models::Message;
use reqwest::Client;
use serde_json::Value;
use std::error::Error;

const OLLAMA_LIBRARY_URL: &str = "https://ollama.ai";

#[derive(Clone)]
/// Thin wrapper around `reqwest` for calling the Ollama API.
pub struct OllamaService {
    client: Client,
    pub base_url: String,
}

impl OllamaService {
    /// Create a new service pointing at the given base URL.
    pub fn new(base_url: String) -> Self {
        Self {
            client: Client::new(),
            base_url,
        }
    }

    /// Simple health check to verify the Ollama API is reachable.
    pub async fn ping(&self) -> Result<String, reqwest::Error> {
        let response = self.client.get(&self.base_url).send().await?;
        let status = response.status();
        let body = response.text().await?;
        Ok(format!("Status: {}, Body: {}", status, body))
    }

    /// Send a chat completion request with the provided history.
    pub async fn chat(
        &self,
        model: &str,
        messages: &[Message],
    ) -> Result<serde_json::Value, Box<dyn Error>> {
        let url = format!("{}/api/chat", self.base_url.trim_end_matches('/'));

        let payload = serde_json::json!({
            "model": model,
            "messages": messages,
            "stream": false,
        });

        let resp = self.client.post(&url).json(&payload).send().await?;
        let text = resp.text().await?;

        println!("RAW Ollama response: {}", text);

        let json: serde_json::Value = serde_json::from_str(&text)?;

        Ok(json)
    }

    /// Get the list of locally installed models from the Ollama daemon.
    pub async fn list_local_models(&self) -> Result<Value, reqwest::Error> {
        let url = format!("{}/api/tags", self.base_url.trim_end_matches('/'));
        let resp = self.client.get(url).send().await?;
        resp.json::<Value>().await
    }

    /// Fetch the list of models available in the public Ollama library.
    pub async fn list_available_models(&self) -> Result<Value, reqwest::Error> {
        let url = format!("{}/api/tags", OLLAMA_LIBRARY_URL);
        let resp = self.client.get(url).send().await?;
        resp.json::<Value>().await
    }

    /// Trigger the download of a model through the Ollama daemon.
    pub async fn pull_model(&self, name: &str) -> Result<Value, reqwest::Error> {
        let url = format!("{}/api/pull", self.base_url.trim_end_matches('/'));
        let payload = serde_json::json!({ "name": name, "stream": false });
        let resp = self.client.post(url).json(&payload).send().await?;
        resp.json::<Value>().await
    }
}
