from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.user import UserResponse, UserApprove, TeacherAssignmentBase, TeacherAssignmentResponse, ParentStudentLink
from app.services import user_service
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
async def get_users(
    role: Optional[str] = None,
    school_id: Optional[int] = None,
    is_approved: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
):
    return await user_service.get_users(db, role=role, school_id=school_id, is_approved=is_approved, skip=skip, limit=limit)

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, db: AsyncSession = Depends(get_db)):
    user = await user_service.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}/approve", response_model=UserResponse)
async def approve_user(
    user_id: str,
    approval_data: UserApprove,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await user_service.approve_user(db, user_id, approval_data)

@router.post("/students/{student_id}/enroll", response_model=UserResponse)
async def enroll_student(
    student_id: str,
    class_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await user_service.enroll_student(db, student_id, class_id)

@router.post("/teachers/{teacher_id}/assignments", response_model=TeacherAssignmentResponse, status_code=status.HTTP_201_CREATED)
async def assign_teacher_to_class(
    teacher_id: str,
    assignment: TeacherAssignmentBase,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await user_service.assign_teacher_to_class(db, teacher_id, assignment.class_id, assignment.subject_id)

@router.delete("/teachers/{teacher_id}/assignments")
async def remove_teacher_assignment(
    teacher_id: str,
    class_id: int,
    subject_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await user_service.remove_teacher_assignment(db, teacher_id, class_id, subject_id)
    return {"message": "Assignment removed successfully"}

@router.post("/parents/link", response_model=UserResponse)
async def link_parent_student(
    link_data: ParentStudentLink,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await user_service.link_parent_student(db, link_data.parent_id, link_data.student_id)

@router.delete("/parents/{parent_id}/students/{student_id}", response_model=UserResponse)
async def unlink_parent_student(
    parent_id: str,
    student_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await user_service.unlink_parent_student(db, parent_id, student_id)
