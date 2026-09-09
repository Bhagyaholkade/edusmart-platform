from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user import User, TeacherAssignment
from app.models.school import ClassRoom, Subject
from app.schemas.user import UserApprove

def get_users(db: Session, role: str = None, school_id: int = None, is_approved: bool = None, skip: int = 0, limit: int = 100):
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    if school_id:
        query = query.filter(User.school_id == school_id)
    if is_approved is not None:
        query = query.filter(User.is_approved == is_approved)
    return query.offset(skip).limit(limit).all()

def get_user(db: Session, user_id: str):
    return db.query(User).filter(User.id == user_id).first()

def approve_user(db: Session, user_id: str, approval_data: UserApprove):
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.is_approved = approval_data.is_approved
    user.role = approval_data.role
    if approval_data.school_id:
        user.school_id = approval_data.school_id
        
    db.commit()
    db.refresh(user)
    return user

def enroll_student(db: Session, student_id: str, class_id: int):
    user = get_user(db, student_id)
    if not user or user.role != "STUDENT":
        raise HTTPException(status_code=404, detail="Student not found or invalid role")
        
    classroom = db.query(ClassRoom).filter(ClassRoom.id == class_id).first()
    if not classroom:
        raise HTTPException(status_code=404, detail="Class not found")
        
    user.class_id = class_id
    db.commit()
    db.refresh(user)
    return user

def assign_teacher_to_class(db: Session, teacher_id: str, class_id: int, subject_id: int):
    user = get_user(db, teacher_id)
    if not user or user.role != "TEACHER":
        raise HTTPException(status_code=404, detail="Teacher not found or invalid role")
        
    classroom = db.query(ClassRoom).filter(ClassRoom.id == class_id).first()
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    
    if not classroom or not subject:
        raise HTTPException(status_code=404, detail="Class or Subject not found")
        
    # Check if assignment already exists
    existing = db.query(TeacherAssignment).filter(
        TeacherAssignment.teacher_id == teacher_id,
        TeacherAssignment.class_id == class_id,
        TeacherAssignment.subject_id == subject_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Teacher already assigned to this class for this subject")
        
    assignment = TeacherAssignment(teacher_id=teacher_id, class_id=class_id, subject_id=subject_id)
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment

def remove_teacher_assignment(db: Session, teacher_id: str, class_id: int, subject_id: int):
    assignment = db.query(TeacherAssignment).filter(
        TeacherAssignment.teacher_id == teacher_id,
        TeacherAssignment.class_id == class_id,
        TeacherAssignment.subject_id == subject_id
    ).first()
    
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
        
    db.delete(assignment)
    db.commit()
    return True

def link_parent_student(db: Session, parent_id: str, student_id: str):
    parent = get_user(db, parent_id)
    student = get_user(db, student_id)
    
    if not parent or parent.role != "PARENT":
        raise HTTPException(status_code=404, detail="Parent not found or invalid role")
    if not student or student.role != "STUDENT":
        raise HTTPException(status_code=404, detail="Student not found or invalid role")
        
    if student in parent.children:
        raise HTTPException(status_code=400, detail="Student already linked to this parent")
        
    parent.children.append(student)
    db.commit()
    db.refresh(parent)
    return parent

def unlink_parent_student(db: Session, parent_id: str, student_id: str):
    parent = get_user(db, parent_id)
    student = get_user(db, student_id)
    
    if not parent or not student:
        raise HTTPException(status_code=404, detail="User not found")
        
    if student not in parent.children:
        raise HTTPException(status_code=400, detail="Student not linked to this parent")
        
    parent.children.remove(student)
    db.commit()
    db.refresh(parent)
    return parent
