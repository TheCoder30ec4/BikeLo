from datetime import datetime
from pydantic import BaseModel, Field, field_validator
from config import settings


class SellBikeResponse(BaseModel):
    id: int
    user_id: int
    vehicle_type: str
    registration_no: str | None
    brand: str
    model: str
    year: int
    ex_showroom: float | None
    invoice_url: str | None
    rc_card_url: str | None
    created_at: datetime
    updated_at: datetime | None = None

    @field_validator('invoice_url', 'rc_card_url', mode='after')
    @classmethod
    def prepend_base_url(cls, v: str | None) -> str | None:
        if v and v.startswith("/"):
            return f"{settings.API_BASE_URL.rstrip('/')}{v}"
        return v

    class Config:
        from_attributes = True
