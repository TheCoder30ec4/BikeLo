from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session
from DataBase.core import get_db
from DTOs.spare_part_DTO import SparePartResponse, UpdateSparePartRequest
from dependencies.auth import CurrentUser, RequireAdmin
from services.spare_part_service import SparePartService

router = APIRouter(prefix="/spare-parts", tags=["spare-parts"])

@router.get("/", response_model=list[SparePartResponse])
def list_spare_parts(
    _: CurrentUser,
    db: Session = Depends(get_db),
) -> list[SparePartResponse]:
    """List all spare parts. Accessible by any logged-in user."""
    service = SparePartService(db)
    return service.list_parts()

@router.post("/", response_model=SparePartResponse)
async def create_spare_part(
    _: RequireAdmin,
    db: Session = Depends(get_db),
    name: str = Form(...),
    brand: str = Form(None),
    compatible_models: str = Form(None),
    price: float = Form(..., ge=0),
    condition: str = Form(None),
    description: str = Form(None),
    is_available: str = Form("true"),
    image_1: UploadFile | None = File(None, description="Image 1"),
    image_2: UploadFile | None = File(None, description="Image 2"),
    image_3: UploadFile | None = File(None, description="Image 3"),
    image_4: UploadFile | None = File(None, description="Image 4"),
    image_5: UploadFile | None = File(None, description="Image 5"),
) -> SparePartResponse:
    """Create a spare part with up to 5 images. Restricted to Admins."""
    files = [f for f in (image_1, image_2, image_3, image_4, image_5) if f and f.filename]
    
    data = {
        "name": name,
        "brand": brand,
        "compatible_models": compatible_models,
        "price": price,
        "condition": condition,
        "description": description,
        "is_available": is_available.lower() in ("true", "1", "on", "yes"),
    }
    
    service = SparePartService(db)
    return await service.create_with_uploads(data, files)

@router.put("/{part_id}", response_model=SparePartResponse)
async def update_spare_part(
    part_id: int,
    _: RequireAdmin,
    db: Session = Depends(get_db),
    name: str = Form(None),
    brand: str = Form(None),
    compatible_models: str = Form(None),
    price: float = Form(None, ge=0),
    condition: str = Form(None),
    description: str = Form(None),
    is_available: str = Form(None),
    image_1: UploadFile | None = File(None),
    image_2: UploadFile | None = File(None),
    image_3: UploadFile | None = File(None),
    image_4: UploadFile | None = File(None),
    image_5: UploadFile | None = File(None),
) -> SparePartResponse:
    """Update spare part details and images. Restricted to Admins."""
    files = [f for f in (image_1, image_2, image_3, image_4, image_5) if f and f.filename]
    
    data = {}
    if name is not None: data["name"] = name
    if brand is not None: data["brand"] = brand
    if compatible_models is not None: data["compatible_models"] = compatible_models
    if price is not None: data["price"] = price
    if condition is not None: data["condition"] = condition
    if description is not None: data["description"] = description
    if is_available is not None:
        data["is_available"] = is_available.lower() in ("true", "1", "on", "yes")
    
    service = SparePartService(db)
    return await service.update_part(part_id, data, files)

@router.delete("/{part_id}", status_code=204)
def delete_spare_part(
    part_id: int,
    _: RequireAdmin,
    db: Session = Depends(get_db),
) -> None:
    """Delete a spare part and its images. Restricted to Admins."""
    service = SparePartService(db)
    service.delete_part(part_id)
