use actix_web::test as actix_test;
use uuid::Uuid;

mod common;

#[test]
fn hash_and_verify_password() {
    let svc = common::test_auth_service();
    let pwd = "hunter2";
    let hash = svc.hash_password(pwd).unwrap();
    assert!(svc.verify_password(pwd, &hash));
    assert!(!svc.verify_password("wrong", &hash));
}

#[test]
fn generate_and_verify_token() {
    let svc = common::test_auth_service();
    let uid = Uuid::new_v4();
    let token = svc.generate_token(uid).unwrap();
    let claims = svc.verify_token(&token).unwrap();
    assert_eq!(claims.sub, uid);
}

#[test]
fn verify_invalid_token_returns_none() {
    let svc = common::test_auth_service();
    assert!(svc.verify_token("invalid").is_none());
}

#[test]
fn extract_user_from_request() {
    let svc = common::test_auth_service();
    let uid = Uuid::new_v4();
    let token = svc.generate_token(uid).unwrap();
    let req = actix_test::TestRequest::default()
        .insert_header(("Authorization", format!("Bearer {}", token)))
        .to_http_request();
    assert_eq!(svc.user_id_from_request(&req), Some(uid));
}
