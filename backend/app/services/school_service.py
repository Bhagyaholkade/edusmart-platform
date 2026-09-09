from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from app.models.school import School, ClassRoom, Subject
from app.schemas.school import (
    SchoolCreate, SchoolUpdate,
    ClassRoomCreate, ClassRoomUpdate,
    SubjectCreate, SubjectUpdate
)

# --- School Services ---
def get_schools(db: Session, skip: int = 0, limit: int = 100):
    return db.query(School).offset(skip).limit(limit).all()

def get_school(db: Session, school_id: int):
    return db.query(School).filter(School.id == school_id).first()

def create_school(db: Session, school: SchoolCreate):
    db_school = School(**school.model_dump())
    db.add(db_school)
    db.commit()
    db.refresh(db_school)
    return db_school

def update_school(db: Session, school_id: int, school_update: SchoolUpdate):
    db_school = get_school(db, school_id)
    if not db_school:
        return None
    for key, value in school_update.model_dump(exclude_unset=True).items():
        setattr(db_school, key, value)
    db.commit()
    db.refresh(db_school)
    return db_school

def delete_school(db: Session, school_id: int):
    db_school = get_school(db, school_id)
    if not db_school:
        return None
    db.delete(db_school)
    db.commit()
    return db_school

# --- ClassRoom Services ---
def get_classes(db: Session, school_id: int, skip: int = 0, limit: int = 100):
    return db.query(ClassRoom).filter(ClassRoom.school_id == school_id).offset(skip).limit(limit).all()

def get_class(db: Session, class_id: int):
    return db.query(ClassRoom).filter(ClassRoom.id == class_id).first()

def create_class(db: Session, school_id: int, classroom: ClassRoomCreate):
    db_school = get_school(db, school_id)
    if not db_school:
        raise HTTPException(status_code=404, detail="School not found")
    db_class = ClassRoom(**classroom.model_dump(), school_id=school_id)
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    return db_class

def update_class(db: Session, class_id: int, class_update: ClassRoomUpdate):
    db_class = get_class(db, class_id)
    if not db_class:
        return None
    for key, value in class_update.model_dump(exclude_unset=True).items():
        setattr(db_class, key, value)
    db.commit()
    db.refresh(db_class)
    return db_class

def delete_class(db: Session, class_id: int):
    db_class = get_class(db, class_id)
    if not db_class:
        return None
    db.delete(db_class)
    db.commit()
    return db_class

# --- Subject Services ---
def get_subjects(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Subject).offset(skip).limit(limit).all()

def get_subject(db: Session, subject_id: int):
    return db.query(Subject).filter(Subject.id == subject_id).first()

def create_subject(db: Session, subject: SubjectCreate):
    db_subject = Subject(**subject.model_dump())
    db.add(db_subject)
    try:
        db.commit()
        db.refresh(db_subject)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Subject with this code already exists")
    return db_subject

def update_subject(db: Session, subject_id: int, subject_update: SubjectUpdate):
    db_subject = get_subject(db, subject_id)
    if not db_subject:
        return None
    for key, value in subject_update.model_dump(exclude_unset=True).items():
        setattr(db_subject, key, value)
    try:
        db.commit()
        db.refresh(db_subject)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Subject code already in use")
    return db_subject

def delete_subject(db: Session, subject_id: int):
    db_subject = get_subject(db, subject_id)
    if not db_subject:
        return None
    db.delete(db_subject)
    db.commit()
    return db_subject

# --- Assignment Services ---
def assign_subject_to_class(db: Session, class_id: int, subject_id: int):
    db_class = get_class(db, class_id)
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    db_subject = get_subject(db, subject_id)
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
        
    if db_subject in db_class.subjects:
        raise HTTPException(status_code=400, detail="Subject already assigned to this class")
        
    db_class.subjects.append(db_subject)
    db.commit()
    db.refresh(db_class)
    return db_class

def remove_subject_from_class(db: Session, class_id: int, subject_id: int):
    db_class = get_class(db, class_id)
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    db_subject = get_subject(db, subject_id)
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
        
    if db_subject not in db_class.subjects:
        raise HTTPException(status_code=400, detail="Subject not assigned to this class")
        
    db_class.subjects.remove(db_subject)
    db.commit()
    db.refresh(db_class)
    return db_class
