from app.core.security import verify_password, get_password_hash, create_access_token
from jose import jwt
from app.core.config import settings

def test_password_hashing():
    raw_pass = "SecureSecret123"
    hashed = get_password_hash(raw_pass)
    assert hashed != raw_pass
    assert verify_password(raw_pass, hashed) is True
    assert verify_password("WrongPassword", hashed) is False

def test_jwt_token_creation():
    subject = "user-12345"
    token = create_access_token(subject=subject, role="admin")
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    assert payload["sub"] == subject
    assert payload["role"] == "admin"
    assert "exp" in payload
