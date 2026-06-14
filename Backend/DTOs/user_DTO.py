from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field

class UserResponseDTO(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    role: str
    status: str
    is_verified: bool

    class Config:
        from_attributes = True

class UserUpdateDTO(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None

class UserCreateDTO(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)
    phone: str
    role: Literal["user", "admin"] = "user"
    status: Literal["active", "inactive"] = "active"

class AdminUserUpdateDTO(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[Literal["user", "admin"]] = None
    status: Optional[Literal["active", "inactive"]] = None
