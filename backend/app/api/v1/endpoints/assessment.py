from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.assessment import (
    AssessmentCreate, AssessmentUpdate, AssessmentResponse,
    MarksSubmit, AssessmentResultResponse, ClassAggregation,
)
from app.services import assessment_service
from app.api.deps import get_current_user
from app.models.user import User
from app.core.rbac import Role

router = APIRouter()


def _require_teacher_or_admin(current_user: User):
    allowed = {Role.TEACHER, Role.SCHOOL_ADMIN, Role.SUPER_ADMIN}
    if current_user.role not in allowed:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers or admins can manage assessments.",
        )


# --------------------------------------------------------------------------- #
# Assessment CRUD                                                              #
# --------------------------------------------------------------------------- #

@router.get("/", response_model=List[AssessmentResponse])
def list_assessments(
    class_id: Optional[int] = None,
    subject_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return assessment_service.get_assessments(db, class_id=class_id, subject_id=subject_id, skip=skip, limit=limit)


@router.get("/{assessment_id}", response_model=AssessmentResponse)
def get_assessment(
    assessment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return assessment_service.get_assessment(db, assessment_id)


@router.post("/", response_model=AssessmentResponse, status_code=status.HTTP_201_CREATED)
def create_assessment(
    payload: AssessmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_teacher_or_admin(current_user)
    return assessment_service.create_assessment(db, payload, current_user.id)


@router.put("/{assessment_id}", response_model=AssessmentResponse)
def update_assessment(
    assessment_id: int,
    payload: AssessmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_teacher_or_admin(current_user)
    return assessment_service.update_assessment(db, assessment_id, payload)


@router.delete("/{assessment_id}", response_model=AssessmentResponse)
def delete_assessment(
    assessment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_teacher_or_admin(current_user)
    return assessment_service.delete_assessment(db, assessment_id)


# --------------------------------------------------------------------------- #
# Marks / Results                                                              #
# --------------------------------------------------------------------------- #

@router.post(
    "/{assessment_id}/marks",
    response_model=List[AssessmentResultResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Submit / update marks for multiple students at once",
)
def submit_marks(
    assessment_id: int,
    payload: MarksSubmit,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_teacher_or_admin(current_user)
    return assessment_service.submit_marks(db, assessment_id, payload, current_user.id)


@router.get(
    "/{assessment_id}/results",
    response_model=List[AssessmentResultResponse],
    summary="Get all student results for an assessment (Teacher/Admin view)",
)
def get_assessment_results(
    assessment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_teacher_or_admin(current_user)
    return assessment_service.get_results_for_assessment(db, assessment_id)


@router.get(
    "/student/{student_id}/results",
    response_model=List[AssessmentResultResponse],
    summary="Get all results for a student (Student/Parent/Teacher view)",
)
def get_student_results(
    student_id: str,
    class_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Students can only see their own results
    if current_user.role == Role.STUDENT and current_user.id != student_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")
    # Parents can only see their children's results
    if current_user.role == Role.PARENT:
        children_ids = [c.id for c in current_user.children]
        if student_id not in children_ids:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")
    return assessment_service.get_results_for_student(db, student_id, class_id=class_id)


# --------------------------------------------------------------------------- #
# Aggregation                                                                  #
# --------------------------------------------------------------------------- #

@router.get(
    "/{assessment_id}/aggregation",
    response_model=ClassAggregation,
    summary="Get class-level performance stats for an assessment",
)
def get_class_aggregation(
    assessment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_teacher_or_admin(current_user)
    return assessment_service.get_class_aggregation(db, assessment_id)
