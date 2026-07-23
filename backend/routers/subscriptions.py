from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models

router = APIRouter()

@router.post("/subscriptions/", response_model=models.Subscription)
def create_subscription(
    sub: models.SubscriptionCreate, 
    db: Session = Depends(get_db),
    x_user_id: str = Header("default")
):
    db_sub = models.SubscriptionDB(**sub.dict(), user_id=x_user_id)
    db.add(db_sub)
    db.commit()
    db.refresh(db_sub)
    return db_sub

@router.get("/subscriptions/", response_model=List[models.Subscription])
def read_subscriptions(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    x_user_id: str = Header("default")
):
    subs = db.query(models.SubscriptionDB).filter(models.SubscriptionDB.user_id == x_user_id).offset(skip).limit(limit).all()
    return subs

@router.delete("/subscriptions/{sub_id}")
def delete_subscription(
    sub_id: int, 
    db: Session = Depends(get_db),
    x_user_id: str = Header("default")
):
    db_sub = db.query(models.SubscriptionDB).filter(
        models.SubscriptionDB.id == sub_id,
        models.SubscriptionDB.user_id == x_user_id
    ).first()
    if not db_sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    db.delete(db_sub)
    db.commit()
    return {"message": "Subscription deleted successfully"}

@router.put("/subscriptions/{sub_id}", response_model=models.Subscription)
def update_subscription(
    sub_id: int, 
    sub_update: models.SubscriptionCreate, 
    db: Session = Depends(get_db),
    x_user_id: str = Header("default")
):
    db_sub = db.query(models.SubscriptionDB).filter(
        models.SubscriptionDB.id == sub_id,
        models.SubscriptionDB.user_id == x_user_id
    ).first()
    
    if not db_sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
        
    for key, value in sub_update.dict().items():
        setattr(db_sub, key, value)
        
    db.commit()
    db.refresh(db_sub)
    return db_sub

@router.delete("/api/reset")
def reset_database(
    db: Session = Depends(get_db),
    x_user_id: str = Header("default")
):
    db.query(models.SubscriptionDB).filter(models.SubscriptionDB.user_id == x_user_id).delete()
    db.commit()
    return {"message": "Database resetted successfully"}
