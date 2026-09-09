from datetime import date
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.attendance import (
    AttendanceBulkCreate,
    AttendanceResponse,
    AttendanceUpdate,
)
from app.services import attendance_service
from app.api.deps import get_current_user
from app.models.user import User
from app.core.rbac import Role

router = APIRouter()


def _require_teacher_or_admin(current_user: User):
    """Dependency-style guard: only TEACHER/SCHOOL_ADMIN/SUPER_ADMIN can write."""
    allowed = {Role.TEACHER, Role.SCHOOL_ADMIN, Role.SUPER_ADMIN}
    if current_user.role not in allowed:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers or admins can manage attendance.",
        )


# --------------------------------------------------------------------------- #
# Write endpoints (Teachers / Admins only)                                    #
# --------------------------------------------------------------------------- #

@router.post(
    "/bulk",
    response_model=List[AttendanceResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Mark / update attendance for a whole class on a given date",
)
def mark_bulk_attendance(
    payload: AttendanceBulkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Teachers submit a list of student-status pairs for their class on a date.

    **UI behaviour hint**: the frontend should render a checklist of every
    student in the class — defaulting to PRESENT — and let the teacher flip
    individual students to ABSENT or LATE before submitting the whole form.
    This keeps the workflow fast (one submit = full register).
    """
    _require_teacher_or_admin(current_user)
    return attendance_service.mark_bulk_attendance(db, payload, current_user.id)


@router.put(
    "/{record_id}",
    response_model=AttendanceResponse,
    summary="Correct a single attendance record",
)
def update_attendance(
    record_id: int,
    payload: AttendanceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_teacher_or_admin(current_user)
    return attendance_service.update_attendance_record(db, record_id, current_user.id, payload)


# --------------------------------------------------------------------------- #
# Read endpoints (all authenticated users)                                    #
# --------------------------------------------------------------------------- #

@router.get(
    "/class/{class_id}",
    response_model=List[AttendanceResponse],
    summary="Get full attendance register for a class on a specific date (Teacher view)",
)
def get_class_attendance(
    class_id: int,
    attendance_date: date,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Students and parents cannot see the class-level register
    read_allowed = {Role.TEACHER, Role.SCHOOL_ADMIN, Role.SUPER_ADMIN}
    if current_user.role not in read_allowed:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied.",
        )
    return attendance_service.get_class_attendance(db, class_id, attendance_date)


@router.get(
    "/student/{student_id}",
    response_model=List[AttendanceResponse],
    summary="Get attendance records for a specific student",
)
def get_student_attendance(
    student_id: str,
    class_id: Optional[int] = None,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    - **Students** can only query their own record.
    - **Parents** can query records for their linked children.
    - **Teachers/Admins** can query any student.
    """
    # Students can only see their own
    if current_user.role == Role.STUDENT and current_user.id != student_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

    # Parents can only see their children's records
    if current_user.role == Role.PARENT:
        children_ids = [c.id for c in current_user.children]
        if student_id not in children_ids:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

    return attendance_service.get_student_attendance(
        db, student_id, class_id=class_id, from_date=from_date, to_date=to_date
    )
