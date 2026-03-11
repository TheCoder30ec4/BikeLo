from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, Numeric, String

from DataBase.core import Base


class SellBike(Base):
    """User submission to sell a bike (new or used vehicle)."""
    __tablename__ = "sell_bikes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    vehicle_type = Column(String(20), nullable=False)  # "new" | "existing"
    registration_no = Column(String(50), nullable=True)  # for existing/used
    brand = Column(String(100), nullable=False)
    model = Column(String(100), nullable=False)
    year = Column(Integer, nullable=False)

    ex_showroom = Column(Numeric(12, 2), nullable=True)  # for new vehicles only
    invoice_url = Column(String(500), nullable=True)  # uploaded invoice (new)
    rc_card_url = Column(String(500), nullable=True)  # uploaded RC (used)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
