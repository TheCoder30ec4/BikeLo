from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, Numeric, String, Boolean
from sqlalchemy.orm import relationship
from DataBase.core import Base

class SparePart(Base):
    __tablename__ = "spare_parts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    brand = Column(String, nullable=True)
    compatible_models = Column(String, nullable=True) # comma separated or descriptive
    price = Column(Numeric(12, 2), nullable=False)
    condition = Column(String, nullable=True) # New, Used, etc.
    description = Column(String, nullable=True)
    is_available = Column(Boolean, default=True)
    image_count = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    images = relationship("SparePartImage", back_populates="spare_part", cascade="all, delete-orphan")

class SparePartImage(Base):
    __tablename__ = "spare_part_images"

    id = Column(Integer, primary_key=True, index=True)
    spare_part_id = Column(Integer, ForeignKey("spare_parts.id", ondelete="CASCADE"), nullable=False, index=True)
    url = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    spare_part = relationship("SparePart", back_populates="images")
