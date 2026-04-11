from pydantic import BaseModel, EmailStr
from typing import Optional

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
    password: str
    phone: str
    role: Optional[str] = "user"
    status: Optional[str] = "active"

class AdminUserUpdateDTO(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None