use actix_cors::Cors;
use actix_web::{web, App, HttpServer};

mod auth_extractor;
mod config;
mod controllers;
mod models;
mod services;

use config::Config;
use controllers::register;
use services::{auth::AuthService, ollama::OllamaService, user::UserService};
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

    let user_service = UserService::new(pool.clone());

    let conversation_service =
        services::conversation::ConversationService::new(pool.clone(), ollama_service.clone());

    MIGRATOR.run(&pool).await.expect("failed to run migrations");

    println!("✅ API démarrée sur http://{}", server_addr);

    HttpServer::new(move || {
        App::new()
            .wrap(Cors::permissive())
            .app_data(web::Data::new(config.clone()))
            .app_data(web::Data::new(ollama_service.clone()))
            .app_data(web::Data::new(auth_service.clone()))
            .app_data(web::Data::new(user_service.clone()))
            .app_data(web::Data::new(conversation_service.clone()))
            .configure(register)
    })
    .bind(&server_addr)?
    .run()
    .await
}
