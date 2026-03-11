from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from DTOs.bike_DTO import BikeResponse, CreateBikeRequest, UpdateBikeRequest
from repositories.bike_repository import BikeRepository
from utils.upload import delete_bike_upload_folder, save_bike_images


class BikeService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = BikeRepository(db)

    def create_bike(self, data: CreateBikeRequest) -> BikeResponse:
        bike_data = {
            "make": data.make,
            "model_name": data.model_name,
            "year": data.year,
            "km_driven": data.km_driven,
            "ownership": data.ownership,
            "price": data.price,
            "insurance": data.insurance,
        }
        bike = self.repo.create_bike(bike_data, data.image_urls)
        return BikeResponse.model_validate(bike)

    async def create_bike_with_uploads(
        self,
        bike_data: dict,
        files: list[UploadFile],
    ) -> BikeResponse:
        bike = self.repo.create_bike(bike_data, [])
        urls = await save_bike_images(files, bike.id)
        if urls:
            bike = self.repo.add_images(bike.id, urls)
        return BikeResponse.model_validate(bike)

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

