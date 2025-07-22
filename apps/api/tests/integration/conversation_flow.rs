use actix_web::test as actix_test;
use api::models::{CreateConversation, LoginRequest, NewMessage, RegisterRequest};

use super::helpers::setup_app;

#[actix_web::test]
#[ignore]
async fn create_conversation_and_message() {
    let test = setup_app().await;

    // register user
    let register = RegisterRequest {
        email: "conv@example.com".into(),
        password: "pwd".into(),
        display_name: None,
    };
    let req = actix_test::TestRequest::post()
        .uri("/api/register")
        .set_json(&register)
        .to_request();
    let _resp: api::models::AuthResponse = actix_test::call_and_read_body_json(&test.app, req).await;

    // login user
    let login = LoginRequest { email: register.email.clone(), password: register.password.clone() };
    let req = actix_test::TestRequest::post()
        .uri("/api/login")
        .set_json(&login)
        .to_request();
    let resp: api::models::AuthResponse = actix_test::call_and_read_body_json(&test.app, req).await;
    let token = resp.token;

    // create conversation
    let conv = CreateConversation { title: None, system_prompt: None, model: None };
    let req = actix_test::TestRequest::post()
        .uri("/api/conversations")
        .insert_header(("Authorization", format!("Bearer {}", token)))
        .set_json(&conv)
        .to_request();
    let conv_resp: api::models::conversation::Conversation = actix_test::call_and_read_body_json(&test.app, req).await;

    // send message
    let msg = NewMessage { role: "user".into(), content: "Bonjour".into() };
    let req = actix_test::TestRequest::post()
        .uri(&format!("/api/conversations/{}/messages", conv_resp.id))
        .insert_header(("Authorization", format!("Bearer {}", token)))
        .set_json(&msg)
        .to_request();
    let _resp: api::models::message::MessageRow = actix_test::call_and_read_body_json(&test.app, req).await;
}
