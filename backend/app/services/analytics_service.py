"""
services/analytics_service.py
-------------------------------
Business logic for all Analytics & Dashboard views (Feature 8).

Three analytics scopes:
  1. School Admin  – school-wide overview (all classes, risk, performance)
  2. Teacher       – class-wide insights for a specific class/subject
  3. Student/Parent – individual student's progress over time

Design notes:
- Score percentages are 0-100 floats; health scores are also 0-100.
- `bypass_assignment_check=True` lets admins view any class without an
  explicit TeacherAssignment row.
"""

from datetime import date, timedelta
from typing import List, Optional

from sqlalchemy import select, nulls_last
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.models.school import School, ClassRoom, Subject
from app.models.user import User, TeacherAssignment
from app.models.attendance import AttendanceRecord
from app.models.assessment import Assessment, AssessmentResult
from app.models.intelligence import StudentLearningProfile, RiskSignal
from app.schemas.analytics import (
    SchoolAnalytics,
    ClassSummary,
    SubjectPerformance,
    TeacherAnalytics,
    StudentSummary,
    StudentAnalytics,
    AssessmentResultSummary,
    AttendanceSummary,
    RiskSummary,
    TrendPoint,
)

ATTENDANCE_WINDOW_DAYS = 30
PASS_THRESHOLD_PCT = 40.0  # % of max score required to pass


# ---------------------------------------------------------------------------
# Shared helpers
# ---------------------------------------------------------------------------

async def _attendance_rate_for_students(
    db: AsyncSession,
    student_ids: List[str],
    days: int = ATTENDANCE_WINDOW_DAYS,
) -> Optional[float]:
    """Return overall attendance rate (0-100) for a cohort of students."""
    if not student_ids:
        return None
    since = date.today() - timedelta(days=days)
    result = await db.execute(
        select(AttendanceRecord).where(
            AttendanceRecord.student_id.in_(student_ids),
            AttendanceRecord.date >= since,
        )
    )
    records = result.scalars().all()
    if not records:
        return None
    present = sum(1 for r in records if r.status == "PRESENT")
    return round(present / len(records) * 100, 2)


async def _average_score_pct_for_students(
    db: AsyncSession,
    student_ids: List[str],
    class_id: Optional[int] = None,
) -> Optional[float]:
    """Return average score percentage for a cohort, optionally scoped to a class."""
    if not student_ids:
        return None
    query = (
        select(AssessmentResult, Assessment)
        .join(Assessment, AssessmentResult.assessment_id == Assessment.id)
        .where(AssessmentResult.student_id.in_(student_ids))
    )
    if class_id:
        query = query.where(Assessment.class_id == class_id)
    result = await db.execute(query)
    rows = result.all()
    if not rows:
        return None
    pcts = [
        r.AssessmentResult.score / r.Assessment.max_score * 100
        for r in rows
        if r.Assessment.max_score > 0
    ]
    return round(sum(pcts) / len(pcts), 2) if pcts else None


async def _pass_rate_for_students(
    db: AsyncSession,
    student_ids: List[str],
    class_id: Optional[int] = None,
) -> Optional[float]:
    """Return the percentage of result entries that meet the pass threshold."""
    if not student_ids:
        return None
    query = (
        select(AssessmentResult, Assessment)
        .join(Assessment, AssessmentResult.assessment_id == Assessment.id)
        .where(AssessmentResult.student_id.in_(student_ids))
    )
    if class_id:
        query = query.where(Assessment.class_id == class_id)
    result = await db.execute(query)
    rows = result.all()
    if not rows:
        return None
    pcts = [
        r.AssessmentResult.score / r.Assessment.max_score * 100
        for r in rows
        if r.Assessment.max_score > 0
    ]
    if not pcts:
        return None
    passed = sum(1 for p in pcts if p >= PASS_THRESHOLD_PCT)
    return round(passed / len(pcts) * 100, 2)


async def _subject_performance(
    db: AsyncSession,
    student_ids: List[str],
    class_id: Optional[int] = None,
) -> List[SubjectPerformance]:
    """Compute per-subject performance stats for a cohort of students."""
    if not student_ids:
        return []

    query = (
        select(AssessmentResult, Assessment, Subject)
        .join(Assessment, AssessmentResult.assessment_id == Assessment.id)
        .outerjoin(Subject, Assessment.subject_id == Subject.id)
        .where(AssessmentResult.student_id.in_(student_ids))
    )
    if class_id:
        query = query.where(Assessment.class_id == class_id)

    result = await db.execute(query)
    rows = result.all()

    # Group by (subject_id, subject_name)
    # key → {"name": str, "pcts": [float], "assessment_ids": set}
    by_subject: dict = {}
    for ar, asmnt, subj in rows:
        subj_id = asmnt.subject_id or 0
        subj_name = subj.name if subj else "General"
        if subj_id not in by_subject:
            by_subject[subj_id] = {
                "name": subj_name,
                "pcts": [],
                "assessment_ids": set(),
            }
        if asmnt.max_score > 0:
            pct = ar.score / asmnt.max_score * 100
            by_subject[subj_id]["pcts"].append(pct)
            by_subject[subj_id]["assessment_ids"].add(asmnt.id)

    out: List[SubjectPerformance] = []
    for subj_id, data in by_subject.items():
        if not data["pcts"]:
            continue
        pcts = data["pcts"]
        avg = round(sum(pcts) / len(pcts), 2)
        pass_rate = round(
            sum(1 for p in pcts if p >= PASS_THRESHOLD_PCT) / len(pcts) * 100, 2
        )
        out.append(
            SubjectPerformance(
                subject_id=subj_id,
                subject_name=data["name"],
                average_score_pct=avg,
                pass_rate_pct=pass_rate,
                total_assessments=len(data["assessment_ids"]),  # distinct assessments
            )
        )
    return sorted(out, key=lambda x: x.average_score_pct, reverse=True)


async def _performance_trend(
    db: AsyncSession,
    student_ids: List[str],
    class_id: Optional[int] = None,
) -> List[TrendPoint]:
    """Calculate average score percentage grouped by month."""
    if not student_ids:
        return []
    
    query = (
        select(AssessmentResult, Assessment)
        .join(Assessment, AssessmentResult.assessment_id == Assessment.id)
        .where(AssessmentResult.student_id.in_(student_ids))
        .where(Assessment.scheduled_date.is_not(None))
    )
    if class_id:
        query = query.where(Assessment.class_id == class_id)
        
    result = await db.execute(query)
    rows = result.all()
    
    # Group by YYYY-MM
    by_month = {}
    for ar, asmnt in rows:
        if asmnt.max_score <= 0 or not asmnt.scheduled_date:
            continue
        # Use strftime to format as Mon YYYY
        month_label = asmnt.scheduled_date.strftime("%b %Y")
        # To keep chronological order easily, we also store the raw date
        sort_key = asmnt.scheduled_date.strftime("%Y-%m")
        if sort_key not in by_month:
            by_month[sort_key] = {"label": month_label, "pcts": []}
        by_month[sort_key]["pcts"].append(ar.score / asmnt.max_score * 100)
        
    out = []
    # Sort chronologically by the YYYY-MM key
    for sort_key in sorted(by_month.keys()):
        data = by_month[sort_key]
        pcts = data["pcts"]
        avg = sum(pcts) / len(pcts)
        out.append(TrendPoint(label=data["label"], score_pct=round(avg, 2)))
    
    return out


# ---------------------------------------------------------------------------
# Feature 8a: School Admin Analytics
# ---------------------------------------------------------------------------

async def get_school_analytics(db: AsyncSession, school_id: int) -> SchoolAnalytics:
    """Return a full school-wide analytics snapshot."""

    # Verify school exists
    school_q = await db.execute(select(School).where(School.id == school_id))
    school = school_q.scalars().first()
    if not school:
        raise HTTPException(status_code=404, detail="School not found.")

    # All classes
    classes_q = await db.execute(
        select(ClassRoom).where(ClassRoom.school_id == school_id)
    )
    classes = classes_q.scalars().all()

    # All active users in school
    users_q = await db.execute(
        select(User).where(User.school_id == school_id, User.is_active == True)  # noqa: E712
    )
    all_users = users_q.scalars().all()
    students = [u for u in all_users if u.role == "STUDENT"]
    teachers = [u for u in all_users if u.role == "TEACHER"]
    student_ids = [s.id for s in students]

    # School-wide metrics
    overall_attendance = await _attendance_rate_for_students(db, student_ids)
    overall_avg_score = await _average_score_pct_for_students(db, student_ids)

    # Active risk signals count
    risk_q = await db.execute(
        select(RiskSignal).where(
            RiskSignal.student_id.in_(student_ids),
            RiskSignal.is_resolved == False,  # noqa: E712
        )
    )
    active_risks = len(risk_q.scalars().all())

    # Per-class breakdown
    class_summaries: List[ClassSummary] = []
    for cls in classes:
        cls_student_ids = [s.id for s in students if s.class_id == cls.id]

        # Avg health score for this class
        if cls_student_ids:
            hp_q = await db.execute(
                select(StudentLearningProfile).where(
                    StudentLearningProfile.student_id.in_(cls_student_ids)
                )
            )
            cls_profiles = hp_q.scalars().all()
            avg_health = (
                round(
                    sum(p.overall_health_score for p in cls_profiles) / len(cls_profiles),
                    2,
                )
                if cls_profiles
                else None
            )
        else:
            avg_health = None

        cls_att = await _attendance_rate_for_students(db, cls_student_ids)
        cls_score = await _average_score_pct_for_students(db, cls_student_ids)

        class_summaries.append(
            ClassSummary(
                class_id=cls.id,
                grade_level=cls.grade_level,
                section=cls.section,
                total_students=len(cls_student_ids),
                average_health_score=avg_health,
                attendance_rate_pct=cls_att,
                average_score_pct=cls_score,
            )
        )

    # Top 5 subjects across the school
    top_subjects = await _subject_performance(db, student_ids)
    
    # Overall performance trend
    school_trend = await _performance_trend(db, student_ids)

    return SchoolAnalytics(
        school_id=school_id,
        school_name=school.name,
        total_students=len(students),
        total_teachers=len(teachers),
        total_classes=len(classes),
        overall_attendance_rate_pct=overall_attendance,
        overall_average_score_pct=overall_avg_score,
        active_risk_signals=active_risks,
        classes=sorted(class_summaries, key=lambda c: c.grade_level),
        top_subjects=top_subjects[:5],
        performance_trend=school_trend,
    )


# ---------------------------------------------------------------------------
# Feature 8b: Teacher Analytics
# ---------------------------------------------------------------------------

async def get_teacher_analytics(
    db: AsyncSession,
    teacher_id: str,
    class_id: int,
    bypass_assignment_check: bool = False,
) -> TeacherAnalytics:
    """
    Return class-wide insights for a teacher's class.
    Raises 404 if class not found; 403 if teacher not assigned (unless bypassed).
    """
    # Verify class
    cls_q = await db.execute(select(ClassRoom).where(ClassRoom.id == class_id))
    cls = cls_q.scalars().first()
    if not cls:
        raise HTTPException(status_code=404, detail="Class not found.")

    # Assignment check (skipped for admins)
    if not bypass_assignment_check:
        asgn_q = await db.execute(
            select(TeacherAssignment).where(
                TeacherAssignment.teacher_id == teacher_id,
                TeacherAssignment.class_id == class_id,
            )
        )
        if not asgn_q.scalars().first():
            raise HTTPException(
                status_code=403,
                detail="You are not assigned to this class.",
            )

    # Students in this class
    students_q = await db.execute(
        select(User).where(
            User.class_id == class_id,
            User.role == "STUDENT",
            User.is_active == True,  # noqa: E712
        )
    )
    students = students_q.scalars().all()
    student_ids = [s.id for s in students]

    # Class-level metrics
    cls_att = await _attendance_rate_for_students(db, student_ids)
    cls_avg_score = await _average_score_pct_for_students(db, student_ids, class_id=class_id)
    pass_rate = await _pass_rate_for_students(db, student_ids, class_id=class_id)

    # At-risk students (any open risk signal)
    risk_q = await db.execute(
        select(RiskSignal).where(
            RiskSignal.student_id.in_(student_ids),
            RiskSignal.is_resolved == False,  # noqa: E712
        )
    )
    at_risk_ids = {r.student_id for r in risk_q.scalars().all()}

    # Per-student summaries (one DB round-trip per student — acceptable for a dashboard)
    student_summaries: List[StudentSummary] = []
    for s in students:
        s_att = await _attendance_rate_for_students(db, [s.id])
        s_score = await _average_score_pct_for_students(db, [s.id], class_id=class_id)

        prof_q = await db.execute(
            select(StudentLearningProfile).where(
                StudentLearningProfile.student_id == s.id
            )
        )
        profile = prof_q.scalars().first()

        s_risk_q = await db.execute(
            select(RiskSignal).where(
                RiskSignal.student_id == s.id,
                RiskSignal.is_resolved == False,  # noqa: E712
            )
        )
        s_risk_count = len(s_risk_q.scalars().all())

        student_summaries.append(
            StudentSummary(
                student_id=s.id,
                full_name=s.full_name or "—",
                health_score=profile.overall_health_score if profile else None,
                attendance_rate_pct=s_att,
                average_score_pct=s_score,
                active_risk_count=s_risk_count,
            )
        )

    subject_perf = await _subject_performance(db, student_ids, class_id=class_id)
    class_trend = await _performance_trend(db, student_ids, class_id=class_id)

    return TeacherAnalytics(
        teacher_id=teacher_id,
        class_id=class_id,
        grade_level=cls.grade_level,
        section=cls.section,
        total_students=len(students),
        class_attendance_rate_pct=cls_att,
        class_average_score_pct=cls_avg_score,
        pass_rate_pct=pass_rate,
        at_risk_student_count=len(at_risk_ids),
        subject_performance=subject_perf,
        performance_trend=class_trend,
        # sort by score desc so weakest students appear last
        student_summaries=sorted(
            student_summaries, key=lambda x: x.average_score_pct or 0.0, reverse=True
        ),
    )


# ---------------------------------------------------------------------------
# Feature 8c: Student / Parent Analytics
# ---------------------------------------------------------------------------

async def get_student_analytics(
    db: AsyncSession,
    student_id: str,
) -> StudentAnalytics:
    """Return a complete personal progress report for a student."""

    # Verify student exists
    student_q = await db.execute(
        select(User).where(User.id == student_id, User.role == "STUDENT")
    )
    student = student_q.scalars().first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")

    # Classroom info
    grade_level = section = None
    if student.class_id:
        cls_q = await db.execute(
            select(ClassRoom).where(ClassRoom.id == student.class_id)
        )
        cls = cls_q.scalars().first()
        if cls:
            grade_level = cls.grade_level
            section = cls.section

    # Learning profile (health score)
    prof_q = await db.execute(
        select(StudentLearningProfile).where(
            StudentLearningProfile.student_id == student_id
        )
    )
    profile = prof_q.scalars().first()
    health_score = profile.overall_health_score if profile else None

    # Attendance summary (last 30 days)
    since = date.today() - timedelta(days=ATTENDANCE_WINDOW_DAYS)
    att_q = await db.execute(
        select(AttendanceRecord).where(
            AttendanceRecord.student_id == student_id,
            AttendanceRecord.date >= since,
        )
    )
    att_records = att_q.scalars().all()
    attendance_summary: Optional[AttendanceSummary] = None
    if att_records:
        present_count = sum(1 for r in att_records if r.status == "PRESENT")
        attendance_summary = AttendanceSummary(
            total_records=len(att_records),
            present_count=present_count,
            attendance_rate_pct=round(present_count / len(att_records) * 100, 2),
        )

    # Overall average score
    avg_score = await _average_score_pct_for_students(db, [student_id])

    # Active risk signals summary
    risk_q = await db.execute(
        select(RiskSignal).where(
            RiskSignal.student_id == student_id,
            RiskSignal.is_resolved == False,  # noqa: E712
        )
    )
    risk_signals = risk_q.scalars().all()
    risk_summary: Optional[RiskSummary] = None
    if risk_signals:
        risk_summary = RiskSummary(
            total_active_signals=len(risk_signals),
            high_severity=sum(1 for r in risk_signals if r.severity == "HIGH"),
            medium_severity=sum(1 for r in risk_signals if r.severity == "MEDIUM"),
            low_severity=sum(1 for r in risk_signals if r.severity == "LOW"),
        )

    # Subject-level performance breakdown
    subject_perf = await _subject_performance(db, [student_id])
    
    # Personal performance trend
    student_trend = await _performance_trend(db, [student_id])

    # 10 most recent assessment results (sorted by scheduled_date desc, then by id desc)
    results_q = await db.execute(
        select(AssessmentResult, Assessment, Subject)
        .join(Assessment, AssessmentResult.assessment_id == Assessment.id)
        .outerjoin(Subject, Assessment.subject_id == Subject.id)
        .where(AssessmentResult.student_id == student_id)
        .order_by(
            nulls_last(Assessment.scheduled_date.desc()),
            AssessmentResult.id.desc(),
        )
        .limit(10)
    )
    recent_rows = results_q.all()
    recent_results: List[AssessmentResultSummary] = []
    for ar, asmnt, subj in recent_rows:
        score_pct = (
            round(ar.score / asmnt.max_score * 100, 2) if asmnt.max_score > 0 else 0.0
        )
        recent_results.append(
            AssessmentResultSummary(
                assessment_id=asmnt.id,
                assessment_title=asmnt.title,
                assessment_type=asmnt.assessment_type,
                subject_name=subj.name if subj else None,
                score=ar.score,
                max_score=asmnt.max_score,
                score_pct=score_pct,
                scheduled_date=(
                    str(asmnt.scheduled_date) if asmnt.scheduled_date else None
                ),
            )
        )

    return StudentAnalytics(
        student_id=student_id,
        full_name=student.full_name or "—",
        grade_level=grade_level,
        section=section,
        overall_health_score=health_score,
        attendance=attendance_summary,
        average_score_pct=avg_score,
        risk_summary=risk_summary,
        subject_performance=subject_perf,
        recent_results=recent_results,
        performance_trend=student_trend,
    )
