from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session

from DataBase.core import get_db
from DTOs.sell_bike_DTO import SellBikeResponse
from dependencies.auth import CurrentUser
from services.sell_bike_service import SellBikeService

router = APIRouter(prefix="/sell-bikes", tags=["sell-bikes"])


@router.post("/", response_model=SellBikeResponse)
async def submit_sell_bike(
    current_user: CurrentUser,
    db: Session = Depends(get_db),
    vehicle_type: str = Form(..., description="'new' or 'existing'"),
    registration_no: str = Form("", description="Required for existing/used vehicles"),
    brand: str = Form(...),
    model: str = Form(...),
    year: int = Form(..., description="e.g. 2022"),
    ex_showroom: float | None = Form(None, description="Required for new vehicles only"),
    invoice: UploadFile | None = File(None, description="Upload invoice (new vehicles). PDF, JPG, PNG"),
    rc_card: UploadFile | None = File(None, description="Upload RC card (used vehicles). PDF, JPG, PNG"),
) -> SellBikeResponse:
    """
    Submit a bike for sale. User must be logged in.

    - **New vehicle**: provide ex_showroom and upload invoice.
    - **Existing/used vehicle**: provide registration_no and upload RC card.

    Note: Insurance companies' premium may vary due to provider internal policies.
    """
    service = SellBikeService(db)
    return await service.submit_sell_bike(
        user_id=current_user.id,
        vehicle_type=vehicle_type,
        registration_no=registration_no or None,
        brand=brand,
        model=model,
        year=year,
        ex_showroom=ex_showroom,
        invoice=invoice,
        rc_card=rc_card,
    )
