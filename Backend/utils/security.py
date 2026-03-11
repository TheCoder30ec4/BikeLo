import bcrypt
import jwt
from datetime import datetime, timedelta, timezone

from config import settings


def hash_password(plain: str) -> str:
    """
    Hash a password with bcrypt. Enforces 72-byte limit (bcrypt max).
    """
    raw = plain.encode("utf-8")
    if len(raw) > 72:
        raise ValueError("Password too long; must be at most 72 bytes.")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(raw, salt)
    return hashed.decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(user_id), "exp": expire, "type": "access"}
    return jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )


def create_refresh_token(user_id: int, jti: str) -> str:
    """Create a refresh JWT. Caller must pass a unique jti and store it in refresh_tokens table."""
    expire = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {"sub": str(user_id), "exp": expire, "type": "refresh", "jti": jti}
    return jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )


def decode_token(token: str) -> dict | None:
    try:
        return jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
    except jwt.PyJWTError:
        return None


def decode_access_token(token: str) -> dict | None:
    """Decode and validate access token; returns None if invalid or not access type."""
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        return None
    return payload


def decode_refresh_token(token: str) -> dict | None:
    """Decode and validate refresh token; returns None if invalid or not refresh type."""
    payload = decode_token(token)
    if not payload or payload.get("type") != "refresh":
        return None
    return payload
