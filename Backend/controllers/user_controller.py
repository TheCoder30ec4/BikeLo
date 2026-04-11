from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from DataBase.core import get_db
from DTOs.user_DTO import UserResponseDTO, UserUpdateDTO, UserCreateDTO, AdminUserUpdateDTO
from dependencies.auth import CurrentUser, RequireAdmin
from services.user_service import UserService

router = APIRouter(prefix="/users", tags=["users"])

# --- User Self-Management ---

@router.get("/me", response_model=UserResponseDTO)
def get_me(current_user: CurrentUser):
    """Get current user details."""
    return current_user

@router.patch("/me", response_model=UserResponseDTO)
def update_me(
    data: UserUpdateDTO,
    current_user: CurrentUser,
    db: Session = Depends(get_db)
):
    """Update current user details."""
    service = UserService(db)
    return service.update_own_profile(current_user.id, data)

@router.delete("/me")
def delete_me(
    current_user: CurrentUser,
    db: Session = Depends(get_db)
):
    """Delete current user account permanently."""
    service = UserService(db)
    return service.delete_own_profile(current_user.id)


# --- Admin User Management ---

@router.get("", response_model=list[UserResponseDTO])
def get_all_users(
    _: RequireAdmin,
    db: Session = Depends(get_db)
):
    """Admin: List all users."""
    service = UserService(db)
    return service.get_all_users()

@router.post("", response_model=UserResponseDTO)
def create_user_admin(
    data: UserCreateDTO,
    _: RequireAdmin,
    db: Session = Depends(get_db)
):
    """Admin: Create a new user."""
    service = UserService(db)
    return service.create_user(data)

@router.patch("/{user_id}", response_model=UserResponseDTO)
def update_user_admin(
    user_id: int,
    data: AdminUserUpdateDTO,
    _: RequireAdmin,
    db: Session = Depends(get_db)
):
    """Admin: Update any user detail, including role."""
    service = UserService(db)
    return service.admin_update_user(user_id, data)

@router.delete("/{user_id}")
def delete_user_admin(
    user_id: int,
    _: RequireAdmin,
    db: Session = Depends(get_db)
):
    """Admin: Delete any user account permanently."""
    service = UserService(db)
    return service.admin_delete_user(user_id)
