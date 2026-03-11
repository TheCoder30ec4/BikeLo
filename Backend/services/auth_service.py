import uuid
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException
from sqlalchemy.orm import Session

from config import settings
from DTOs.auth_DTO import LoginRequest, SignupRequest
from repositories.refresh_token_repository import RefreshTokenRepository
from repositories.user_repository import UserRepository
from utils.security import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    hash_password,
    verify_password,
)


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.refresh_repo = RefreshTokenRepository(db)

    def signup(self, data: SignupRequest) -> tuple[str, str]:
        existing = self.user_repo.get_by_email(data.email)
        if existing:
            raise HTTPException(status_code=400, detail="User already exists with this email")

        now = datetime.now(timezone.utc)
        user_dict = {
            "name": data.name,
            "email": data.email,
            "password": hash_password(data.password),
            "phone": data.phone,
            "role": data.role,
            "status": data.status,
            "created_at": now,
            "updated_at": now,
        }
        user = self.user_repo.create_user(user_dict)

        jti = str(uuid.uuid4())
        expires_at = now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        self.refresh_repo.create(user_id=user.id, jti=jti, expires_at=expires_at)

        access = create_access_token(user.id)
        refresh = create_refresh_token(user.id, jti=jti)
        return access, refresh

    def login(self, data: LoginRequest) -> tuple[str, str]:
        user = self.user_repo.get_by_email(data.email)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        if not verify_password(data.password, user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        if user.status != "active":
            raise HTTPException(status_code=403, detail="Account is inactive")

        jti = str(uuid.uuid4())
        expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        self.refresh_repo.create(user_id=user.id, jti=jti, expires_at=expires_at)

        access = create_access_token(user.id)
        refresh = create_refresh_token(user.id, jti=jti)
        return access, refresh

    def refresh_tokens(self, refresh_token: str) -> tuple[str, str]:
        payload = decode_refresh_token(refresh_token)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

        jti = payload.get("jti")
        sub = payload.get("sub")
        if not jti or not sub:
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        stored = self.refresh_repo.get_by_jti(jti)
        if not stored:
            raise HTTPException(status_code=401, detail="Refresh token revoked or unknown")

        user_id = int(sub)
        if stored.user_id != user_id:
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        self.refresh_repo.revoke_by_jti(jti)

        new_jti = str(uuid.uuid4())
        expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        self.refresh_repo.create(user_id=user_id, jti=new_jti, expires_at=expires_at)

        access = create_access_token(user_id)
        refresh = create_refresh_token(user_id, jti=new_jti)
        return access, refresh

    def list_all_users(self) -> list:
        return self.user_repo.get_all()

    def update_user_role(self, user_id: int, role: str) -> None:
        if role not in ("user", "admin"):
            raise HTTPException(status_code=400, detail="role must be 'user' or 'admin'")
        user = self.user_repo.update_role(user_id, role)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
