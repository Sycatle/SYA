use actix_web::{HttpResponse, Responder};

pub async fn ping() -> impl Responder {
    HttpResponse::Ok().body("pong 🧠")
}
