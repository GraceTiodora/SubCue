from sqlalchemy import Column, Integer, String, Float, Date
from pydantic import BaseModel
from typing import Optional
from database import Base

# SQLAlchemy Model
class SubscriptionDB(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    cost = Column(Float)
    billing_cycle = Column(String) # "monthly" or "yearly"
    start_date = Column(String) # ISO format string
    next_renewal = Column(String) # ISO format string for simplicity in MVP
    category = Column(String)
    usage_level = Column(String) # "high", "medium", "low"
    user_id = Column(String, index=True, default="default")

# Pydantic Models for Validation
class SubscriptionBase(BaseModel):
    name: str
    cost: float
    billing_cycle: str
    start_date: Optional[str] = None
    next_renewal: str
    category: str
    usage_level: str

class SubscriptionCreate(SubscriptionBase):
    pass

class Subscription(SubscriptionBase):
    id: int

    class Config:
        from_attributes = True
