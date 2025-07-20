pub mod health;
pub mod ollama;
pub mod conversations;
pub mod auth;

use actix_web::web;

/// Register all API routes and associate them with controllers.
pub fn register(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/api/health").route(web::get().to(health::ping)));
    cfg.service(web::resource("/api/ollama").route(web::get().to(ollama::ping)));
    cfg.service(web::resource("/api/register").route(web::post().to(auth::register)));
    cfg.service(web::resource("/api/login").route(web::post().to(auth::login)));
    cfg.service(web::resource("/api/me").route(web::get().to(auth::me)));

    cfg.service(
        web::resource("/api/conversations")
            .route(web::post().to(conversations::create_conversation))
            .route(web::get().to(conversations::list_conversations)),
    );
    cfg.service(
        web::resource("/api/conversations/{id}")
            .route(web::get().to(conversations::get_conversation))
            .route(web::delete().to(conversations::delete_conversation)),
    );
    cfg.service(
        web::resource("/api/conversations/{id}/messages")
            .route(web::post().to(conversations::add_message))
            .route(web::get().to(conversations::list_messages)),
    );
}
