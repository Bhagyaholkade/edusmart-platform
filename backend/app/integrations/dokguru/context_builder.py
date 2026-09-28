"""
dokguru/context_builder.py
--------------------------
Builds sanitised, PII-free context strings before any data is sent to
the external DokGuru AI engine.  Complies with India's DPDP Act 2023
by ensuring no student names, phone numbers or emails leave the system.
"""

import re
from typing import Optional


# ---------------------------------------------------------------------------
# Regex-based PII scrubbers (lightweight, no NLP dependency required)
# ---------------------------------------------------------------------------

_EMAIL_RE = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")
_PHONE_RE = re.compile(r"(\+91[-\s]?)?[6-9]\d{9}")
_NAME_PLACEHOLDER = "[STUDENT]"


class SafeContextBuilder:
    """Builds anonymised context strings safe to send to external AI services."""

    # ------------------------------------------------------------------
    # PII sanitisation
    # ------------------------------------------------------------------

    @staticmethod
    def sanitize_pii(text: str) -> str:
        """Remove emails and Indian mobile numbers from free-form text."""
        text = _EMAIL_RE.sub("[EMAIL]", text)
        text = _PHONE_RE.sub("[PHONE]", text)
        return text

    # ------------------------------------------------------------------
    # AI Tutor context
    # ------------------------------------------------------------------

    @staticmethod
    def build_student_context(
        learning_profile: dict,
        subject: Optional[str] = None,
        attendance_rate: Optional[float] = None,
    ) -> str:
        """
        Build an anonymised academic context for the AI tutor.

        Args:
            learning_profile: dict with keys 'strengths', 'weaknesses', 'overall_health_score'
            subject: optional subject the student is asking about
            attendance_rate: 0-100 float representing recent attendance percentage
        """
        strengths = ", ".join(learning_profile.get("strengths") or []) or "not yet identified"
        weaknesses = ", ".join(learning_profile.get("weaknesses") or []) or "not yet identified"
        health = learning_profile.get("overall_health_score", 50.0)

        lines = [
            f"Student academic health score: {health:.1f}/100.",
            f"Strong areas: {strengths}.",
            f"Areas needing improvement: {weaknesses}.",
        ]
        if subject:
            lines.append(f"The student is currently asking about: {subject}.")
        if attendance_rate is not None:
            lines.append(f"Recent attendance rate: {attendance_rate:.1f}%.")
        lines.append(
            "Adapt your explanation to build on the student's strengths "
            "and address their identified weaknesses with simple analogies."
        )
        return SafeContextBuilder.sanitize_pii(" ".join(lines))

    # ------------------------------------------------------------------
    # Teacher Copilot context
    # ------------------------------------------------------------------

    @staticmethod
    def build_class_context(
        subject: str,
        grade_level: str,
        class_avg_score: Optional[float] = None,
        pass_rate: Optional[float] = None,
        common_weaknesses: Optional[list[str]] = None,
    ) -> str:
        """
        Build context describing a class's performance for Teacher Copilot.

        Args:
            subject: subject name
            grade_level: e.g. "10"
            class_avg_score: 0-100 average score percentage
            pass_rate: 0-100 pass rate percentage
            common_weaknesses: list of topic areas where the class struggles
        """
        lines = [
            f"Subject: {subject}, Grade: {grade_level}.",
        ]
        if class_avg_score is not None:
            lines.append(f"Class average score: {class_avg_score:.1f}%.")
        if pass_rate is not None:
            lines.append(f"Pass rate: {pass_rate:.1f}%.")
        if common_weaknesses:
            lines.append(
                f"Common areas of difficulty: {', '.join(common_weaknesses)}."
            )
        return " ".join(lines)
