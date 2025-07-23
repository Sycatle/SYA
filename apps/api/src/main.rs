use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use actix_web::http;

use api::{config, controllers, services};

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
        let cors = if std::env::var("RUST_ENV").unwrap_or_else(|_| "development".to_string()) == "production" {
            // Configuration CORS stricte pour la production
            Cors::default()
                .allowed_origin_fn(|origin, _req_head| {
                    // En production, n'autoriser que le domaine spécifique
                    let allowed_origins = std::env::var("ALLOWED_ORIGINS")
                        .unwrap_or_else(|_| "https://yourdomain.com".to_string());
                    let allowed_domains: Vec<_> = allowed_origins
                        .split(',')
                        .map(|s| s.trim())
                        .collect();
                    
                    allowed_domains.iter().any(|domain| {
                        origin.as_bytes().starts_with(domain.as_bytes())
                    })
                })
                .allowed_methods(vec!["GET", "POST", "PUT", "PATCH", "DELETE"])
                .allowed_headers(vec![
                    http::header::AUTHORIZATION,
                    http::header::CONTENT_TYPE,
                    http::header::ACCEPT,
                ])
                .supports_credentials()
                .max_age(3600) // Cache preflight requests for 1 hour
        } else {
            // Configuration CORS permissive pour le développement
            Cors::default()
                .allowed_origin("http://localhost:3000")
                .allowed_origin("http://127.0.0.1:3000")
                .allowed_methods(vec!["GET", "POST", "PUT", "PATCH", "DELETE"])
                .allowed_headers(vec![
                    http::header::AUTHORIZATION,
                    http::header::CONTENT_TYPE,
                    http::header::ACCEPT,
                ])
                .supports_credentials()
        };

        App::new()
            .wrap(cors)
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
