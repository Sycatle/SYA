use actix_cors::Cors;
use actix_web::{web, App, HttpServer};

mod config;
mod handlers;
mod models;
mod routes;
mod services;
mod globals;

use config::Config;
use routes::register_routes;
use services::ollama::OllamaService;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenvy::dotenv().ok();
    let config = Config::from_env();
    let server_addr = config.server_addr.clone();
    let ollama_service = OllamaService::new(config.ollama_url.clone());

    println!("✅ API démarrée sur http://{}", server_addr);

    HttpServer::new(move || {
        App::new()
            .wrap(Cors::permissive())
            .app_data(web::Data::new(config.clone()))
            .app_data(web::Data::new(ollama_service.clone()))
            .configure(register_routes)
    })
    .bind(&server_addr)?
    .run()
    .await
}
