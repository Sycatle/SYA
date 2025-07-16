use crate::models::Message;
use reqwest::Client;
use std::error::Error;

#[derive(Clone)]
pub struct OllamaService {
    client: Client,
    pub base_url: String,
}

impl OllamaService {
    pub fn new(base_url: String) -> Self {
        Self {
            client: Client::new(),
            base_url,
        }
    }

    pub async fn ping(&self) -> Result<String, reqwest::Error> {
        let response = self.client.get(&self.base_url).send().await?;
        let status = response.status();
        let body = response.text().await?;
        Ok(format!("Status: {}, Body: {}", status, body))
    }

    pub async fn generate(
        &self,
        prompt: &str,
        history: &[Message],
    ) -> Result<serde_json::Value, Box<dyn Error>> {
        let url = format!("{}/api/generate", self.base_url.trim_end_matches('/'));
        let payload = serde_json::json!({
            "model": "llama3",
            "prompt": prompt,
            "messages": history,
            "stream": false,
        });

        let resp = self.client.post(url).json(&payload).send().await?;
        let text = resp.text().await?;

        println!("RAW Ollama response: {}", text);

        let json: serde_json::Value = serde_json::from_str(&text)?; // ✅ fonctionne maintenant
        Ok(json)
    }
}
