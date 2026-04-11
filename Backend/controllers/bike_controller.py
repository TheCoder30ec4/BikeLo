from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session

from DataBase.core import get_db
from DTOs.bike_DTO import BikeResponse, UpdateBikeRequest
from dependencies.auth import CurrentUser
from services.bike_service import BikeService

router = APIRouter(prefix="/bikes", tags=["bikes"])


@router.get("/", response_model=list[BikeResponse])
def list_bikes(
    _: CurrentUser,
    db: Session = Depends(get_db),
) -> list[BikeResponse]:
    """
    List all bikes with full details (make, model, year, price, images, etc.).
    Accessible by authenticated users and admins.
    """
    service = BikeService(db)
    return service.list_bikes()





@router.post("/", response_model=BikeResponse)
async def create_bike_with_images(
    _: CurrentUser,
    db: Session = Depends(get_db),
    make: str = Form(""),
    model_name: str = Form(...),
    description: str = Form(""),
    year: int = Form(2022, description="1900–2100"),
    km_driven: int = Form(0, ge=0),
    ownership: int = Form(1, ge=1, description="Number of previous owners"),
    price: float = Form(0.0, ge=0),
    insurance: str = Form("false"),
    is_new: str = Form("false"),
    ads: str = Form("false"),
    image_1: UploadFile | None = File(None, description="Bike image 1 (.png or .jpeg)"),
    image_2: UploadFile | None = File(None, description="Bike image 2 (.png or .jpeg)"),
    image_3: UploadFile | None = File(None, description="Bike image 3 (.png or .jpeg)"),
    image_4: UploadFile | None = File(None, description="Bike image 4 (.png or .jpeg)"),
    image_5: UploadFile | None = File(None, description="Bike image 5 (.png or .jpeg)"),
    image_6: UploadFile | None = File(None, description="Bike image 6 (.png or .jpeg)"),
) -> BikeResponse:
    """
    Create a bike with form fields and up to 6 image files (PNG or JPEG).
    Accessible by authenticated users and admins.
    """
    is_ad_bool = ads.lower() in ("true", "1", "on", "yes")

    if not description:
        raise HTTPException(422, detail="description is required")

    if not is_ad_bool:
        if not make:
            raise HTTPException(422, detail="make is required for regular bikes")
        if not (1900 <= year <= 2100):
            raise HTTPException(422, detail="year must be between 1900 and 2100")
        if ownership < 1:
            raise HTTPException(422, detail="ownership must be at least 1")
        if km_driven < 0:
            raise HTTPException(422, detail="km_driven must be >= 0")
        if price < 0:
            raise HTTPException(422, detail="price must be >= 0")

    files = [f for f in (image_1, image_2, image_3, image_4, image_5, image_6) if f and f.filename]
    
    if is_ad_bool and len(files) != 1:
        raise HTTPException(422, detail="Exactly 1 image is required for ads")
    bike_data = {
        "make": make,
        "model_name": model_name,
        "year": year,
        "km_driven": km_driven,
        "ownership": ownership,
        "price": price,
        "insurance": insurance.lower() in ("true", "1", "on", "yes"),
        "is_new": is_new.lower() in ("true", "1", "on", "yes"),
        "description": description if description else None,
        "is_ad": is_ad_bool,
    }
    service = BikeService(db)
    return await service.create_bike_with_uploads(bike_data, files)


@router.put("/{bike_id}", response_model=BikeResponse)
def update_bike(
    bike_id: int,
    data: UpdateBikeRequest,
    _: CurrentUser,
    db: Session = Depends(get_db),
) -> BikeResponse:
    """Update bike details (partial; only sent fields are updated). Accessible by users and admins."""
    service = BikeService(db)
    return service.update_bike(bike_id, data)


@router.delete("/{bike_id}", status_code=204)
def delete_bike(
    bike_id: int,
    _: CurrentUser,
    db: Session = Depends(get_db),
) -> None:
    """Delete a bike and its uploaded images. Accessible by users and admins."""
    service = BikeService(db)
    service.delete_bike(bike_id)

