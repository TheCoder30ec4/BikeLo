from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)
    phone: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)


class RefreshRequest(BaseModel):
    refresh_token: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    role: str
    status: str
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UpdateRoleRequest(BaseModel):
    role: Literal["user", "admin"] = Field(description="user | admin")


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class VerifyOTPRequest(BaseModel):
    email: EmailStr
    verify_otp: str = Field(alias="verify-otp")

    class Config:
        populate_by_name = True


# Password reset (production: send email with token/link)
class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    verify_otp: str = Field(alias="verify-otp")
    new_password: str = Field(min_length=8, max_length=72)

    class Config:
        populate_by_name = True
