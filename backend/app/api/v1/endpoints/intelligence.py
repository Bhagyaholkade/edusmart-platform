from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.intelligence import (
    StudentLearningProfileResponse,
    RiskSignalResponse,
    RiskSignalResolve,
    StudentDashboard,
)
from app.services import intelligence_service
from app.api.deps import get_current_user
from app.models.user import User
from app.core.rbac import Role

router = APIRouter()

_STAFF_ROLES = {Role.TEACHER, Role.SCHOOL_ADMIN, Role.SUPER_ADMIN}


def _can_access_student(current_user: User, student_id: str):
    """Raises 403 if caller cannot view this student's data."""
    if current_user.role in _STAFF_ROLES:
        return  # full access
    if current_user.role == Role.STUDENT and current_user.id == student_id:
        return  # own data
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")


# --- Learning Profile ---

@router.get(
    "/students/{student_id}/profile",
    response_model=StudentLearningProfileResponse,
    summary="Get student learning profile (read-only snapshot)",
)
async def get_student_profile(
    student_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _can_access_student(current_user, student_id)
    return await intelligence_service.get_profile(db, student_id)


@router.post(
    "/students/{student_id}/profile/refresh",
    response_model=StudentLearningProfileResponse,
    summary="Recompute health score and emit new risk signals (Teachers/Admins only)",
)
async def refresh_student_profile(
    student_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in _STAFF_ROLES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")
    return await intelligence_service.compute_and_refresh_profile(db, student_id)


# --- Risk Signals ---

@router.get(
    "/students/{student_id}/risks",
    response_model=List[RiskSignalResponse],
    summary="Get risk signals for a student",
)
async def get_risk_signals(
    student_id: str,
    include_resolved: bool = False,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _can_access_student(current_user, student_id)
    return await intelligence_service.get_risk_signals(db, student_id, include_resolved=include_resolved)


@router.patch(
    "/risks/{signal_id}/resolve",
    response_model=RiskSignalResponse,
    summary="Mark a risk signal as resolved (Teachers/Admins only)",
)
async def resolve_risk_signal(
    signal_id: int,
    resolve_data: RiskSignalResolve,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in _STAFF_ROLES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")
    return await intelligence_service.resolve_risk_signal(db, signal_id, resolve_data)


# --- Student Dashboard ---

@router.get(
    "/students/{student_id}/dashboard",
    response_model=StudentDashboard,
    summary="Aggregated student dashboard: profile + risks + attendance + grades",
)
async def get_student_dashboard(
    student_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _can_access_student(current_user, student_id)
    return await intelligence_service.get_student_dashboard(db, student_id)
