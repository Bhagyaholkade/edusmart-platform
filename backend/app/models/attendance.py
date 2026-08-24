from sqlalchemy import Column, String, Integer, ForeignKey, Boolean, DateTime
from sqlalchemy.sql import func
from app.db.base import Base

class AttendanceRecord(Base):
    __tablename__ = "attendance_records"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime(timezone=True), default=func.now())
    status = Column(String) # PRESENT, ABSENT, LATE
    remarks = Column(String, nullable=True)
