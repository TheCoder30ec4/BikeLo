from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String

from DataBase.core import Base


class SellListing(Base):
    """Simple bike sell listing: model, year, owners, insurance, finance, original RC."""
    __tablename__ = "sell_listings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    model = Column(String(200), nullable=False)
    year = Column(Integer, nullable=False)
    no_of_owners = Column(Integer, nullable=False)
    insurance_available = Column(Boolean, nullable=False)
    finance_hypothecation = Column(Boolean, nullable=False)
    original_rc_available = Column(Boolean, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)
