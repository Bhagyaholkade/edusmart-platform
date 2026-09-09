from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    role: str = "authenticated"
    school_id: Optional[int] = None
    class_id: Optional[int] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(UserBase):
    password: Optional[str] = None


class UserInDBBase(UserBase):
    id: str
    is_active: bool = True
    is_approved: bool = False
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class User(UserInDBBase):
    pass

class UserResponse(UserInDBBase):
    pass

class UserApprove(BaseModel):
    role: str
    school_id: Optional[int] = None
    is_approved: bool = True

class TeacherAssignmentBase(BaseModel):
    class_id: int
    subject_id: int

class TeacherAssignmentResponse(TeacherAssignmentBase):
    id: int
    teacher_id: str
    
    model_config = {"from_attributes": True}

class ParentStudentLink(BaseModel):
    parent_id: str
    student_id: str
