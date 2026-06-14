from sqlalchemy.orm import Session

from tables.users import User


class UserRepository:
    MUTABLE_FIELDS = {"name", "phone", "role", "status", "password", "is_verified"}

    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: int) -> User | None:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, email: str) -> User | None:
        return self.db.query(User).filter(User.email == email).first()

    def create_user(self, user_data: dict, *, commit: bool = True) -> User:
        user = User(**user_data)
        self.db.add(user)
        self.db.flush()
        if commit:
            self.db.commit()
            self.db.refresh(user)
        return user

    def get_all(self) -> list[User]:
        return self.db.query(User).order_by(User.id).all()

    def update_role(self, user_id: int, role: str) -> User | None:
        user = self.get_by_id(user_id)
        if not user:
            return None
        user.role = role
        self.db.commit()
        self.db.refresh(user)
        return user

    def update(self, user: User, update_data: dict) -> User:
        invalid_fields = set(update_data) - self.MUTABLE_FIELDS
        if invalid_fields:
            raise ValueError(f"Attempted to update unsupported user fields: {sorted(invalid_fields)}")
        for key, value in update_data.items():
            setattr(user, key, value)
        self.db.commit()
        self.db.refresh(user)
        return user

    def delete(self, user: User) -> None:
        self.db.delete(user)
        self.db.commit()
