from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException

from app.models.school import School, ClassRoom, Subject
from app.schemas.school import (
    SchoolCreate, SchoolUpdate,
    ClassRoomCreate, ClassRoomUpdate,
    SubjectCreate, SubjectUpdate,
)


# --- School Services ---
async def get_schools(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[School]:
    result = await db.execute(select(School).offset(skip).limit(limit))
    return result.scalars().all()

async def get_school(db: AsyncSession, school_id: int) -> Optional[School]:
    result = await db.execute(select(School).where(School.id == school_id))
    return result.scalars().first()

async def create_school(db: AsyncSession, school: SchoolCreate) -> School:
    db_school = School(**school.model_dump())
    db.add(db_school)
    await db.commit()
    await db.refresh(db_school)
    return db_school

async def update_school(db: AsyncSession, school_id: int, school_update: SchoolUpdate) -> Optional[School]:
    db_school = await get_school(db, school_id)
    if not db_school:
        return None
    for key, value in school_update.model_dump(exclude_unset=True).items():
        setattr(db_school, key, value)
    await db.commit()
    await db.refresh(db_school)
    return db_school

async def delete_school(db: AsyncSession, school_id: int) -> Optional[School]:
    db_school = await get_school(db, school_id)
    if not db_school:
        return None
    await db.delete(db_school)
    await db.commit()
    return db_school


# --- ClassRoom Services ---
async def get_classes(db: AsyncSession, school_id: int, skip: int = 0, limit: int = 100) -> List[ClassRoom]:
    result = await db.execute(
        select(ClassRoom).where(ClassRoom.school_id == school_id).offset(skip).limit(limit)
    )
    return result.scalars().all()

async def get_class(db: AsyncSession, class_id: int) -> Optional[ClassRoom]:
    result = await db.execute(select(ClassRoom).where(ClassRoom.id == class_id))
    return result.scalars().first()

async def create_class(db: AsyncSession, school_id: int, classroom: ClassRoomCreate) -> ClassRoom:
    db_school = await get_school(db, school_id)
    if not db_school:
        raise HTTPException(status_code=404, detail="School not found")
    db_class = ClassRoom(**classroom.model_dump(), school_id=school_id)
    db.add(db_class)
    await db.commit()
    await db.refresh(db_class)
    return db_class

async def update_class(db: AsyncSession, class_id: int, class_update: ClassRoomUpdate) -> Optional[ClassRoom]:
    db_class = await get_class(db, class_id)
    if not db_class:
        return None
    for key, value in class_update.model_dump(exclude_unset=True).items():
        setattr(db_class, key, value)
    await db.commit()
    await db.refresh(db_class)
    return db_class

async def delete_class(db: AsyncSession, class_id: int) -> Optional[ClassRoom]:
    db_class = await get_class(db, class_id)
    if not db_class:
        return None
    await db.delete(db_class)
    await db.commit()
    return db_class


# --- Subject Services ---
async def get_subjects(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Subject]:
    result = await db.execute(select(Subject).offset(skip).limit(limit))
    return result.scalars().all()

async def get_subject(db: AsyncSession, subject_id: int) -> Optional[Subject]:
    result = await db.execute(select(Subject).where(Subject.id == subject_id))
    return result.scalars().first()

async def create_subject(db: AsyncSession, subject: SubjectCreate) -> Subject:
    db_subject = Subject(**subject.model_dump())
    db.add(db_subject)
    try:
        await db.commit()
        await db.refresh(db_subject)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Subject with this code already exists")
    return db_subject

async def update_subject(db: AsyncSession, subject_id: int, subject_update: SubjectUpdate) -> Optional[Subject]:
    db_subject = await get_subject(db, subject_id)
    if not db_subject:
        return None
    for key, value in subject_update.model_dump(exclude_unset=True).items():
        setattr(db_subject, key, value)
    try:
        await db.commit()
        await db.refresh(db_subject)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Subject code already in use")
    return db_subject

async def delete_subject(db: AsyncSession, subject_id: int) -> Optional[Subject]:
    db_subject = await get_subject(db, subject_id)
    if not db_subject:
        return None
    await db.delete(db_subject)
    await db.commit()
    return db_subject


# --- Subject Assignment Services ---
async def assign_subject_to_class(db: AsyncSession, class_id: int, subject_id: int) -> ClassRoom:
    db_class = await get_class(db, class_id)
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    db_subject = await get_subject(db, subject_id)
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    # Load subjects relationship (lazy load under async requires selectin)
    await db.refresh(db_class, attribute_names=["subjects"])
    if db_subject in db_class.subjects:
        raise HTTPException(status_code=400, detail="Subject already assigned to this class")

    db_class.subjects.append(db_subject)
    await db.commit()
    await db.refresh(db_class, attribute_names=["subjects"])
    return db_class

async def remove_subject_from_class(db: AsyncSession, class_id: int, subject_id: int) -> ClassRoom:
    db_class = await get_class(db, class_id)
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    db_subject = await get_subject(db, subject_id)
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    await db.refresh(db_class, attribute_names=["subjects"])
    if db_subject not in db_class.subjects:
        raise HTTPException(status_code=400, detail="Subject not assigned to this class")

    db_class.subjects.remove(db_subject)
    await db.commit()
    await db.refresh(db_class, attribute_names=["subjects"])
    return db_class
