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
    next_renewal = Column(String) # ISO format string for simplicity in MVP
    category = Column(String)
    usage_level = Column(String) # "high", "medium", "low"

# Pydantic Models for Validation
class SubscriptionBase(BaseModel):
    name: str
    cost: float
    billing_cycle: str
    next_renewal: str
    category: str
    usage_level: str

class SubscriptionCreate(SubscriptionBase):
    pass

class Subscription(SubscriptionBase):
    id: int

    class Config:
        orm_mode = True
