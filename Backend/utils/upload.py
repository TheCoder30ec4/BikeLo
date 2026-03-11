import os
import re
import uuid
from pathlib import Path

from fastapi import UploadFile

from config import settings

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
ALLOWED_DOC_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


def _safe_filename(original: str) -> str:
    """Return a safe filename, preserving extension."""
    ext = Path(original).suffix.lower() or ".jpg"
    if ext not in ALLOWED_EXTENSIONS:
        ext = ".jpg"
    name = re.sub(r"[^\w\-.]", "_", original)
    return (name[:50] if len(name) > 50 else name) or "image" + ext


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
        if ext not in ALLOWED_EXTENSIONS:
            continue
        content = await f.read()
        if len(content) > MAX_FILE_SIZE:
            continue
        filename = f"{uuid.uuid4().hex}{ext}"
        path = base / filename
        path.write_bytes(content)
        urls.append(f"/static/bikes/{bike_id}/{filename}")

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
    if ext not in ALLOWED_DOC_EXTENSIONS:
        return None
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        return None
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
