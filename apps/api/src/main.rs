use actix_cors::Cors;
use actix_web::{web, App, HttpServer};

mod config;
mod handlers;
mod models;
mod routes;
mod services;

use config::Config;
use routes::register_routes;
use services::{auth::AuthService, ollama::OllamaService};
use sqlx::postgres::PgPoolOptions;

static MIGRATOR: sqlx::migrate::Migrator = sqlx::migrate!("./migrations");

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenvy::dotenv().ok();
    let config = Config::from_env();
    let server_addr = config.server_addr.clone();
    let ollama_service = OllamaService::new(config.ollama_url.clone());
    let auth_service = AuthService::new(config.jwt_secret.clone());
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&config.database_url)
        .await
        .expect("failed to connect to database");

    let conversation_service = services::conversation::ConversationService::new(
        pool.clone(),
        ollama_service.clone(),
    );

    MIGRATOR.run(&pool).await.expect("failed to run migrations");

    println!("✅ API démarrée sur http://{}", server_addr);

    HttpServer::new(move || {
        App::new()
            .wrap(Cors::permissive())
            .app_data(web::Data::new(config.clone()))
            .app_data(web::Data::new(pool.clone()))
            .app_data(web::Data::new(ollama_service.clone()))
            .app_data(web::Data::new(auth_service.clone()))
            .app_data(web::Data::new(conversation_service.clone()))
            .configure(register_routes)
    })
    .bind(&server_addr)?
    .run()
    .await
}
