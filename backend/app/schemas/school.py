from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

# Subject Schemas
class SubjectBase(BaseModel):
    name: str
    code: str

class SubjectCreate(SubjectBase):
    pass

class SubjectUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None

class SubjectResponse(SubjectBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)

# ClassRoom Schemas
class ClassRoomBase(BaseModel):
    grade_level: str
    section: str

class ClassRoomCreate(ClassRoomBase):
    pass

class ClassRoomUpdate(BaseModel):
    grade_level: Optional[str] = None
    section: Optional[str] = None

class ClassRoomResponse(ClassRoomBase):
    id: int
    school_id: int
    subjects: List[SubjectResponse] = []
    
    model_config = ConfigDict(from_attributes=True)

# School Schemas
class SchoolBase(BaseModel):
    name: str
    address: Optional[str] = None

class SchoolCreate(SchoolBase):
    pass

class SchoolUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None

class SchoolResponse(SchoolBase):
    id: int
    created_at: datetime
    classes: List[ClassRoomResponse] = []
    
    model_config = ConfigDict(from_attributes=True)
