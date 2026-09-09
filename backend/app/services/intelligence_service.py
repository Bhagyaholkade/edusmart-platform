"""
intelligence_service.py
------------------------
Computes Student Learning Profiles and Risk Signals.

Design decisions:
- This service is intentionally stateless: it recomputes signals on demand
  rather than storing stale snapshots. For production scale you would
  schedule nightly background jobs (e.g. Celery beat / APScheduler) to
  persist pre-computed results; the query logic here would stay the same.
- Risk thresholds are configurable constants at the top of the file.
"""
from datetime import date, timedelta
from typing import List, Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException

from app.models.intelligence import StudentLearningProfile, RiskSignal
from app.models.attendance import AttendanceRecord
from app.models.assessment import Assessment, AssessmentResult
from app.models.user import User
from app.schemas.intelligence import RiskSignalResolve

# ---------- Configurable thresholds ----------
ATTENDANCE_WINDOW_DAYS = 30
ATTENDANCE_DROP_THRESHOLD = 0.75   # below 75% → risk signal
GRADE_DROP_THRESHOLD = 0.40        # below 40% of max → grade-drop signal


# ---------- Internal helpers ----------

async def _get_or_create_profile(db: AsyncSession, student_id: str) -> StudentLearningProfile:
    result = await db.execute(
        select(StudentLearningProfile).where(StudentLearningProfile.student_id == student_id)
    )
    profile = result.scalars().first()
    if not profile:
        profile = StudentLearningProfile(
            student_id=student_id,
            overall_health_score=100.0,
            strengths=[],
            weaknesses=[],
        )
        db.add(profile)
        await db.commit()
        await db.refresh(profile)
    return profile


async def _attendance_rate(db: AsyncSession, student_id: str, days: int = ATTENDANCE_WINDOW_DAYS) -> Optional[float]:
    since = date.today() - timedelta(days=days)
    result = await db.execute(
        select(AttendanceRecord).where(
            AttendanceRecord.student_id == student_id,
            AttendanceRecord.date >= since,
        )
    )
    records = result.scalars().all()
    if not records:
        return None
    present_count = sum(1 for r in records if r.status == "PRESENT")
    return round(present_count / len(records), 4)


async def _average_score_pct(db: AsyncSession, student_id: str) -> Optional[float]:
    """Return the student's average score as a percentage of max_score across all assessments."""
    result = await db.execute(
        select(AssessmentResult, Assessment)
        .join(Assessment, AssessmentResult.assessment_id == Assessment.id)
        .where(AssessmentResult.student_id == student_id)
    )
    rows = result.all()
    if not rows:
        return None
    pct_scores = [row.AssessmentResult.score / row.Assessment.max_score for row in rows if row.Assessment.max_score > 0]
    if not pct_scores:
        return None
    return round(sum(pct_scores) / len(pct_scores), 4)


async def _emit_risk_signal(
    db: AsyncSession,
    student_id: str,
    signal_type: str,
    severity: str,
    description: str,
) -> None:
    """Emit a risk signal only if one of the same type isn't already open."""
    existing = await db.execute(
        select(RiskSignal).where(
            RiskSignal.student_id == student_id,
            RiskSignal.signal_type == signal_type,
            RiskSignal.is_resolved == False,  # noqa: E712
        )
    )
    if existing.scalars().first():
        return  # already flagged, don't duplicate
    signal = RiskSignal(
        student_id=student_id,
        signal_type=signal_type,
        severity=severity,
        description=description,
    )
    db.add(signal)


# ---------- Public API ----------

async def compute_and_refresh_profile(db: AsyncSession, student_id: str) -> StudentLearningProfile:
    """
    Recompute the student's health score and emit risk signals based on
    current attendance and grade data.
    """
    user_result = await db.execute(select(User).where(User.id == student_id))
    if not user_result.scalars().first():
        raise HTTPException(status_code=404, detail="Student not found")

    profile = await _get_or_create_profile(db, student_id)
    att_rate = await _attendance_rate(db, student_id)
    avg_score = await _average_score_pct(db, student_id)

    # --- Attendance risk check ---
    if att_rate is not None and att_rate < ATTENDANCE_DROP_THRESHOLD:
        severity = "HIGH" if att_rate < 0.5 else "MEDIUM"
        await _emit_risk_signal(
            db, student_id,
            signal_type="ATTENDANCE_DROP",
            severity=severity,
            description=f"Attendance dropped to {att_rate * 100:.1f}% in the last {ATTENDANCE_WINDOW_DAYS} days.",
        )

    # --- Grade risk check ---
    if avg_score is not None and avg_score < GRADE_DROP_THRESHOLD:
        severity = "HIGH" if avg_score < 0.25 else "MEDIUM"
        await _emit_risk_signal(
            db, student_id,
            signal_type="GRADE_DROP",
            severity=severity,
            description=f"Average score is {avg_score * 100:.1f}% across all assessments.",
        )

    # --- Recompute health score (weighted: 50% attendance, 50% grades) ---
    components = []
    if att_rate is not None:
        components.append(att_rate * 100 * 0.5)
    if avg_score is not None:
        components.append(avg_score * 100 * 0.5)
    if components:
        profile.overall_health_score = round(sum(components) / (len(components) * 0.5), 2)
        profile.overall_health_score = max(0.0, min(100.0, profile.overall_health_score))

    await db.commit()
    await db.refresh(profile)
    return profile


async def get_profile(db: AsyncSession, student_id: str) -> StudentLearningProfile:
    return await _get_or_create_profile(db, student_id)


async def get_risk_signals(
    db: AsyncSession,
    student_id: str,
    include_resolved: bool = False,
) -> List[RiskSignal]:
    query = select(RiskSignal).where(RiskSignal.student_id == student_id)
    if not include_resolved:
        query = query.where(RiskSignal.is_resolved == False)  # noqa: E712
    result = await db.execute(query.order_by(RiskSignal.created_at.desc()))
    return result.scalars().all()


async def resolve_risk_signal(
    db: AsyncSession, signal_id: int, resolve_data: RiskSignalResolve
) -> RiskSignal:
    result = await db.execute(select(RiskSignal).where(RiskSignal.id == signal_id))
    signal = result.scalars().first()
    if not signal:
        raise HTTPException(status_code=404, detail="Risk signal not found")
    signal.is_resolved = resolve_data.is_resolved
    await db.commit()
    await db.refresh(signal)
    return signal


async def get_student_dashboard(db: AsyncSession, student_id: str):
    """Aggregate: profile + active signals + attendance rate + average score."""
    from app.schemas.intelligence import StudentDashboard

    profile = await get_profile(db, student_id)
    active_signals = await get_risk_signals(db, student_id, include_resolved=False)
    att_rate = await _attendance_rate(db, student_id)
    avg_score = await _average_score_pct(db, student_id)

    return StudentDashboard(
        profile=profile,
        active_risk_signals=active_signals,
        attendance_rate=round(att_rate * 100, 2) if att_rate is not None else None,
        average_score=round(avg_score * 100, 2) if avg_score is not None else None,
    )
