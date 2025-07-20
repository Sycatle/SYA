use api::services::auth::AuthService;

pub fn test_auth_service() -> AuthService {
    AuthService::new("secret".to_string())
}
