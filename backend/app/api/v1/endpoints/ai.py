"""
endpoints/ai.py
---------------
AI Integration (DokGuru) API endpoints – Feature 7.

Routes:
  POST /ai/tutor/{student_id}/ask          – Student AI Tutor
  POST /ai/copilot/lesson-plan             – Teacher Copilot: Lesson Plan
  POST /ai/copilot/feedback               – Teacher Copilot: Student Feedback
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.ai import (
    TutorAskRequest,
    TutorAskResponse,
    LessonPlanRequest,
    LessonPlanResponse,
    FeedbackRequest,
    FeedbackResponse,
)
from app.services import ai_service
from app.api.deps import get_current_user
from app.models.user import User
from app.core.rbac import Role

router = APIRouter()

_STAFF_ROLES = {Role.TEACHER, Role.SCHOOL_ADMIN, Role.SUPER_ADMIN}


# ---------------------------------------------------------------------------
# AI Tutor – student-facing
# ---------------------------------------------------------------------------

@router.post(
    "/tutor/{student_id}/ask",
    response_model=TutorAskResponse,
    summary="Ask the AI tutor a question (enriched with student's learning profile)",
)
async def student_ask(
    student_id: str,
    request: TutorAskRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Submit a question to the AI tutor. The student's learning profile is
    automatically injected as anonymised context before being forwarded to
    the DokGuru engine.

    Access:
    - Students can only ask questions for themselves.
    - Teachers and Admins can query on behalf of any student.
    """
    # Access control
    if current_user.role == Role.STUDENT and current_user.id != student_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")
    if current_user.role == Role.PARENT:
        await db.refresh(current_user, attribute_names=["children"])
        if student_id not in [c.id for c in current_user.children]:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

    return await ai_service.student_ask(db, student_id, request)


# ---------------------------------------------------------------------------
# Teacher Copilot – Lesson Plan
# ---------------------------------------------------------------------------

@router.post(
    "/copilot/lesson-plan",
    response_model=LessonPlanResponse,
    summary="Generate a lesson plan (Teachers / Admins only)",
)
async def generate_lesson_plan(
    request: LessonPlanRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Ask the Teacher Copilot to draft a structured lesson plan for a given
    subject, topic, and grade level.
    """
    if current_user.role not in _STAFF_ROLES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")
    return await ai_service.generate_lesson_plan(db, request)


# ---------------------------------------------------------------------------
# Teacher Copilot – Student Feedback
# ---------------------------------------------------------------------------

@router.post(
    "/copilot/feedback",
    response_model=FeedbackResponse,
    summary="Generate AI feedback for a student's assessment result (Teachers / Admins only)",
)
async def generate_feedback(
    request: FeedbackRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Generate personalised, PII-safe feedback for a student's assessment result.
    The feedback is also persisted on the AssessmentResult record.
    """
    if current_user.role not in _STAFF_ROLES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")
    return await ai_service.generate_feedback_for_student(db, request)
