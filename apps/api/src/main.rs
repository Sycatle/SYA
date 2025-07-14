use actix_web::{get, App, HttpServer, Responder};

#[get("/health")]
async fn health() -> impl Responder {
    "SYA API is alive 🚀"
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("🚀 Starting SYA API on 0.0.0.0:3001");
    HttpServer::new(|| App::new().service(health))
        .bind(("0.0.0.0", 3001))?
        .run()
        .await
}

