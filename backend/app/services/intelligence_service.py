from typing import List, Dict, Any
from app.models.intelligence import StudentLearningProfile, RiskSignal

class IntelligenceService:
    @staticmethod
    def calculate_concept_mastery(scores: List[float]) -> float:
        """
        Calculates mastery based on recent scores, giving more weight to recent assessments.
        """
        if not scores:
            return 0.0
        # Simple weighted average for demo purposes
        weights = [i + 1 for i in range(len(scores))]
        weighted_sum = sum(s * w for s, w in zip(scores, weights))
        return weighted_sum / sum(weights)

    @staticmethod
    def analyze_risk_signals(student_id: int, attendance_rate: float, recent_scores: List[float]) -> List[RiskSignal]:
        signals = []
        if attendance_rate < 0.75:
            signals.append(RiskSignal(
                student_id=student_id,
                signal_type="ATTENDANCE_DROP",
                severity="HIGH",
                description="Attendance has dropped below 75% in the last month."
            ))
        if recent_scores and sum(recent_scores[-3:]) / 3 < 40:
            signals.append(RiskSignal(
                student_id=student_id,
                signal_type="GRADE_DROP",
                severity="MEDIUM",
                description="Average score in last 3 assessments is below 40%."
            ))
        return signals

intelligence_service = IntelligenceService()
