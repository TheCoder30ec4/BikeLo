from sqlalchemy.orm import Session

from tables.sell_bikes import SellBike


class SellBikeRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, data: dict) -> SellBike:
        row = SellBike(**data)
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return row

    def get_by_id(self, sell_bike_id: int) -> SellBike | None:
        return self.db.query(SellBike).filter(SellBike.id == sell_bike_id).first()

    def update_document_urls(
        self,
        sell_bike_id: int,
        *,
        invoice_url: str | None = None,
        rc_card_url: str | None = None,
    ) -> SellBike | None:
        row = self.get_by_id(sell_bike_id)
        if not row:
            return None
        if invoice_url is not None:
            row.invoice_url = invoice_url
        if rc_card_url is not None:
            row.rc_card_url = rc_card_url
        self.db.commit()
        self.db.refresh(row)
        return row
