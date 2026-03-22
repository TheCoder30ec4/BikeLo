import uuid
import requests
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException
from sqlalchemy.orm import Session

from config import settings
from DTOs.auth_DTO import LoginRequest, SignupRequest, VerifyOTPRequest, ResetPasswordRequest
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

    def _send_otp_webhook(self, email: str) -> None:
        url = "https://n8n.ch-varun.xyz/webhook/send-mail"
        payload = {"email": email}
        try:
            res = requests.post(url, json=payload, timeout=5)
            res.raise_for_status()
        except requests.RequestException as e:
            print(f"Error sending OTP webhook: {e}")

    def _verify_otp_webhook(self, email: str, otp: str) -> bool:
        url = "https://n8n.ch-varun.xyz/webhook/verify-otp"
        payload = {"email": email, "verify-otp": otp}
        try:
            res = requests.post(url, json=payload, timeout=5)
            # Assuming n8n returns 200 OK continuously if it's verified securely
            # Check the response logic if it returns JSON specifically signifying failure.
            if res.status_code == 200:
                return True
        except requests.RequestException as e:
            print(f"Error verifying OTP webhook: {e}")
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
            "role": data.role,
            "status": data.status,
            "is_verified": False,
            "created_at": now,
            "updated_at": now,
        }
        user = self.user_repo.create_user(user_dict)

        # Trigger OTP email
        self._send_otp_webhook(user.email)

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
        
        self._send_otp_webhook(email)
        return {"message": "If the email exists, a reset link will be sent"}

    def reset_password(self, data: ResetPasswordRequest) -> dict:
        user = self.user_repo.get_by_email(data.email)
        if not user:
            raise HTTPException(status_code=400, detail="Invalid request")
        
        is_valid = self._verify_otp_webhook(data.email, data.verify_otp)
        if not is_valid:
            raise HTTPException(status_code=400, detail="Invalid or expired OTP")
        
        user.password = hash_password(data.new_password)
        self.db.commit()
        return {"message": "Password successfully reset"}
