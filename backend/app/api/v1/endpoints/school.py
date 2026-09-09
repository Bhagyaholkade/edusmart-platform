from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.school import (
    SchoolCreate, SchoolResponse, SchoolUpdate,
    ClassRoomCreate, ClassRoomResponse, ClassRoomUpdate,
    SubjectCreate, SubjectResponse, SubjectUpdate
)
from app.services import school_service
from app.api.deps import get_current_user

router = APIRouter()

# --- Schools ---
@router.get("/schools", response_model=List[SchoolResponse])
def read_schools(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return school_service.get_schools(db, skip=skip, limit=limit)

@router.get("/schools/{school_id}", response_model=SchoolResponse)
def read_school(school_id: int, db: Session = Depends(get_db)):
    school = school_service.get_school(db, school_id)
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
    return school

@router.post("/schools", response_model=SchoolResponse, status_code=status.HTTP_201_CREATED)
def create_school(school: SchoolCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return school_service.create_school(db, school)

@router.put("/schools/{school_id}", response_model=SchoolResponse)
def update_school(school_id: int, school: SchoolUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_school = school_service.update_school(db, school_id, school)
    if not db_school:
        raise HTTPException(status_code=404, detail="School not found")
    return db_school

@router.delete("/schools/{school_id}", response_model=SchoolResponse)
def delete_school(school_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_school = school_service.delete_school(db, school_id)
    if not db_school:
        raise HTTPException(status_code=404, detail="School not found")
    return db_school

# --- Classes ---
@router.get("/schools/{school_id}/classes", response_model=List[ClassRoomResponse])
def read_classes(school_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    school = school_service.get_school(db, school_id)
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
    return school_service.get_classes(db, school_id, skip=skip, limit=limit)

@router.get("/classes/{class_id}", response_model=ClassRoomResponse)
def read_class(class_id: int, db: Session = Depends(get_db)):
    db_class = school_service.get_class(db, class_id)
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    return db_class

@router.post("/schools/{school_id}/classes", response_model=ClassRoomResponse, status_code=status.HTTP_201_CREATED)
def create_class(school_id: int, classroom: ClassRoomCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return school_service.create_class(db, school_id, classroom)

@router.put("/classes/{class_id}", response_model=ClassRoomResponse)
def update_class(class_id: int, classroom: ClassRoomUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_class = school_service.update_class(db, class_id, classroom)
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    return db_class

@router.delete("/classes/{class_id}", response_model=ClassRoomResponse)
def delete_class(class_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_class = school_service.delete_class(db, class_id)
    if not db_class:
        raise HTTPException(status_code=404, detail="Class not found")
    return db_class

# --- Subjects ---
@router.get("/subjects", response_model=List[SubjectResponse])
def read_subjects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return school_service.get_subjects(db, skip=skip, limit=limit)

@router.post("/subjects", response_model=SubjectResponse, status_code=status.HTTP_201_CREATED)
def create_subject(subject: SubjectCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return school_service.create_subject(db, subject)

@router.put("/subjects/{subject_id}", response_model=SubjectResponse)
def update_subject(subject_id: int, subject: SubjectUpdate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_subject = school_service.update_subject(db, subject_id, subject)
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return db_subject

@router.delete("/subjects/{subject_id}", response_model=SubjectResponse)
def delete_subject(subject_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_subject = school_service.delete_subject(db, subject_id)
    if not db_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return db_subject

# --- Assignments ---
@router.post("/classes/{class_id}/subjects/{subject_id}", response_model=ClassRoomResponse)
def assign_subject_to_class(class_id: int, subject_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return school_service.assign_subject_to_class(db, class_id, subject_id)

@router.delete("/classes/{class_id}/subjects/{subject_id}", response_model=ClassRoomResponse)
def remove_subject_from_class(class_id: int, subject_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return school_service.remove_subject_from_class(db, class_id, subject_id)
