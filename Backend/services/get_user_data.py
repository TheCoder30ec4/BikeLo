from sqlalchemy.orm import Session
from tables.users import User

class GetUserDataService:
    def __init__(self, db: Session):
        self.db = db

    def get_all_users(self):
        return self.db.query(User).all()  # fetch all columns