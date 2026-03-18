from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from DataBase.core import get_db
from DTOs.user_DTO import UserResponseDTO
from dependencies.auth import RequireAdmin
from services.get_user_data import GetUserDataService

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users", response_model=list[UserResponseDTO])
def get_all_users(
    _: RequireAdmin,
    db: Session = Depends(get_db),
) -> list[UserResponseDTO]:
    """
    List all users with full details.
    Accessible by admin only.
    """
    service = GetUserDataService(db)
    return service.get_all_users()