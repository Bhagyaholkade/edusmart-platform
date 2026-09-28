"""
dokguru/client.py
-----------------
Async HTTP client for the DokGuru AI engine.
Falls back to a graceful simulated response when the engine is unavailable
so the rest of the platform keeps running during development.
"""

from typing import Optional
import httpx
from app.core.config import settings


class DokGuruClient:
    """Singleton-friendly async HTTP wrapper for the DokGuru AI service."""

    def __init__(self):
        self.base_url = settings.DOKGURU_URL
        self._client: Optional[httpx.AsyncClient] = None

    @property
    def client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(timeout=45.0)
        return self._client

    # ------------------------------------------------------------------
    # Core ask method (AI Tutor / generic Q&A)
    # ------------------------------------------------------------------

    async def ask(self, context: str, question: str) -> str:
        """Send a question with contextual data; returns the AI answer string."""
        try:
            response = await self.client.post(
                f"{self.base_url}/api/v1/ask",
                json={"context": context, "question": question},
            )
            response.raise_for_status()
            return response.json().get("answer", "No answer returned.")
        except Exception as exc:
            print(f"[DokGuru] ask error: {exc}")
            return (
                "The AI engine is currently unavailable. "
                "Please try again later or contact support."
            )

    # ------------------------------------------------------------------
    # Teacher Copilot – lesson plan generation
    # ------------------------------------------------------------------

    async def generate_lesson_plan(
        self,
        subject: str,
        topic: str,
        grade_level: str,
        duration_minutes: int,
        learning_objectives: list[str],
    ) -> str:
        """Ask DokGuru to draft a structured lesson plan."""
        prompt = (
            f"Create a detailed {duration_minutes}-minute lesson plan for grade {grade_level} "
            f"on the topic '{topic}' in {subject}. "
            f"Learning objectives: {'; '.join(learning_objectives)}. "
            "Include: Introduction, Main Activities, Assessment, and Homework."
        )
        try:
            response = await self.client.post(
                f"{self.base_url}/api/v1/generate",
                json={"type": "lesson_plan", "prompt": prompt},
            )
            response.raise_for_status()
            return response.json().get("content", prompt)
        except Exception as exc:
            print(f"[DokGuru] lesson_plan error: {exc}")
            # Return a structured fallback so UI is never empty
            return (
                f"**Lesson Plan: {topic} ({subject} – Grade {grade_level})**\n\n"
                f"*Duration:* {duration_minutes} minutes\n\n"
                "**Learning Objectives:**\n"
                + "\n".join(f"- {o}" for o in learning_objectives)
                + "\n\n**Introduction (10 min):** Warm-up and recap.\n"
                "**Main Activity (30 min):** Core concept explanation with examples.\n"
                "**Assessment (10 min):** Quick quiz / think-pair-share.\n"
                "**Homework:** Practice problems from the textbook.\n\n"
                "*(Generated offline – DokGuru engine unavailable)*"
            )

    # ------------------------------------------------------------------
    # Teacher Copilot – student feedback generation
    # ------------------------------------------------------------------

    async def generate_student_feedback(
        self,
        student_name_anon: str,
        subject: str,
        score_pct: float,
        strengths: list[str],
        weaknesses: list[str],
    ) -> str:
        """Ask DokGuru to draft personalised feedback for a student's result."""
        prompt = (
            f"Write constructive, encouraging feedback for a student (anonymised as '{student_name_anon}') "
            f"who scored {score_pct:.1f}% in {subject}. "
            f"Their strengths are: {', '.join(strengths) or 'N/A'}. "
            f"Their areas for improvement are: {', '.join(weaknesses) or 'N/A'}. "
            "Keep the tone positive and actionable (3-4 sentences)."
        )
        try:
            response = await self.client.post(
                f"{self.base_url}/api/v1/generate",
                json={"type": "feedback", "prompt": prompt},
            )
            response.raise_for_status()
            return response.json().get("content", "")
        except Exception as exc:
            print(f"[DokGuru] feedback error: {exc}")
            return (
                f"Great effort! You achieved {score_pct:.1f}% in {subject}. "
                f"Keep building on your strengths and focus on improving in "
                f"{', '.join(weaknesses[:2]) if weaknesses else 'the identified areas'}. "
                "Keep it up!"
            )

    async def close(self):
        if self._client and not self._client.is_closed:
            await self._client.aclose()


# Module-level singleton
dokguru_client = DokGuruClient()
