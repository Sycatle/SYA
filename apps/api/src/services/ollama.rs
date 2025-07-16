use crate::models::Message;
use crate::globals::GLOBAL_HISTORY;
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
    ) -> Result<serde_json::Value, Box<dyn Error>> {
        let url = format!("{}/api/chat", self.base_url.trim_end_matches('/'));

        // ⬇️ On récupère l'historique existant et ajoute le prompt
        let mut history = GLOBAL_HISTORY.write().unwrap();
        history.push(Message {
            role: "user".to_string(),
            content: prompt.to_string(),
        });

        let payload = serde_json::json!({
            "model": "llama3",
            "messages": &*history,
            "stream": false,
        });

        let resp = self.client.post(&url).json(&payload).send().await?;
        let text = resp.text().await?;

        println!("RAW Ollama response: {}", text);

        let json: serde_json::Value = serde_json::from_str(&text)?;

        // ⬇️ On extrait la réponse du modèle et l’ajoute à l’historique
        if let Some(assistant_msg) = json.get("message") {
            if let Some(content) = assistant_msg.get("content").and_then(|v| v.as_str()) {
                history.push(Message {
                    role: "assistant".to_string(),
                    content: content.to_string(),
                });
            }
        }

        Ok(json)
    }

}
