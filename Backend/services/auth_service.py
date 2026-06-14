import logging
import uuid
from datetime import datetime, timedelta, timezone

import requests
from fastapi import HTTPException
from sqlalchemy.orm import Session

from config import settings
from DTOs.auth_DTO import LoginRequest, ResetPasswordRequest, SignupRequest, VerifyOTPRequest
from repositories.refresh_token_repository import RefreshTokenRepository
from repositories.user_repository import UserRepository
from utils.security import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    hash_password,
    verify_password,
)

logger = logging.getLogger(__name__)


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.refresh_repo = RefreshTokenRepository(db)

    def _send_otp_webhook(self, email: str) -> bool:
        payload = {"email": email}
        try:
            res = requests.post(settings.SEND_OTP_WEBHOOK_URL, json=payload, timeout=5)
            res.raise_for_status()
            return True
        except requests.RequestException as e:
            logger.warning("OTP send webhook failed for %s: %s", email, e)
            return False

    def _verification_response_is_valid(self, response: requests.Response) -> bool:
        try:
            payload = response.json()
        except ValueError:
            return response.text.strip().lower() in {"true", "success", "verified", "valid", "ok"}

        if isinstance(payload, bool):
            return payload
        if isinstance(payload, str):
            return payload.strip().lower() in {"true", "success", "verified", "valid", "ok"}
        if isinstance(payload, dict):
            for key in ("verified", "success", "valid", "ok"):
                value = payload.get(key)
                if isinstance(value, bool):
                    return value
                if isinstance(value, str) and value.strip().lower() in {
                    "true",
                    "success",
                    "verified",
                    "valid",
                    "ok",
                }:
                    return True

            status_value = payload.get("status")
            if isinstance(status_value, str) and status_value.strip().lower() in {
                "success",
                "verified",
                "valid",
                "ok",
            }:
                return True

        return False

    def _verify_otp_webhook(self, email: str, otp: str) -> bool:
        payload = {"email": email, "verify-otp": otp}
        try:
            res = requests.post(settings.VERIFY_OTP_WEBHOOK_URL, json=payload, timeout=5)
            res.raise_for_status()
            return self._verification_response_is_valid(res)
        except requests.RequestException as e:
            logger.warning("OTP verify webhook failed for %s: %s", email, e)
        return False

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
            "role": "user",
            "status": "active",
            "is_verified": False,
            "created_at": now,
            "updated_at": now,
        }
        try:
            user = self.user_repo.create_user(user_dict, commit=False)
            if not self._send_otp_webhook(user.email):
                self.db.rollback()
                raise HTTPException(status_code=502, detail="Failed to send verification OTP")

            jti = str(uuid.uuid4())
            expires_at = now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
            self.refresh_repo.create(user_id=user.id, jti=jti, expires_at=expires_at, commit=False)
            self.db.commit()
            self.db.refresh(user)

            access = create_access_token(user.id)
            refresh = create_refresh_token(user.id, jti=jti)
            return access, refresh
        except HTTPException:
            raise
        except Exception:
            self.db.rollback()
            raise

    def login(self, data: LoginRequest) -> tuple[str, str]:
        user = self.user_repo.get_by_email(data.email)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        if not verify_password(data.password, user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        if user.status != "active":
            raise HTTPException(status_code=403, detail="Account is inactive")
        if not user.is_verified:
            raise HTTPException(status_code=403, detail="User not verified")

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
        user = self.user_repo.get_by_id(user_id)
        if not user:
            self.refresh_repo.revoke_by_jti(jti)
            raise HTTPException(status_code=401, detail="User not found")
        if user.status != "active":
            self.refresh_repo.revoke_all_for_user(user_id)
            raise HTTPException(status_code=403, detail="Account is inactive")
        if not user.is_verified:
            self.refresh_repo.revoke_all_for_user(user_id)
            raise HTTPException(status_code=403, detail="User not verified")
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

    def verify_account(self, data: VerifyOTPRequest) -> dict:
        user = self.user_repo.get_by_email(data.email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        if user.is_verified:
            return {"message": "User is already verified"}
        
        is_valid = self._verify_otp_webhook(data.email, data.verify_otp)
        if not is_valid:
            raise HTTPException(status_code=400, detail="Invalid or expired OTP")
        
        user.is_verified = True
        self.db.commit()
        return {"message": "User successfully verified"}

    def forgot_password(self, email: str) -> dict:
        user = self.user_repo.get_by_email(email)
        if not user:
            return {"message": "If the email exists, a reset link will be sent"}

        if not self._send_otp_webhook(email):
            raise HTTPException(status_code=502, detail="Failed to send password reset OTP")
        return {"message": "If the email exists, a reset link will be sent"}

    def reset_password(self, data: ResetPasswordRequest) -> dict:
        user = self.user_repo.get_by_email(data.email)
        if not user:
            raise HTTPException(status_code=400, detail="Invalid request")
        
        is_valid = self._verify_otp_webhook(data.email, data.verify_otp)
        if not is_valid:
            raise HTTPException(status_code=400, detail="Invalid or expired OTP")

        user.password = hash_password(data.new_password)
        self.refresh_repo.revoke_all_for_user(user.id, commit=False)
        self.db.commit()
        return {"message": "Password successfully reset"}
