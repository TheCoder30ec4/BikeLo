from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import relationship

from DataBase.core import Base


class Bike(Base):
    __tablename__ = "bikes"

    id = Column(Integer, primary_key=True, index=True)
    make = Column(String, nullable=False)
    model_name = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    km_driven = Column(Integer, nullable=False)
    ownership = Column(Integer, nullable=False)
    price = Column(Numeric(12, 2), nullable=False)
    insurance = Column(Boolean, nullable=False, default=False)
    image_count = Column(Integer, nullable=False, default=0)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    images = relationship("BikeImage", back_populates="bike", cascade="all, delete-orphan")


class BikeImage(Base):
    __tablename__ = "bike_images"

    id = Column(Integer, primary_key=True, index=True)
    bike_id = Column(Integer, ForeignKey("bikes.id", ondelete="CASCADE"), nullable=False, index=True)
    url = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    bike = relationship("Bike", back_populates="images")

