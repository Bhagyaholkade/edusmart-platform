from sqlalchemy import Column, String, Integer, ForeignKey, Boolean, DateTime, JSON, Float
from sqlalchemy.sql import func
from app.db.base import Base

class StudentLearningProfile(Base):
    __tablename__ = "learning_profiles"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("users.id"), unique=True)
    overall_health_score = Column(Float, default=100.0)
    strengths = Column(JSON) # e.g., ["Algebra", "Physics"]
    weaknesses = Column(JSON) # e.g., ["Geometry", "History"]
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class RiskSignal(Base):
    __tablename__ = "risk_signals"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("users.id"))
    signal_type = Column(String) # ATTENDANCE_DROP, GRADE_DROP, DISENGAGEMENT
    severity = Column(String) # LOW, MEDIUM, HIGH
    description = Column(String)
    is_resolved = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
