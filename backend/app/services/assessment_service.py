from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException

from app.models.assessment import Assessment, AssessmentResult
from app.schemas.assessment import (
    AssessmentCreate, AssessmentUpdate,
    MarksSubmit, ClassAggregation,
)


# --- Assessment CRUD ---

def create_assessment(db: Session, data: AssessmentCreate, teacher_id: str) -> Assessment:
    assessment = Assessment(**data.model_dump(), created_by=teacher_id)
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    return assessment


def get_assessments(
    db: Session,
    class_id: Optional[int] = None,
    subject_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
) -> List[Assessment]:
    query = db.query(Assessment)
    if class_id:
        query = query.filter(Assessment.class_id == class_id)
    if subject_id:
        query = query.filter(Assessment.subject_id == subject_id)
    return query.offset(skip).limit(limit).all()


def get_assessment(db: Session, assessment_id: int) -> Assessment:
    a = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return a


def update_assessment(db: Session, assessment_id: int, data: AssessmentUpdate) -> Assessment:
    a = get_assessment(db, assessment_id)
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(a, key, value)
    db.commit()
    db.refresh(a)
    return a


def delete_assessment(db: Session, assessment_id: int) -> Assessment:
    a = get_assessment(db, assessment_id)
    db.delete(a)
    db.commit()
    return a


# --- Marks Submission ---

def submit_marks(
    db: Session,
    assessment_id: int,
    payload: MarksSubmit,
    teacher_id: str,
) -> List[AssessmentResult]:
    """Upsert marks for multiple students at once."""
    assessment = get_assessment(db, assessment_id)

    results = []
    for entry in payload.marks:
        if entry.score < 0 or entry.score > assessment.max_score:
            raise HTTPException(
                status_code=422,
                detail=f"Score {entry.score} is out of valid range (0–{assessment.max_score}) for student {entry.student_id}",
            )

        existing = (
            db.query(AssessmentResult)
            .filter(
                AssessmentResult.assessment_id == assessment_id,
                AssessmentResult.student_id == entry.student_id,
            )
            .first()
        )
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

    db.commit()
    for r in results:
        db.refresh(r)
    return results


# --- Read Results ---

def get_results_for_assessment(db: Session, assessment_id: int) -> List[AssessmentResult]:
    get_assessment(db, assessment_id)  # 404 guard
    return (
        db.query(AssessmentResult)
        .filter(AssessmentResult.assessment_id == assessment_id)
        .all()
    )


def get_results_for_student(
    db: Session,
    student_id: str,
    class_id: Optional[int] = None,
) -> List[AssessmentResult]:
    query = db.query(AssessmentResult).filter(AssessmentResult.student_id == student_id)
    if class_id:
        query = query.join(Assessment).filter(Assessment.class_id == class_id)
    return query.all()


# --- Aggregation ---

def get_class_aggregation(db: Session, assessment_id: int) -> ClassAggregation:
    assessment = get_assessment(db, assessment_id)
    results = (
        db.query(AssessmentResult)
        .filter(AssessmentResult.assessment_id == assessment_id)
        .all()
    )

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
