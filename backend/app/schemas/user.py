from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    username: str
    full_name: str
    role: str
    school_id: Optional[int] = None
    class_id: Optional[int] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserInDBBase(UserBase):
    id: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}

class User(UserInDBBase):
    pass
