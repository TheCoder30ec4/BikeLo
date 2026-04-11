from pydantic import BaseModel, Field

class LeadCaptureRequest(BaseModel):
    email: str
    subject: str
    user_html: str = Field(..., alias="UserHTML")
    admin_html: str = Field(..., alias="AdminHTML")

    class Config:
        populate_by_name = True
