from typing import Iterable, List, Optional
from sqlalchemy.orm import Session
from tables.spare_parts import SparePart, SparePartImage

class SparePartRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, data: dict, image_urls: Iterable[str] | None = None) -> SparePart:
        part = SparePart(**data)
        self.db.add(part)
        self.db.flush()

        url_list = list(image_urls or [])
        for url in url_list:
            self.db.add(SparePartImage(spare_part_id=part.id, url=url))
        part.image_count = len(url_list)
        self.db.commit()
        self.db.refresh(part)
        return part

    def add_images(self, part_id: int, urls: List[str]) -> Optional[SparePart]:
        part = self.get_by_id(part_id)
        if not part:
            return None
        for url in urls:
            self.db.add(SparePartImage(spare_part_id=part_id, url=url))
        part.image_count += len(urls)
        self.db.commit()
        self.db.refresh(part)
        return part

    def get_by_id(self, part_id: int) -> Optional[SparePart]:
        return self.db.query(SparePart).filter(SparePart.id == part_id).first()

    def list_all(self) -> List[SparePart]:
        return self.db.query(SparePart).order_by(SparePart.created_at.desc()).all()

    def clear_images(self, part_id: int) -> bool:
        part = self.get_by_id(part_id)
        if not part:
            return False
        self.db.query(SparePartImage).filter(SparePartImage.spare_part_id == part_id).delete()
        part.image_count = 0
        self.db.commit()
        self.db.refresh(part)
        return True

    def update(self, part_id: int, data: dict) -> Optional[SparePart]:
        part = self.get_by_id(part_id)
        if not part:
            return None
        for key, value in data.items():
            if hasattr(part, key):
                setattr(part, key, value)
        self.db.commit()
        self.db.refresh(part)
        return part

    def delete(self, part_id: int) -> bool:
        part = self.get_by_id(part_id)
        if not part:
            return False
        self.db.delete(part)
        self.db.commit()
        return True
