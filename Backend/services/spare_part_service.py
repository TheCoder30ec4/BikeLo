from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session
from DTOs.spare_part_DTO import SparePartResponse, UpdateSparePartRequest
from repositories.spare_part_repository import SparePartRepository
from utils.upload import delete_spare_part_upload_folder, save_spare_part_images

class SparePartService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = SparePartRepository(db)

    async def create_with_uploads(
        self,
        part_data: dict,
        files: list[UploadFile],
    ) -> SparePartResponse:
        part = self.repo.create(part_data, [])
        urls = await save_spare_part_images(files, part.id)
        if urls:
            part = self.repo.add_images(part.id, urls)
        return SparePartResponse.model_validate(part)

    async def update_part(
        self,
        part_id: int,
        data: dict,
        files: list[UploadFile] = None,
    ) -> SparePartResponse:
        part = self.repo.get_by_id(part_id)
        if not part:
            raise HTTPException(status_code=404, detail="Spare part not found")

        # Update text fields
        if data:
            part = self.repo.update(part_id, data)

        # Update images if provided
        if files:
            # 1. Physical cleanup
            delete_spare_part_upload_folder(part_id)
            # 2. Database cleanup
            self.repo.clear_images(part_id)
            # 3. Save and link new ones
            urls = await save_spare_part_images(files, part_id)
            if urls:
                part = self.repo.add_images(part_id, urls)

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
