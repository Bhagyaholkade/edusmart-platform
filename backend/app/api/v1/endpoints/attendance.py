from datetime import date
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.attendance import AttendanceBulkCreate, AttendanceResponse, AttendanceUpdate
from app.services import attendance_service
from app.api.deps import get_current_user
from app.models.user import User
from app.core.rbac import Role

router = APIRouter()

_WRITE_ROLES = {Role.TEACHER, Role.SCHOOL_ADMIN, Role.SUPER_ADMIN}
_READ_CLASS_ROLES = {Role.TEACHER, Role.SCHOOL_ADMIN, Role.SUPER_ADMIN}


def _require_write_access(current_user: User):
    if current_user.role not in _WRITE_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers or admins can manage attendance.",
        )


@router.post(
    "/bulk",
    response_model=List[AttendanceResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Mark / update attendance for a whole class on a given date",
)
async def mark_bulk_attendance(
    payload: AttendanceBulkCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_write_access(current_user)
    return await attendance_service.mark_bulk_attendance(db, payload, current_user.id)


@router.put("/{record_id}", response_model=AttendanceResponse, summary="Correct a single attendance record")
async def update_attendance(
    record_id: int,
    payload: AttendanceUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_write_access(current_user)
    return await attendance_service.update_attendance_record(db, record_id, current_user.id, payload)


@router.get(
    "/class/{class_id}",
    response_model=List[AttendanceResponse],
    summary="Get attendance register for a class on a date (Teacher/Admin view)",
)
async def get_class_attendance(
    class_id: int,
    attendance_date: date,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in _READ_CLASS_ROLES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")
    return await attendance_service.get_class_attendance(db, class_id, attendance_date)


@router.get(
    "/student/{student_id}",
    response_model=List[AttendanceResponse],
    summary="Get attendance records for a student (Student/Parent/Teacher)",
)
async def get_student_attendance(
    student_id: str,
    class_id: Optional[int] = None,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
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

    return await attendance_service.get_student_attendance(
        db, student_id, class_id=class_id, from_date=from_date, to_date=to_date
    )
