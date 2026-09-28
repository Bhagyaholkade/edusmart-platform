"""
endpoints/analytics.py
-----------------------
Analytics & Dashboard API endpoints – Feature 8.

Routes:
  GET /analytics/school/{school_id}        – School Admin overview
  GET /analytics/teacher/class/{class_id}  – Teacher class dashboard
  GET /analytics/student/{student_id}      – Student / Parent personal analytics
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.analytics import SchoolAnalytics, TeacherAnalytics, StudentAnalytics
from app.services import analytics_service
from app.api.deps import get_current_user
from app.models.user import User
from app.core.rbac import Role

router = APIRouter()

_ADMIN_ROLES = {Role.SCHOOL_ADMIN, Role.SUPER_ADMIN}
_STAFF_ROLES = {Role.TEACHER, Role.SCHOOL_ADMIN, Role.SUPER_ADMIN}


# ---------------------------------------------------------------------------
# 8a – School Admin Analytics
# ---------------------------------------------------------------------------

@router.get(
    "/school/{school_id}",
    response_model=SchoolAnalytics,
    summary="School-wide analytics: attendance, performance, risk signals, class breakdown",
    tags=["analytics & dashboards"],
)
async def get_school_analytics(
    school_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Comprehensive school snapshot.

    **Access:**
    - `SCHOOL_ADMIN`: own school only
    - `SUPER_ADMIN`: any school
    """
    if current_user.role not in _ADMIN_ROLES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")
    if current_user.role == Role.SCHOOL_ADMIN and current_user.school_id != school_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")
    return await analytics_service.get_school_analytics(db, school_id)


# ---------------------------------------------------------------------------
# 8b – Teacher Analytics
# ---------------------------------------------------------------------------

@router.get(
    "/teacher/class/{class_id}",
    response_model=TeacherAnalytics,
    summary="Class-wide analytics: student performance, risk, subject breakdown",
    tags=["analytics & dashboards"],
)
async def get_teacher_analytics(
    class_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Class-wide performance dashboard.

    **Access:**
    - `TEACHER`: only classes they are assigned to
    - `SCHOOL_ADMIN` / `SUPER_ADMIN`: any class (assignment check bypassed)
    """
    if current_user.role not in _STAFF_ROLES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

    is_admin = current_user.role in _ADMIN_ROLES
    return await analytics_service.get_teacher_analytics(
        db,
        teacher_id=current_user.id,
        class_id=class_id,
        bypass_assignment_check=is_admin,
    )


# ---------------------------------------------------------------------------
# 8c – Student / Parent Analytics
# ---------------------------------------------------------------------------

@router.get(
    "/student/{student_id}",
    response_model=StudentAnalytics,
    summary="Personal analytics: attendance, scores, risk signals, subject performance",
    tags=["analytics & dashboards"],
)
async def get_student_analytics(
    student_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Complete personal progress report for a student.

    **Access:**
    - `STUDENT`: own data only
    - `PARENT`: only their linked children
    - `TEACHER` / Admins: any student
    """
    if current_user.role == Role.STUDENT and current_user.id != student_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

    if current_user.role == Role.PARENT:
        await db.refresh(current_user, attribute_names=["children"])
        child_ids = [c.id for c in current_user.children]
        if student_id not in child_ids:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

    return await analytics_service.get_student_analytics(db, student_id)
