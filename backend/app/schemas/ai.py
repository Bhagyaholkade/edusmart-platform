"""
schemas/ai.py
-------------
Pydantic request/response models for the AI Integration (DokGuru) endpoints.
"""

from pydantic import BaseModel, Field
from typing import Optional, List


# ---------------------------------------------------------------------------
# AI Tutor (student-facing)
# ---------------------------------------------------------------------------

class TutorAskRequest(BaseModel):
    question: str = Field(..., min_length=3, max_length=2000, description="The student's question.")
    subject: Optional[str] = Field(None, max_length=100, description="Subject context, e.g. 'Mathematics'.")

class TutorAskResponse(BaseModel):
    question: str
    answer: str
    subject: Optional[str] = None
    context_used: bool = Field(
        default=True,
        description="Whether the student's learning profile was injected as context."
    )


# ---------------------------------------------------------------------------
# Teacher Copilot – Lesson Plan
# ---------------------------------------------------------------------------

class LessonPlanRequest(BaseModel):
    subject: str = Field(..., max_length=100)
    topic: str = Field(..., max_length=200)
    grade_level: str = Field(..., max_length=10, description="e.g. '10', '11A'")
    duration_minutes: int = Field(default=45, ge=15, le=180)
    learning_objectives: List[str] = Field(
        default_factory=list,
        max_length=10,
        description="List of learning objectives for this lesson."
    )

class LessonPlanResponse(BaseModel):
    subject: str
    topic: str
    grade_level: str
    duration_minutes: int
    lesson_plan: str


# ---------------------------------------------------------------------------
# Teacher Copilot – Student Feedback
# ---------------------------------------------------------------------------

class FeedbackRequest(BaseModel):
    assessment_id: int
    student_id: str

class FeedbackResponse(BaseModel):
    assessment_id: int
    student_id: str
    feedback: str
    score_pct: float
