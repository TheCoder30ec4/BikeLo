from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from DTOs.spare_part_DTO import SparePartResponse
from repositories.spare_part_repository import SparePartRepository
from utils.upload import (
    delete_files_for_urls,
    delete_spare_part_upload_folder,
    save_spare_part_images,
    validate_image_uploads,
)

class SparePartService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = SparePartRepository(db)

    async def create_with_uploads(
        self,
        part_data: dict,
        files: list[UploadFile],
    ) -> SparePartResponse:
        validated_files = await validate_image_uploads(files, max_files=5)
        part = None
        try:
            part = self.repo.create(part_data, [], commit=False)
            urls = await save_spare_part_images(validated_files, part.id)
            if urls:
                part = self.repo.add_images(part.id, urls, commit=False)
            self.db.commit()
            self.db.refresh(part)
            return SparePartResponse.model_validate(part)
        except HTTPException:
            self.db.rollback()
            if part is not None:
                delete_spare_part_upload_folder(part.id)
            raise
        except Exception:
            self.db.rollback()
            if part is not None:
                delete_spare_part_upload_folder(part.id)
            raise

    async def update_part(
        self,
        part_id: int,
        data: dict,
        files: list[UploadFile] = None,
    ) -> SparePartResponse:
        part = self.repo.get_by_id(part_id)
        if not part:
            raise HTTPException(status_code=404, detail="Spare part not found")

        if files:
            validated_files = await validate_image_uploads(files, max_files=5)
            try:
                if data:
                    part = self.repo.update(part_id, data, commit=False)
                old_urls = [image.url for image in part.images]
                urls = await save_spare_part_images(validated_files, part_id)
                self.repo.clear_images(part_id, commit=False)
                if urls:
                    part = self.repo.add_images(part_id, urls, commit=False)
                self.db.commit()
                self.db.refresh(part)
                delete_files_for_urls(old_urls)
            except HTTPException:
                self.db.rollback()
                raise
            except Exception:
                self.db.rollback()
                raise
        elif data:
            part = self.repo.update(part_id, data)

        return SparePartResponse.model_validate(part)

    def delete_part(self, part_id: int) -> None:
        part = self.repo.get_by_id(part_id)
        if not part:
            raise HTTPException(status_code=404, detail="Spare part not found")
        delete_spare_part_upload_folder(part_id)
        self.repo.delete(part_id)

    def list_parts(self) -> list[SparePartResponse]:
        parts = self.repo.list_all()
        return [SparePartResponse.model_validate(p) for p in parts]
