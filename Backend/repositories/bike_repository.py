from typing import Iterable, List

from sqlalchemy.orm import Session

from tables.bikes import Bike, BikeImage


class BikeRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_bike(
        self,
        data: dict,
        image_urls: Iterable[str] | None = None,
        *,
        commit: bool = True,
    ) -> Bike:
        bike = Bike(**data)
        self.db.add(bike)
        self.db.flush()

        url_list = list(image_urls or [])
        for url in url_list:
            self.db.add(BikeImage(bike_id=bike.id, url=url))
        bike.image_count = len(url_list)
        if commit:
            self.db.commit()
            self.db.refresh(bike)
        return bike

    def add_images(self, bike_id: int, urls: List[str], *, commit: bool = True) -> Bike | None:
        bike = self.db.query(Bike).filter(Bike.id == bike_id).first()
        if not bike:
            return None
        for url in urls:
            self.db.add(BikeImage(bike_id=bike_id, url=url))
        bike.image_count += len(urls)
        if commit:
            self.db.commit()
            self.db.refresh(bike)
        return bike

    def get_by_id(self, bike_id: int) -> Bike | None:
        return self.db.query(Bike).filter(Bike.id == bike_id).first()

    def list_bikes(self) -> List[Bike]:
        return self.db.query(Bike).order_by(Bike.created_at.desc()).all()

    def update_bike(self, bike_id: int, data: dict) -> Bike | None:
        bike = self.get_by_id(bike_id)
        if not bike:
            return None
        for key, value in data.items():
            if hasattr(bike, key):
                setattr(bike, key, value)
        self.db.commit()
        self.db.refresh(bike)
        return bike

    def delete_bike(self, bike_id: int) -> bool:
        bike = self.get_by_id(bike_id)
        if not bike:
            return False
        self.db.delete(bike)
        self.db.commit()
        return True
