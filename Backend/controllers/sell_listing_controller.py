from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from DataBase.core import get_db
from DTOs.sell_listing_DTO import SellListingRequest, SellListingResponse
from dependencies.auth import CurrentUser
from services.sell_listing_service import SellListingService

router = APIRouter(prefix="/sell-listings", tags=["sell-listings"])


@router.post("/", response_model=SellListingResponse)
def create_sell_listing(
    current_user: CurrentUser,
    data: SellListingRequest,
    db: Session = Depends(get_db),
) -> SellListingResponse:
    """Submit a simple bike sell listing (model, year, owners, insurance, finance, original RC). Requires auth."""
    service = SellListingService(db)
    return service.create_listing(current_user.id, data)
