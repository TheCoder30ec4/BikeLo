from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from DTOs.sell_bike_DTO import SellBikeResponse
from repositories.sell_bike_repository import SellBikeRepository
from utils.upload import save_sell_bike_document


class SellBikeService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = SellBikeRepository(db)

    async def submit_sell_bike(
        self,
        user_id: int,
        vehicle_type: str,
        registration_no: str | None,
        brand: str,
        model: str,
        year: int,
        ex_showroom: float | None,
        invoice: UploadFile | None,
        rc_card: UploadFile | None,
    ) -> SellBikeResponse:
        vehicle_type = (vehicle_type or "").strip().lower()
        if vehicle_type not in ("new", "existing"):
            raise HTTPException(422, detail="vehicle_type must be 'new' or 'existing'")
        if not (1900 <= year <= 2100):
            raise HTTPException(422, detail="year must be between 1900 and 2100")

        if vehicle_type == "existing":
            if not (registration_no and str(registration_no).strip()):
                raise HTTPException(422, detail="registration_no is required for existing/used vehicles")
            if not rc_card or not rc_card.filename:
                raise HTTPException(422, detail="RC card upload is required for used vehicles")
        else:
            if ex_showroom is None or ex_showroom < 0:
                raise HTTPException(422, detail="ex_showroom is required for new vehicles")
            if not invoice or not invoice.filename:
                raise HTTPException(422, detail="Invoice upload is required for new vehicles")

        data = {
            "user_id": user_id,
            "vehicle_type": vehicle_type,
            "registration_no": (registration_no or "").strip() or None,
            "brand": (brand or "").strip(),
            "model": (model or "").strip(),
            "year": year,
            "ex_showroom": ex_showroom if vehicle_type == "new" else None,
            "invoice_url": None,
            "rc_card_url": None,
        }
        row = self.repo.create(data)

        invoice_url = await save_sell_bike_document(invoice, row.id, "invoice_")
        rc_card_url = await save_sell_bike_document(rc_card, row.id, "rc_")
        if invoice_url or rc_card_url:
            self.repo.update_document_urls(row.id, invoice_url=invoice_url, rc_card_url=rc_card_url)
            row = self.repo.get_by_id(row.id)

        return SellBikeResponse.model_validate(row)
