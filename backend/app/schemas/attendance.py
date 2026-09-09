from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import date, datetime


class AttendanceStatus:
    PRESENT = "PRESENT"
    ABSENT = "ABSENT"
    LATE = "LATE"


class AttendanceCreate(BaseModel):
    student_id: str
    status: str  # PRESENT, ABSENT, LATE
    remarks: Optional[str] = None


class AttendanceBulkCreate(BaseModel):
    class_id: int
    date: date
    records: List[AttendanceCreate]


class AttendanceResponse(BaseModel):
    id: int
    student_id: str
    class_id: int
    recorded_by: Optional[str] = None
    date: date
    status: str
    remarks: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AttendanceUpdate(BaseModel):
    status: str
    remarks: Optional[str] = None
