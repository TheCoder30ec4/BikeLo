from sqlalchemy.orm import Session

from DTOs.sell_listing_DTO import SellListingRequest, SellListingResponse
from repositories.sell_listing_repository import SellListingRepository


class SellListingService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = SellListingRepository(db)

    def create_listing(self, user_id: int, data: SellListingRequest) -> SellListingResponse:
        row = self.repo.create({
            "user_id": user_id,
            "model": data.model.strip(),
            "year": data.year,
            "no_of_owners": data.no_of_owners,
            "insurance_available": data.insurance_available,
            "finance_hypothecation": data.finance_hypothecation,
            "original_rc_available": data.original_rc_available,
        })
        return SellListingResponse.model_validate(row)
