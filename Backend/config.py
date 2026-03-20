import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseModel):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "change-me-in-production")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads")
    API_BASE_URL: str = os.getenv("API_BASE_URL", "http://localhost:8000")


settings = Settings()
