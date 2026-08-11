from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List
from datetime import datetime

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# User schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# Comment schemas
class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    pass

class CommentResponse(CommentBase):
    id: int
    pin_id: int
    user_id: int
    created_at: datetime
    owner: UserResponse

    model_config = ConfigDict(from_attributes=True)

# Pin schemas
class PinBase(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: str
    spotify_uri: Optional[str] = None

class PinCreate(PinBase):
    pass

class PinResponse(PinBase):
    id: int
    user_id: int
    created_at: datetime
    owner: UserResponse
    comments: List[CommentResponse] = []

    model_config = ConfigDict(from_attributes=True)
