from datetime import datetime

from pydantic import BaseModel, Field


class SellListingRequest(BaseModel):
    model: str = Field(..., min_length=1, max_length=200)
    year: int = Field(..., ge=1900, le=2100)
    no_of_owners: int = Field(..., ge=1, description="Number of owners")
    insurance_available: bool = Field(..., description="Insurance available (yes/no)")
    finance_hypothecation: bool = Field(..., description="Finance or hypothecation (yes/no)")
    original_rc_available: bool = Field(..., description="Original RC available (yes/no)")


class SellListingResponse(BaseModel):
    id: int
    user_id: int
    model: str
    year: int
    no_of_owners: int
    insurance_available: bool
    finance_hypothecation: bool
    original_rc_available: bool
    created_at: datetime

    class Config:
        from_attributes = True
