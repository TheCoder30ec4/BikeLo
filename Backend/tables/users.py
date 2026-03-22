from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime
from DataBase.core import Base

class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(String, nullable=False, unique=True, index=True)

    password = Column(String, nullable=False)

    phone = Column(String, nullable=False)

    role = Column(String, nullable=False, default="user")

    status = Column(String, nullable=False, default="active")

    is_verified = Column(Boolean, nullable=False, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)