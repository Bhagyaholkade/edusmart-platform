from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException

from app.models.assessment import Assessment, AssessmentResult
from app.schemas.assessment import (
    AssessmentCreate, AssessmentUpdate,
    MarksSubmit, ClassAggregation,
)


async def create_assessment(db: AsyncSession, data: AssessmentCreate, teacher_id: str) -> Assessment:
    assessment = Assessment(**data.model_dump(), created_by=teacher_id)
    db.add(assessment)
    await db.commit()
    await db.refresh(assessment)
    return assessment


async def get_assessments(
    db: AsyncSession,
    class_id: Optional[int] = None,
    subject_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
) -> List[Assessment]:
    query = select(Assessment)
    if class_id:
        query = query.where(Assessment.class_id == class_id)
    if subject_id:
        query = query.where(Assessment.subject_id == subject_id)
    result = await db.execute(query.offset(skip).limit(limit))
    return result.scalars().all()


async def get_assessment(db: AsyncSession, assessment_id: int) -> Assessment:
    result = await db.execute(select(Assessment).where(Assessment.id == assessment_id))
    a = result.scalars().first()
    if not a:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return a


async def update_assessment(
    db: AsyncSession, assessment_id: int, data: AssessmentUpdate
) -> Assessment:
    a = await get_assessment(db, assessment_id)
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(a, key, value)
    await db.commit()
    await db.refresh(a)
    return a


async def delete_assessment(db: AsyncSession, assessment_id: int) -> Assessment:
    a = await get_assessment(db, assessment_id)
    await db.delete(a)
    await db.commit()
    return a


async def submit_marks(
    db: AsyncSession,
    assessment_id: int,
    payload: MarksSubmit,
    teacher_id: str,
) -> List[AssessmentResult]:
    """Upsert marks for multiple students at once with validation."""
    assessment = await get_assessment(db, assessment_id)

    results = []
    for entry in payload.marks:
        if entry.score < 0 or entry.score > assessment.max_score:
            raise HTTPException(
                status_code=422,
                detail=f"Score {entry.score} is out of valid range (0–{assessment.max_score}) for student {entry.student_id}",
            )
        existing_result = await db.execute(
            select(AssessmentResult).where(
                AssessmentResult.assessment_id == assessment_id,
                AssessmentResult.student_id == entry.student_id,
            )
        )
        existing = existing_result.scalars().first()
        if existing:
            existing.score = entry.score
            existing.submitted_by = teacher_id
            results.append(existing)
        else:
            result = AssessmentResult(
                assessment_id=assessment_id,
                student_id=entry.student_id,
                score=entry.score,
                submitted_by=teacher_id,
            )
            db.add(result)
            results.append(result)

    await db.commit()
    for r in results:
        await db.refresh(r)
    return results


async def get_results_for_assessment(
    db: AsyncSession, assessment_id: int
) -> List[AssessmentResult]:
    await get_assessment(db, assessment_id)  # 404 guard
    result = await db.execute(
        select(AssessmentResult).where(AssessmentResult.assessment_id == assessment_id)
    )
    return result.scalars().all()


async def get_results_for_student(
    db: AsyncSession,
    student_id: str,
    class_id: Optional[int] = None,
) -> List[AssessmentResult]:
    query = select(AssessmentResult).where(AssessmentResult.student_id == student_id)
    if class_id:
        query = query.join(Assessment).where(Assessment.class_id == class_id)
    result = await db.execute(query)
    return result.scalars().all()


async def get_class_aggregation(db: AsyncSession, assessment_id: int) -> ClassAggregation:
    assessment = await get_assessment(db, assessment_id)
    result = await db.execute(
        select(AssessmentResult).where(AssessmentResult.assessment_id == assessment_id)
    )
    results = result.scalars().all()

    if not results:
        raise HTTPException(status_code=404, detail="No results found for this assessment yet")

    scores = [r.score for r in results]
    pass_threshold = assessment.max_score * 0.4
    passed = sum(1 for s in scores if s >= pass_threshold)

    return ClassAggregation(
        assessment_id=assessment_id,
        class_id=assessment.class_id,
        total_students=len(scores),
        average_score=round(sum(scores) / len(scores), 2),
        highest_score=max(scores),
        lowest_score=min(scores),
        pass_rate=round((passed / len(scores)) * 100, 2),
    )
