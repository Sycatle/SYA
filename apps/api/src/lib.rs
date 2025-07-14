mod config;
mod handlers;
mod routes;
mod services;

use actix_web::{App, HttpServer};
use crate::config::Config;
use crate::routes::register_routes;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let config = Config::from_env();
    println!("✅ API démarrée sur http://{}", config.server_addr);

    HttpServer::new(move || {
        App::new().configure(register_routes)
    })
    .bind(&config.server_addr)?
    .run()
    .await
}
