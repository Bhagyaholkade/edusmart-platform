"""
schemas/analytics.py
---------------------
Pydantic response models for the Analytics & Dashboard endpoints (Feature 8).
"""

from pydantic import BaseModel
from typing import List, Optional


# ---------------------------------------------------------------------------
# Common building blocks
# ---------------------------------------------------------------------------

class SubjectPerformance(BaseModel):
    subject_id: int
    subject_name: str
    average_score_pct: float
    pass_rate_pct: float
    total_assessments: int


class AttendanceSummary(BaseModel):
    total_records: int
    present_count: int
    attendance_rate_pct: float


class RiskSummary(BaseModel):
    total_active_signals: int
    high_severity: int
    medium_severity: int
    low_severity: int


# ---------------------------------------------------------------------------
# School Admin Analytics
# ---------------------------------------------------------------------------

class ClassSummary(BaseModel):
    class_id: int
    grade_level: str
    section: str
    total_students: int
    average_health_score: Optional[float] = None
    attendance_rate_pct: Optional[float] = None
    average_score_pct: Optional[float] = None


class SchoolAnalytics(BaseModel):
    school_id: int
    school_name: str
    total_students: int
    total_teachers: int
    total_classes: int
    overall_attendance_rate_pct: Optional[float] = None
    overall_average_score_pct: Optional[float] = None
    active_risk_signals: int
    classes: List[ClassSummary]
    top_subjects: List[SubjectPerformance]


# ---------------------------------------------------------------------------
# Teacher Analytics (class-wide insight)
# ---------------------------------------------------------------------------

class StudentSummary(BaseModel):
    student_id: str
    full_name: str
    health_score: Optional[float] = None
    attendance_rate_pct: Optional[float] = None
    average_score_pct: Optional[float] = None
    active_risk_count: int = 0


class TeacherAnalytics(BaseModel):
    teacher_id: str
    class_id: int
    grade_level: str
    section: str
    total_students: int
    class_attendance_rate_pct: Optional[float] = None
    class_average_score_pct: Optional[float] = None
    pass_rate_pct: Optional[float] = None
    at_risk_student_count: int
    subject_performance: List[SubjectPerformance]
    student_summaries: List[StudentSummary]


# ---------------------------------------------------------------------------
# Student / Parent Analytics (personal progress)
# ---------------------------------------------------------------------------

class AssessmentResultSummary(BaseModel):
    assessment_id: int
    assessment_title: str
    assessment_type: str
    subject_name: Optional[str] = None
    score: float
    max_score: float
    score_pct: float
    scheduled_date: Optional[str] = None  # ISO date string


class StudentAnalytics(BaseModel):
    student_id: str
    full_name: str
    grade_level: Optional[str] = None
    section: Optional[str] = None
    overall_health_score: Optional[float] = None
    attendance: Optional[AttendanceSummary] = None
    average_score_pct: Optional[float] = None
    risk_summary: Optional[RiskSummary] = None
    subject_performance: List[SubjectPerformance]
    recent_results: List[AssessmentResultSummary]
