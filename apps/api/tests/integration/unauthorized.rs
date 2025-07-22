use actix_web::test as actix_test;
use api::models::CreateConversation;

use super::helpers::setup_app;

#[actix_web::test]
#[ignore]
async fn unauthorized_prompt_fails() {
    let test = setup_app().await;

    let req = actix_test::TestRequest::post()
        .uri("/api/conversations")
        .set_json(&CreateConversation { title: None, system_prompt: None, model: None })
        .to_request();
    let resp = actix_test::call_service(&test.app, req).await;
    assert_eq!(resp.status(), 401);
}
