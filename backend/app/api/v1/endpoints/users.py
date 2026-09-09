from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.user import UserResponse, UserApprove, TeacherAssignmentBase, TeacherAssignmentResponse, ParentStudentLink
from app.services import user_service
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
def get_users(
    role: Optional[str] = None,
    school_id: Optional[int] = None,
    is_approved: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return user_service.get_users(db, role=role, school_id=school_id, is_approved=is_approved, skip=skip, limit=limit)

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: str, db: Session = Depends(get_db)):
    user = user_service.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}/approve", response_model=UserResponse)
def approve_user(user_id: str, approval_data: UserApprove, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    # Add admin check here if necessary
    return user_service.approve_user(db, user_id, approval_data)

@router.post("/students/{student_id}/enroll", response_model=UserResponse)
def enroll_student(student_id: str, class_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return user_service.enroll_student(db, student_id, class_id)

@router.post("/teachers/{teacher_id}/assignments", response_model=TeacherAssignmentResponse, status_code=status.HTTP_201_CREATED)
def assign_teacher_to_class(teacher_id: str, assignment: TeacherAssignmentBase, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return user_service.assign_teacher_to_class(db, teacher_id, assignment.class_id, assignment.subject_id)

@router.delete("/teachers/{teacher_id}/assignments")
def remove_teacher_assignment(teacher_id: str, class_id: int, subject_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    user_service.remove_teacher_assignment(db, teacher_id, class_id, subject_id)
    return {"message": "Assignment removed successfully"}

@router.post("/parents/link", response_model=UserResponse)
def link_parent_student(link_data: ParentStudentLink, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return user_service.link_parent_student(db, link_data.parent_id, link_data.student_id)

@router.delete("/parents/{parent_id}/students/{student_id}", response_model=UserResponse)
def unlink_parent_student(parent_id: str, student_id: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return user_service.unlink_parent_student(db, parent_id, student_id)
