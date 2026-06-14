import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile

from config import settings

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
ALLOWED_DOC_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


async def _read_and_reset(file: UploadFile) -> bytes:
    content = await file.read()
    await file.seek(0)
    return content


async def validate_image_uploads(
    files: list[UploadFile],
    *,
    max_files: int,
    exact_files: int | None = None,
) -> list[UploadFile]:
    if len(files) > max_files:
        raise HTTPException(status_code=422, detail=f"No more than {max_files} images are allowed")

    validated_files: list[UploadFile] = []
    for file in files:
        if not file.filename:
            continue
        ext = Path(file.filename).suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=422, detail=f"Unsupported image format for {file.filename}")
        content = await _read_and_reset(file)
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=422, detail=f"{file.filename} exceeds the 10 MB limit")
        validated_files.append(file)

    if exact_files is not None and len(validated_files) != exact_files:
        raise HTTPException(status_code=422, detail=f"Exactly {exact_files} valid image(s) are required")

    return validated_files


async def validate_document_upload(file: UploadFile, *, label: str) -> UploadFile:
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_DOC_EXTENSIONS:
        raise HTTPException(status_code=422, detail=f"Unsupported file format for {label}")
    content = await _read_and_reset(file)
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=422, detail=f"{label} exceeds the 10 MB limit")
    return file


async def save_bike_images(files: list[UploadFile], bike_id: int) -> list[str]:
    """
    Save uploaded image files to uploads/bikes/{bike_id}/ and return URLs for each.
    URLs are relative, e.g. /static/bikes/1/abc.jpg (app must mount StaticFiles at /static).
    """
    if not files:
        return []

    base = Path(settings.UPLOAD_DIR) / "bikes" / str(bike_id)
    base.mkdir(parents=True, exist_ok=True)
    urls = []

    for f in files:
        if not f.filename:
            continue
        ext = Path(f.filename).suffix.lower()
        content = await _read_and_reset(f)
        filename = f"{uuid.uuid4().hex}{ext}"
        path = base / filename
        path.write_bytes(content)
        urls.append(f"/static/bikes/{bike_id}/{filename}")

    return urls


async def save_spare_part_images(files: list[UploadFile], part_id: int) -> list[str]:
    """
    Save uploaded image files to uploads/spare_parts/{part_id}/ and return URLs for each.
    """
    if not files:
        return []

    base = Path(settings.UPLOAD_DIR) / "spare_parts" / str(part_id)
    base.mkdir(parents=True, exist_ok=True)
    urls = []

    for f in files:
        if not f.filename:
            continue
        ext = Path(f.filename).suffix.lower()
        content = await _read_and_reset(f)
        filename = f"{uuid.uuid4().hex}{ext}"
        path = base / filename
        path.write_bytes(content)
        urls.append(f"/static/spare_parts/{part_id}/{filename}")

    return urls


async def save_sell_bike_document(
    file: UploadFile | None,
    sell_bike_id: int,
    prefix: str,
) -> str | None:
    """Save one document (invoice or rc_card) to uploads/sell_bikes/{id}/. Returns URL or None."""
    if not file or not file.filename:
        return None
    ext = Path(file.filename).suffix.lower()
    content = await _read_and_reset(file)
    base = Path(settings.UPLOAD_DIR) / "sell_bikes" / str(sell_bike_id)
    base.mkdir(parents=True, exist_ok=True)
    filename = f"{prefix}{uuid.uuid4().hex}{ext}"
    path = base / filename
    path.write_bytes(content)
    return f"/static/sell_bikes/{sell_bike_id}/{filename}"


def delete_bike_upload_folder(bike_id: int) -> None:
    """Remove uploaded image folder for a bike. Safe if folder does not exist."""
    folder = Path(settings.UPLOAD_DIR) / "bikes" / str(bike_id)
    if folder.exists():
        for p in folder.iterdir():
            p.unlink(missing_ok=True)
        folder.rmdir()


def delete_spare_part_upload_folder(part_id: int) -> None:
    """Remove uploaded image folder for a spare part."""
    folder = Path(settings.UPLOAD_DIR) / "spare_parts" / str(part_id)
    if folder.exists():
        for p in folder.iterdir():
            p.unlink(missing_ok=True)
        folder.rmdir()


def delete_sell_bike_upload_folder(sell_bike_id: int) -> None:
    folder = Path(settings.UPLOAD_DIR) / "sell_bikes" / str(sell_bike_id)
    if folder.exists():
        for p in folder.iterdir():
            p.unlink(missing_ok=True)
        folder.rmdir()


def delete_files_for_urls(urls: list[str]) -> None:
    for url in urls:
        if not url.startswith("/static/"):
            continue
        relative_path = url.removeprefix("/static/")
        path = Path(settings.UPLOAD_DIR) / relative_path
        if path.exists():
            path.unlink(missing_ok=True)
