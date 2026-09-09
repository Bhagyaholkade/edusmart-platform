from datetime import date
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException

from app.models.attendance import AttendanceRecord
from app.models.school import ClassRoom
from app.schemas.attendance import AttendanceBulkCreate, AttendanceUpdate


async def _verify_class_exists(db: AsyncSession, class_id: int) -> ClassRoom:
    result = await db.execute(select(ClassRoom).where(ClassRoom.id == class_id))
    classroom = result.scalars().first()
    if not classroom:
        raise HTTPException(status_code=404, detail="Class not found")
    return classroom


async def mark_bulk_attendance(
    db: AsyncSession,
    bulk_data: AttendanceBulkCreate,
    teacher_id: str,
) -> List[AttendanceRecord]:
    """
    Upsert attendance for all students in the payload.
    If a record already exists for (student, class, date), update it.
    Teachers submit the full class register in one go.
    """
    await _verify_class_exists(db, bulk_data.class_id)

    results = []
    for record in bulk_data.records:
        existing_result = await db.execute(
            select(AttendanceRecord).where(
                AttendanceRecord.student_id == record.student_id,
                AttendanceRecord.class_id == bulk_data.class_id,
                AttendanceRecord.date == bulk_data.date,
            )
        )
        existing = existing_result.scalars().first()

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

    await db.commit()
    for r in results:
        await db.refresh(r)
    return results


async def get_class_attendance(
    db: AsyncSession,
    class_id: int,
    attendance_date: date,
) -> List[AttendanceRecord]:
    await _verify_class_exists(db, class_id)
    result = await db.execute(
        select(AttendanceRecord).where(
            AttendanceRecord.class_id == class_id,
            AttendanceRecord.date == attendance_date,
        )
    )
    return result.scalars().all()


async def get_student_attendance(
    db: AsyncSession,
    student_id: str,
    class_id: Optional[int] = None,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
) -> List[AttendanceRecord]:
    query = select(AttendanceRecord).where(AttendanceRecord.student_id == student_id)
    if class_id:
        query = query.where(AttendanceRecord.class_id == class_id)
    if from_date:
        query = query.where(AttendanceRecord.date >= from_date)
    if to_date:
        query = query.where(AttendanceRecord.date <= to_date)
    query = query.order_by(AttendanceRecord.date.desc())
    result = await db.execute(query)
    return result.scalars().all()


async def update_attendance_record(
    db: AsyncSession,
    record_id: int,
    teacher_id: str,
    update_data: AttendanceUpdate,
) -> AttendanceRecord:
    result = await db.execute(select(AttendanceRecord).where(AttendanceRecord.id == record_id))
    record = result.scalars().first()
    if not record:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    record.status = update_data.status
    record.remarks = update_data.remarks
    record.recorded_by = teacher_id
    await db.commit()
    await db.refresh(record)
    return record
