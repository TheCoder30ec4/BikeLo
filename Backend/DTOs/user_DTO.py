from pydantic import BaseModel
from typing import Optional

class UserResponseDTO(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    # add any other fields from your User model here

    class Config:
        from_attributes = True  # orm_mode = True if Pydantic v1