"""
services/ai_service.py
-----------------------
Business logic for the AI Integration (DokGuru) feature.

Design:
- Student tutor calls: load the student's learning profile, build a safe
  anonymised context, forward to DokGuru, return the answer.
- Teacher copilot calls: generate lesson plans or personalised student
  feedback using teacher-supplied parameters.
- All data sent to DokGuru is PII-sanitised via SafeContextBuilder.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException

from app.models.user import User
from app.models.assessment import Assessment, AssessmentResult
from app.models.intelligence import StudentLearningProfile
from app.schemas.ai import (
    TutorAskRequest,
    TutorAskResponse,
    LessonPlanRequest,
    LessonPlanResponse,
    FeedbackRequest,
    FeedbackResponse,
)
from app.integrations.dokguru.client import dokguru_client
from app.integrations.dokguru.context_builder import SafeContextBuilder
from app.services import intelligence_service


# ---------------------------------------------------------------------------
# AI Tutor (student-facing)
# ---------------------------------------------------------------------------

async def student_ask(
    db: AsyncSession,
    student_id: str,
    request: TutorAskRequest,
) -> TutorAskResponse:
    """
    Answer a student's question, enriched with their learning profile as context.
    All personal data is stripped before being sent to DokGuru.
    """
    # Retrieve (or lazily create) the student's learning profile
    profile = await intelligence_service.get_profile(db, student_id)

    # Build anonymised context
    profile_dict = {
        "strengths": profile.strengths or [],
        "weaknesses": profile.weaknesses or [],
        "overall_health_score": profile.overall_health_score,
    }
    context = SafeContextBuilder.build_student_context(
        learning_profile=profile_dict,
        subject=request.subject,
    )

    answer = await dokguru_client.ask(context=context, question=request.question)

    return TutorAskResponse(
        question=request.question,
        answer=answer,
        subject=request.subject,
        context_used=True,
    )


# ---------------------------------------------------------------------------
# Teacher Copilot – Lesson Plan
# ---------------------------------------------------------------------------

async def generate_lesson_plan(
    db: AsyncSession,
    request: LessonPlanRequest,
) -> LessonPlanResponse:
    """Generate a structured lesson plan via DokGuru."""
    plan_text = await dokguru_client.generate_lesson_plan(
        subject=request.subject,
        topic=request.topic,
        grade_level=request.grade_level,
        duration_minutes=request.duration_minutes,
        learning_objectives=request.learning_objectives,
    )

    return LessonPlanResponse(
        subject=request.subject,
        topic=request.topic,
        grade_level=request.grade_level,
        duration_minutes=request.duration_minutes,
        lesson_plan=plan_text,
    )


# ---------------------------------------------------------------------------
# Teacher Copilot – Student Feedback
# ---------------------------------------------------------------------------

async def generate_feedback_for_student(
    db: AsyncSession,
    request: FeedbackRequest,
) -> FeedbackResponse:
    """
    Generate personalised AI feedback for a student's assessment result.
    The student's name is NOT sent to DokGuru; only anonymised academic data.
    """
    # Fetch the assessment result
    result_q = await db.execute(
        select(AssessmentResult, Assessment)
        .join(Assessment, AssessmentResult.assessment_id == Assessment.id)
        .where(
            AssessmentResult.assessment_id == request.assessment_id,
            AssessmentResult.student_id == request.student_id,
        )
    )
    row = result_q.first()
    if not row:
        raise HTTPException(
            status_code=404,
            detail="No result found for this student and assessment.",
        )

    assessment_result, assessment = row
    score_pct = (assessment_result.score / assessment.max_score * 100) if assessment.max_score > 0 else 0.0

    # Fetch learning profile for context-aware feedback
    profile = await intelligence_service.get_profile(db, request.student_id)
    strengths = profile.strengths or []
    weaknesses = profile.weaknesses or []

    # Use subject name if available (no PII)
    subject_name = "the subject"
    if assessment.subject_id:
        from app.models.school import Subject
        subj_q = await db.execute(select(Subject).where(Subject.id == assessment.subject_id))
        subj = subj_q.scalars().first()
        if subj:
            subject_name = subj.name

    feedback_text = await dokguru_client.generate_student_feedback(
        student_name_anon="the student",
        subject=subject_name,
        score_pct=score_pct,
        strengths=strengths,
        weaknesses=weaknesses,
    )

    # Persist feedback on the result row
    assessment_result.ai_feedback = feedback_text
    await db.commit()

    return FeedbackResponse(
        assessment_id=request.assessment_id,
        student_id=request.student_id,
        feedback=feedback_text,
        score_pct=round(score_pct, 2),
    )
