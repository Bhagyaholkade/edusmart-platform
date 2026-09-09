from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime


class RiskSignalResponse(BaseModel):
    id: int
    student_id: str
    signal_type: str       # ATTENDANCE_DROP, GRADE_DROP, DISENGAGEMENT
    severity: str          # LOW, MEDIUM, HIGH
    description: str
    is_resolved: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class RiskSignalResolve(BaseModel):
    is_resolved: bool = True


class StudentLearningProfileResponse(BaseModel):
    id: int
    student_id: str
    overall_health_score: float
    strengths: Optional[List[str]] = []
    weaknesses: Optional[List[str]] = []
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class StudentDashboard(BaseModel):
    """Aggregated student learning profile: profile + active risk signals."""
    profile: StudentLearningProfileResponse
    active_risk_signals: List[RiskSignalResponse]
    attendance_rate: Optional[float] = None   # % of PRESENT records in last 30 days
    average_score: Optional[float] = None     # across all assessments
