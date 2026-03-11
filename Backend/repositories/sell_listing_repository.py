from sqlalchemy.orm import Session

from tables.sell_listings import SellListing


class SellListingRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, data: dict) -> SellListing:
        row = SellListing(**data)
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return row
