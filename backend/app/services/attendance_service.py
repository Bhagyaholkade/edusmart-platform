from datetime import date
from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.attendance import AttendanceRecord
from app.models.user import User
from app.models.school import ClassRoom
from app.schemas.attendance import AttendanceCreate, AttendanceBulkCreate, AttendanceUpdate


def _verify_class_exists(db: Session, class_id: int):
    classroom = db.query(ClassRoom).filter(ClassRoom.id == class_id).first()
    if not classroom:
        raise HTTPException(status_code=404, detail="Class not found")
    return classroom


def mark_bulk_attendance(
    db: Session,
    bulk_data: AttendanceBulkCreate,
    teacher_id: str,
) -> List[AttendanceRecord]:
    """
    Upsert attendance for all students in the payload.
    If a record already exists for (student, class, date), update it.
    This is how teachers mark a full class-register in one go.
    """
    _verify_class_exists(db, bulk_data.class_id)

    results = []
    for record in bulk_data.records:
        existing = (
            db.query(AttendanceRecord)
            .filter(
                AttendanceRecord.student_id == record.student_id,
                AttendanceRecord.class_id == bulk_data.class_id,
                AttendanceRecord.date == bulk_data.date,
            )
            .first()
        )
        if existing:
            existing.status = record.status
            existing.remarks = record.remarks
            existing.recorded_by = teacher_id
            results.append(existing)
        else:
            new_record = AttendanceRecord(
                student_id=record.student_id,
                class_id=bulk_data.class_id,
                recorded_by=teacher_id,
                date=bulk_data.date,
                status=record.status,
                remarks=record.remarks,
            )
            db.add(new_record)
            results.append(new_record)

    db.commit()
    for r in results:
        db.refresh(r)
    return results


def get_class_attendance(
    db: Session,
    class_id: int,
    attendance_date: date,
) -> List[AttendanceRecord]:
    """Teacher view: all student records for a class on a given date."""
    _verify_class_exists(db, class_id)
    return (
        db.query(AttendanceRecord)
        .filter(
            AttendanceRecord.class_id == class_id,
            AttendanceRecord.date == attendance_date,
        )
        .all()
    )


def get_student_attendance(
    db: Session,
    student_id: str,
    class_id: Optional[int] = None,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
) -> List[AttendanceRecord]:
    """Student/Parent view: attendance records for a specific student."""
    query = db.query(AttendanceRecord).filter(
        AttendanceRecord.student_id == student_id
    )
    if class_id:
        query = query.filter(AttendanceRecord.class_id == class_id)
    if from_date:
        query = query.filter(AttendanceRecord.date >= from_date)
    if to_date:
        query = query.filter(AttendanceRecord.date <= to_date)
    return query.order_by(AttendanceRecord.date.desc()).all()


def update_attendance_record(
    db: Session,
    record_id: int,
    teacher_id: str,
    update_data: AttendanceUpdate,
) -> AttendanceRecord:
    """Update a single attendance record (correction by teacher)."""
    record = db.query(AttendanceRecord).filter(AttendanceRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    record.status = update_data.status
    record.remarks = update_data.remarks
    record.recorded_by = teacher_id
    db.commit()
    db.refresh(record)
    return record
