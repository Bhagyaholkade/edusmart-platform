from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class AttendanceRecord(Base):
    __tablename__ = "attendance_records"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    class_id = Column(Integer, ForeignKey("classes.id", ondelete="CASCADE"), nullable=False)
    recorded_by = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)  # Teacher's ID
    date = Column(Date, nullable=False, index=True)   # YYYY-MM-DD, for daily grouping
    status = Column(String, nullable=False)            # PRESENT, ABSENT, LATE
    remarks = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    student = relationship("User", foreign_keys=[student_id])
    teacher = relationship("User", foreign_keys=[recorded_by])
    classroom = relationship("ClassRoom")
