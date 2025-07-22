use actix_web::{test as actix_test, web, App};
use api::config::Config;
use api::controllers;
use api::services::{
    auth::AuthService, conversation::ConversationService, ollama::OllamaService, user::UserService,
};
use httpmock::{Method::POST, MockServer};
use sqlx::postgres::PgPoolOptions;

static MIGRATOR: sqlx::migrate::Migrator = sqlx::migrate!("./migrations");

pub struct TestApp {
    pub app: actix_test::Service, // service for making requests
    pub auth: AuthService,
    pub pool: sqlx::PgPool,
    _mock: MockServer,
}

pub async fn setup_app() -> TestApp {
    let db_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgresql://postgres:postgres@localhost:5432/sya_db".to_string());
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&db_url)
        .await
        .expect("db connect");
    MIGRATOR.run(&pool).await.expect("migrations");

    let mock_server = MockServer::start();
    let _chat = mock_server.mock(|when, then| {
        when.method(POST).path("/api/chat");
        then.status(200)
            .json_body(serde_json::json!({"message": {"content": "pong"}}));
    });

    let cfg = Config::from_env();
    let auth = AuthService::new("secret".into());
    let ollama = OllamaService::new(mock_server.url(""));
    let users = UserService::new(pool.clone());
    let convs = ConversationService::new(pool.clone(), ollama);

    let app = actix_test::init_service(
        App::new()
            .app_data(web::Data::new(cfg))
            .app_data(web::Data::new(auth.clone()))
            .app_data(web::Data::new(users))
            .app_data(web::Data::new(convs))
            .configure(controllers::register),
    )
    .await;

    TestApp { app, auth, pool, _mock: mock_server }
}
