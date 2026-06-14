import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseModel):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads")
    API_BASE_URL: str = os.getenv("API_BASE_URL", "http://localhost:8000")
    APP_PORT: int = int(os.getenv("APP_PORT", "8000"))
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO").upper()
    SEND_OTP_WEBHOOK_URL: str = os.getenv(
        "SEND_OTP_WEBHOOK_URL",
        "https://n8n.ch-varun.xyz/webhook/send-mail",
    )
    VERIFY_OTP_WEBHOOK_URL: str = os.getenv(
        "VERIFY_OTP_WEBHOOK_URL",
        "https://n8n.ch-varun.xyz/webhook/verify-otp",
    )
    LEAD_CAPTURE_WEBHOOK_URL: str = os.getenv(
        "LEAD_CAPTURE_WEBHOOK_URL",
        "https://n8n.ch-varun.xyz/webhook/lead-capture",
    )
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "")
    ADMIN_NAME: str = os.getenv("ADMIN_NAME", "Admin")
    ADMIN_PHONE: str = os.getenv("ADMIN_PHONE", "0000000000")


settings = Settings()


def validate_runtime_settings() -> None:
    if not settings.JWT_SECRET_KEY:
        raise RuntimeError("JWT_SECRET_KEY must be set")
    if settings.JWT_SECRET_KEY.lower() == "change-me-in-production":
        raise RuntimeError("JWT_SECRET_KEY must not use the insecure default value")
