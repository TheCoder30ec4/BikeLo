from datetime import datetime
from typing import List

from pydantic import BaseModel, Field, field_validator
from config import settings


class BikeBase(BaseModel):
    make: str
    model_name: str
    year: int = Field(ge=1900, le=2100)
    km_driven: int = Field(ge=0)
    ownership: int = Field(ge=1)
    price: float = Field(ge=0)
    insurance: bool
    is_new: bool = False
    description: str | None = None
    is_ad: bool = False


class CreateBikeRequest(BikeBase):
    image_urls: List[str] = Field(default_factory=list, description="URLs of uploaded bike images")


class UpdateBikeRequest(BaseModel):
    """Partial update; only provided fields are updated."""
    make: str | None = None
    model_name: str | None = None
    year: int | None = Field(None, ge=1900, le=2100)
    km_driven: int | None = Field(None, ge=0)
    ownership: int | None = Field(None, ge=1)
    price: float | None = Field(None, ge=0)
    insurance: bool | None = None
    is_new: bool | None = None
    description: str | None = None
    is_ad: bool | None = None


class BikeImageResponse(BaseModel):
    id: int
    url: str
    created_at: datetime

    class Config:
        from_attributes = True


class BikeResponse(BaseModel):
    """API response for a bike. No strict validation so existing DB rows (e.g. year=0) serialize without error."""
    id: int
    make: str
    model_name: str
    year: int
    km_driven: int
    ownership: int
    price: float
    insurance: bool
    is_new: bool
    description: str | None
    is_ad: bool
    image_count: int
    created_at: datetime
    updated_at: datetime | None = None
    images: list[BikeImageResponse] = []

    class Config:
        from_attributes = True

