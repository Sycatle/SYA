use actix_web::FromRequest;
use actix_web::{test as actix_test, web};
use api::auth_extractor::AuthenticatedUser;
use uuid::Uuid;

mod common;

#[actix_web::test]
async fn extractor_succeeds_with_valid_token() {
    let svc = common::test_auth_service();
    let uid = Uuid::new_v4();
    let token = svc.generate_token(uid).unwrap();

    let req = actix_test::TestRequest::default()
        .insert_header(("Authorization", format!("Bearer {}", token)))
        .app_data(web::Data::new(svc.clone()))
        .to_http_request();

    let mut payload = actix_web::dev::Payload::None;
    let res = AuthenticatedUser::from_request(&req, &mut payload)
        .await
        .unwrap();
    assert_eq!(res.0, uid);
}

#[actix_web::test]
async fn extractor_fails_without_token() {
    let svc = common::test_auth_service();
    let req = actix_test::TestRequest::default()
        .app_data(web::Data::new(svc))
        .to_http_request();

    let mut payload = actix_web::dev::Payload::None;
    assert!(AuthenticatedUser::from_request(&req, &mut payload)
        .await
        .is_err());
}
