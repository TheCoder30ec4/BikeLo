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


@router.get("/upload-form", response_class=HTMLResponse)
def bike_upload_form(_: CurrentUser) -> str:
    """
    Simple HTML form to add a bike with image file uploads.
    Accessible by authenticated users and admins. Paste your Bearer token in the form.
    """
    return """
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Add bike (admin)</title></head>
<body>
  <h2>Add bike</h2>
  <p>Paste your <strong>Bearer token</strong> (user or admin) below, then fill the form and choose image files.</p>
  <form id="form" action="/bikes/" method="post" enctype="multipart/form-data">
    <label>Bearer token: <input type="password" name="_token" id="token" placeholder="eyJ..."></label>
    <br><br>
    <label>Make: <input type="text" name="make" required></label><br>
    <label>Model: <input type="text" name="model_name" required></label><br>
    <label>Year: <input type="number" name="year" min="1900" max="2100" value="2022"></label><br>
    <label>KM driven: <input type="number" name="km_driven" min="0" value="0"></label><br>
    <label>Ownership: <input type="number" name="ownership" min="1" value="1"></label><br>
    <label>Price: <input type="number" name="price" min="0" step="0.01" value="0"></label><br>
    <label>Insurance: <input type="checkbox" name="insurance" value="true"></label><br>
    <br>
    <label>Image 1 (.png or .jpeg): <input type="file" name="image_1" accept=".png,.jpg,.jpeg"></label><br>
    <label>Image 2 (.png or .jpeg): <input type="file" name="image_2" accept=".png,.jpg,.jpeg"></label>
    <br><br>
    <button type="submit">Submit</button>
  </form>
  <script>
    document.getElementById("form").onsubmit = function() {
      var token = document.getElementById("token").value;
      if (!token) { alert("Enter Bearer token"); return false; }
      var xhr = new XMLHttpRequest();
      var fd = new FormData(this);
      fd.delete("_token");
      xhr.open("POST", "/bikes/");
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.send(fd);
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300)
          alert("Bike created: " + xhr.responseText);
        else
          alert("Error " + xhr.status + ": " + xhr.responseText);
      };
      return false;
    };
  </script>
</body>
</html>
"""


@router.post("/", response_model=BikeResponse)
async def create_bike_with_images(
    _: CurrentUser,
    db: Session = Depends(get_db),
    make: str = Form(...),
    model_name: str = Form(...),
    year: int = Form(2022, description="1900–2100"),
    km_driven: int = Form(0, ge=0),
    ownership: int = Form(1, ge=1, description="Number of previous owners"),
    price: float = Form(0.0, ge=0),
    insurance: str = Form("false"),
    image_1: UploadFile | None = File(None, description="Bike image 1 (.png or .jpeg)"),
    image_2: UploadFile | None = File(None, description="Bike image 2 (.png or .jpeg)"),
) -> BikeResponse:
    """
    Create a bike with form fields and up to 2 image files (PNG or JPEG).
    Accessible by authenticated users and admins.
    """
    if not (1900 <= year <= 2100):
        raise HTTPException(422, detail="year must be between 1900 and 2100")
    if ownership < 1:
        raise HTTPException(422, detail="ownership must be at least 1")
    if km_driven < 0:
        raise HTTPException(422, detail="km_driven must be >= 0")
    if price < 0:
        raise HTTPException(422, detail="price must be >= 0")

    files = [f for f in (image_1, image_2) if f and f.filename]
    bike_data = {
        "make": make,
        "model_name": model_name,
        "year": year,
        "km_driven": km_driven,
        "ownership": ownership,
        "price": price,
        "insurance": insurance.lower() in ("true", "1", "on", "yes"),
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

