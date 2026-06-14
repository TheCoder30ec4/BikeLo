from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

class SparePartBase(BaseModel):
    name: str
    brand: Optional[str] = None
    compatible_models: Optional[str] = None
    price: float = Field(ge=0)
    condition: Optional[str] = None
    description: Optional[str] = None
    is_available: bool = True

class SparePartImageResponse(BaseModel):
    id: int
    url: str
    created_at: datetime

    class Config:
        from_attributes = True

class SparePartResponse(BaseModel):
    id: int
    name: str
    brand: Optional[str]
    compatible_models: Optional[str]
    price: float
    condition: Optional[str]
    description: Optional[str]
    is_available: bool
    image_count: int
    created_at: datetime
    updated_at: datetime
    images: List[SparePartImageResponse] = []

    class Config:
        from_attributes = True
