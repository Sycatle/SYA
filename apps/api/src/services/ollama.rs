use reqwest::Client;

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
}
