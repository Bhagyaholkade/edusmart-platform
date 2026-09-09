from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import date, datetime


class AssessmentCreate(BaseModel):
    title: str
    assessment_type: str  # QUIZ, EXAM, ASSIGNMENT, TEST
    class_id: int
    subject_id: Optional[int] = None
    max_score: float = 100.0
    scheduled_date: Optional[date] = None


class AssessmentUpdate(BaseModel):
    title: Optional[str] = None
    assessment_type: Optional[str] = None
    max_score: Optional[float] = None
    scheduled_date: Optional[date] = None


class AssessmentResponse(BaseModel):
    id: int
    title: str
    assessment_type: str
    class_id: int
    subject_id: Optional[int] = None
    created_by: Optional[str] = None
    max_score: float
    scheduled_date: Optional[date] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Marks / Results ---

class MarkEntry(BaseModel):
    student_id: str
    score: float


class MarksSubmit(BaseModel):
    """Bulk marks submission by a teacher."""
    marks: List[MarkEntry]


class AssessmentResultResponse(BaseModel):
    id: int
    assessment_id: int
    student_id: str
    score: float
    ai_feedback: Optional[str] = None
    submitted_by: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ClassAggregation(BaseModel):
    assessment_id: int
    class_id: int
    total_students: int
    average_score: float
    highest_score: float
    lowest_score: float
    pass_rate: float  # % of students >= 40% of max_score
