from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

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

_WRITE_ROLES = {Role.TEACHER, Role.SCHOOL_ADMIN, Role.SUPER_ADMIN}


def _require_write_access(current_user: User):
    if current_user.role not in _WRITE_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers or admins can manage assessments.",
        )


@router.get("/", response_model=List[AssessmentResponse])
async def list_assessments(
    class_id: Optional[int] = None,
    subject_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await assessment_service.get_assessments(db, class_id=class_id, subject_id=subject_id, skip=skip, limit=limit)


@router.get("/{assessment_id}", response_model=AssessmentResponse)
async def get_assessment(
    assessment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await assessment_service.get_assessment(db, assessment_id)


@router.post("/", response_model=AssessmentResponse, status_code=status.HTTP_201_CREATED)
async def create_assessment(
    payload: AssessmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_write_access(current_user)
    return await assessment_service.create_assessment(db, payload, current_user.id)


@router.put("/{assessment_id}", response_model=AssessmentResponse)
async def update_assessment(
    assessment_id: int,
    payload: AssessmentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_write_access(current_user)
    return await assessment_service.update_assessment(db, assessment_id, payload)


@router.delete("/{assessment_id}", response_model=AssessmentResponse)
async def delete_assessment(
    assessment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_write_access(current_user)
    return await assessment_service.delete_assessment(db, assessment_id)


@router.post(
    "/{assessment_id}/marks",
    response_model=List[AssessmentResultResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Submit / update marks for multiple students",
)
async def submit_marks(
    assessment_id: int,
    payload: MarksSubmit,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_write_access(current_user)
    return await assessment_service.submit_marks(db, assessment_id, payload, current_user.id)


@router.get("/{assessment_id}/results", response_model=List[AssessmentResultResponse])
async def get_assessment_results(
    assessment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_write_access(current_user)
    return await assessment_service.get_results_for_assessment(db, assessment_id)


@router.get("/student/{student_id}/results", response_model=List[AssessmentResultResponse])
async def get_student_results(
    student_id: str,
    class_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role == Role.STUDENT and current_user.id != student_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")
    if current_user.role == Role.PARENT:
        await db.refresh(current_user, attribute_names=["children"])
        children_ids = [c.id for c in current_user.children]
        if student_id not in children_ids:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")
    return await assessment_service.get_results_for_student(db, student_id, class_id=class_id)


@router.get("/{assessment_id}/aggregation", response_model=ClassAggregation)
async def get_class_aggregation(
    assessment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_write_access(current_user)
    return await assessment_service.get_class_aggregation(db, assessment_id)
