from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException

from app.models.user import User, TeacherAssignment
from app.models.school import ClassRoom, Subject
from app.schemas.user import UserApprove


async def get_users(
    db: AsyncSession,
    role: Optional[str] = None,
    school_id: Optional[int] = None,
    is_approved: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100,
) -> List[User]:
    query = select(User)
    if role:
        query = query.where(User.role == role)
    if school_id:
        query = query.where(User.school_id == school_id)
    if is_approved is not None:
        query = query.where(User.is_approved == is_approved)
    result = await db.execute(query.offset(skip).limit(limit))
    return result.scalars().all()


async def get_user(db: AsyncSession, user_id: str) -> Optional[User]:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalars().first()


async def approve_user(db: AsyncSession, user_id: str, approval_data: UserApprove) -> User:
    user = await get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_approved = approval_data.is_approved
    user.role = approval_data.role
    if approval_data.school_id is not None:
        user.school_id = approval_data.school_id
    await db.commit()
    await db.refresh(user)
    return user


async def enroll_student(db: AsyncSession, student_id: str, class_id: int) -> User:
    user = await get_user(db, student_id)
    if not user or user.role != "STUDENT":
        raise HTTPException(status_code=404, detail="Student not found or invalid role")
    result = await db.execute(select(ClassRoom).where(ClassRoom.id == class_id))
    classroom = result.scalars().first()
    if not classroom:
        raise HTTPException(status_code=404, detail="Class not found")
    user.class_id = class_id
    await db.commit()
    await db.refresh(user)
    return user


async def assign_teacher_to_class(
    db: AsyncSession, teacher_id: str, class_id: int, subject_id: int
) -> TeacherAssignment:
    user = await get_user(db, teacher_id)
    if not user or user.role != "TEACHER":
        raise HTTPException(status_code=404, detail="Teacher not found or invalid role")

    classroom = (await db.execute(select(ClassRoom).where(ClassRoom.id == class_id))).scalars().first()
    subject = (await db.execute(select(Subject).where(Subject.id == subject_id))).scalars().first()
    if not classroom or not subject:
        raise HTTPException(status_code=404, detail="Class or Subject not found")

    existing = (
        await db.execute(
            select(TeacherAssignment).where(
                TeacherAssignment.teacher_id == teacher_id,
                TeacherAssignment.class_id == class_id,
                TeacherAssignment.subject_id == subject_id,
            )
        )
    ).scalars().first()
    if existing:
        raise HTTPException(status_code=400, detail="Teacher already assigned to this class for this subject")

    assignment = TeacherAssignment(teacher_id=teacher_id, class_id=class_id, subject_id=subject_id)
    db.add(assignment)
    await db.commit()
    await db.refresh(assignment)
    return assignment


async def remove_teacher_assignment(
    db: AsyncSession, teacher_id: str, class_id: int, subject_id: int
) -> None:
    assignment = (
        await db.execute(
            select(TeacherAssignment).where(
                TeacherAssignment.teacher_id == teacher_id,
                TeacherAssignment.class_id == class_id,
                TeacherAssignment.subject_id == subject_id,
            )
        )
    ).scalars().first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    await db.delete(assignment)
    await db.commit()


async def link_parent_student(db: AsyncSession, parent_id: str, student_id: str) -> User:
    parent = await get_user(db, parent_id)
    student = await get_user(db, student_id)
    if not parent or parent.role != "PARENT":
        raise HTTPException(status_code=404, detail="Parent not found or invalid role")
    if not student or student.role != "STUDENT":
        raise HTTPException(status_code=404, detail="Student not found or invalid role")

    await db.refresh(parent, attribute_names=["children"])
    if student in parent.children:
        raise HTTPException(status_code=400, detail="Student already linked to this parent")
    parent.children.append(student)
    await db.commit()
    await db.refresh(parent)
    return parent


async def unlink_parent_student(db: AsyncSession, parent_id: str, student_id: str) -> User:
    parent = await get_user(db, parent_id)
    student = await get_user(db, student_id)
    if not parent or not student:
        raise HTTPException(status_code=404, detail="User not found")

    await db.refresh(parent, attribute_names=["children"])
    if student not in parent.children:
        raise HTTPException(status_code=400, detail="Student not linked to this parent")
    parent.children.remove(student)
    await db.commit()
    await db.refresh(parent)
    return parent
