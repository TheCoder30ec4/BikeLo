from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from DTOs.bike_DTO import BikeResponse, UpdateBikeRequest
from repositories.bike_repository import BikeRepository
from utils.upload import delete_bike_upload_folder, save_bike_images, validate_image_uploads


class BikeService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = BikeRepository(db)

    async def create_bike_with_uploads(
        self,
        bike_data: dict,
        files: list[UploadFile],
    ) -> BikeResponse:
        validated_files = await validate_image_uploads(
            files,
            max_files=6,
            exact_files=1 if bike_data.get("is_ad") else None,
        )
        bike = None
        try:
            bike = self.repo.create_bike(bike_data, [], commit=False)
            urls = await save_bike_images(validated_files, bike.id)
            if urls:
                bike = self.repo.add_images(bike.id, urls, commit=False)
            self.db.commit()
            self.db.refresh(bike)
            return BikeResponse.model_validate(bike)
        except HTTPException:
            self.db.rollback()
            if bike is not None:
                delete_bike_upload_folder(bike.id)
            raise
        except Exception:
            self.db.rollback()
            if bike is not None:
                delete_bike_upload_folder(bike.id)
            raise

    def update_bike(self, bike_id: int, data: UpdateBikeRequest) -> BikeResponse:
        bike = self.repo.get_by_id(bike_id)
        if not bike:
            raise HTTPException(status_code=404, detail="Bike not found")
        update_dict = data.model_dump(exclude_unset=True)
        if not update_dict:
            return BikeResponse.model_validate(bike)
        bike = self.repo.update_bike(bike_id, update_dict)
        return BikeResponse.model_validate(bike)

    def delete_bike(self, bike_id: int) -> None:
        bike = self.repo.get_by_id(bike_id)
        if not bike:
            raise HTTPException(status_code=404, detail="Bike not found")
        delete_bike_upload_folder(bike_id)
        self.repo.delete_bike(bike_id)

    def list_bikes(self) -> list[BikeResponse]:
        bikes = self.repo.list_bikes()
        return [BikeResponse.model_validate(b) for b in bikes]
