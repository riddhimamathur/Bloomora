from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database import get_db
from backend import models, schemas
from backend.routers.auth import get_current_user

router = APIRouter(
    prefix="/comments",
    tags=["Comments"]
)

@router.get("/pin/{pin_id}", response_model=List[schemas.CommentResponse])
def get_comments_for_pin(pin_id: int, db: Session = Depends(get_db)):
    # Check if pin exists
    pin = db.query(models.Pin).filter(models.Pin.id == pin_id).first()
    if not pin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pin not found"
        )
    return db.query(models.Comment).filter(models.Comment.pin_id == pin_id).order_by(models.Comment.created_at.asc()).all()

@router.post("/pin/{pin_id}", response_model=schemas.CommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment(pin_id: int, comment_in: schemas.CommentCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Check if pin exists
    pin = db.query(models.Pin).filter(models.Pin.id == pin_id).first()
    if not pin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pin not found"
        )
    db_comment = models.Comment(
        content=comment_in.content,
        pin_id=pin_id,
        user_id=current_user.id
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(comment_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_comment = db.query(models.Comment).filter(models.Comment.id == comment_id).first()
    if not db_comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    # Check if the user is the owner of the comment OR the owner of the pin
    pin = db.query(models.Pin).filter(models.Pin.id == db_comment.pin_id).first()
    if db_comment.user_id != current_user.id and (pin and pin.user_id != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this comment"
        )
        
    db.delete(db_comment)
    db.commit()
    return None
