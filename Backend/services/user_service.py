from sqlalchemy.orm import Session
from fastapi import HTTPException

from DTOs.user_DTO import UserCreateDTO, UserUpdateDTO, AdminUserUpdateDTO
from repositories.refresh_token_repository import RefreshTokenRepository
from repositories.user_repository import UserRepository
from tables.users import User
from utils.security import hash_password


class UserService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.refresh_repo = RefreshTokenRepository(db)

    def get_all_users(self) -> list[User]:
        return self.user_repo.get_all()

    def get_user_by_id(self, user_id: int) -> User:
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user

    def create_user(self, data: UserCreateDTO) -> User:
        if self.user_repo.get_by_email(data.email):
            raise HTTPException(status_code=400, detail="Email already registered")
        
        user_dict = data.model_dump()
        # Hash password before storing
        user_dict["password"] = hash_password(user_dict["password"])
        
        return self.user_repo.create_user(user_dict)

    def update_own_profile(self, user_id: int, data: UserUpdateDTO) -> User:
        user = self.get_user_by_id(user_id)
        update_data = data.model_dump(exclude_unset=True)
        return self.user_repo.update(user, update_data)

    def delete_own_profile(self, user_id: int) -> dict:
        user = self.get_user_by_id(user_id)
        self.user_repo.delete(user)
        return {"message": "User account permanently deleted"}

    def admin_update_user(self, user_id: int, data: AdminUserUpdateDTO) -> User:
        user = self.get_user_by_id(user_id)
        update_data = data.model_dump(exclude_unset=True)
        updated_user = self.user_repo.update(user, update_data)
        if update_data.get("status") == "inactive":
            self.refresh_repo.revoke_all_for_user(user_id)
        return updated_user

    def admin_delete_user(self, user_id: int) -> dict:
        user = self.get_user_by_id(user_id)
        self.user_repo.delete(user)
        return {"message": "User successfully deleted"}
