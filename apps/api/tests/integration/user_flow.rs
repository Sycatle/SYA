use actix_web::test as actix_test;
use api::models::{LoginRequest, RegisterRequest};

use super::helpers::setup_app;

#[actix_web::test]
#[ignore]
async fn register_and_login() {
    let test = setup_app().await;

    let register = RegisterRequest {
        email: "test@example.com".into(),
        password: "pwd".into(),
        display_name: None,
    };
    let req = actix_test::TestRequest::post()
        .uri("/api/register")
        .set_json(&register)
        .to_request();
    let resp: api::models::AuthResponse = actix_test::call_and_read_body_json(&test.app, req).await;
    assert!(!resp.token.is_empty());

    let login = LoginRequest { email: register.email.clone(), password: register.password.clone() };
    let req = actix_test::TestRequest::post()
        .uri("/api/login")
        .set_json(&login)
        .to_request();
    let resp: api::models::AuthResponse = actix_test::call_and_read_body_json(&test.app, req).await;
    assert!(!resp.token.is_empty());
}
