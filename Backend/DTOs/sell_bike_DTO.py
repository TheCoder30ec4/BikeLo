from datetime import datetime
from pydantic import BaseModel, Field


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

    class Config:
        from_attributes = True
