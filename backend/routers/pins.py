from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from backend.database import get_db
from backend import models, schemas
from backend.routers.auth import get_current_user

router = APIRouter(
    prefix="/pins",
    tags=["Pins"]
)

@router.get("/", response_model=List[schemas.PinResponse])
def get_all_pins(search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Pin)
    if search:
        query = query.filter(
            or_(
                models.Pin.title.ilike(f"%{search}%"),
                models.Pin.description.ilike(f"%{search}%")
            )
        )
    # Order by newest pins first
    return query.order_by(models.Pin.created_at.desc()).all()

@router.post("/", response_model=schemas.PinResponse, status_code=status.HTTP_201_CREATED)
def create_pin(pin_in: schemas.PinCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_pin = models.Pin(
        title=pin_in.title,
        description=pin_in.description,
        image_url=pin_in.image_url,
        spotify_uri=pin_in.spotify_uri,
        user_id=current_user.id
    )
    db.add(db_pin)
    db.commit()
    db.refresh(db_pin)
    return db_pin

@router.get("/{pin_id}", response_model=schemas.PinResponse)
def get_pin(pin_id: int, db: Session = Depends(get_db)):
    db_pin = db.query(models.Pin).filter(models.Pin.id == pin_id).first()
    if not db_pin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pin not found"
        )
    return db_pin

@router.delete("/{pin_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pin(pin_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_pin = db.query(models.Pin).filter(models.Pin.id == pin_id).first()
    if not db_pin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pin not found"
        )
    if db_pin.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this pin"
        )
    db.delete(db_pin)
    db.commit()
    return None

@router.get("/user/{user_id}", response_model=List[schemas.PinResponse])
def get_user_pins(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.Pin).filter(models.Pin.user_id == user_id).order_by(models.Pin.created_at.desc()).all()
