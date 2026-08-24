class SafeContextBuilder:
    @staticmethod
    def sanitize_pii(text: str) -> str:
        """
        Sanitize PII to comply with DPDP guidelines before sending to external AI.
        (E.g., remove names, phone numbers, email addresses).
        This is a basic implementation for demonstration.
        """
        # In a real scenario, use NLP or regex to remove sensitive data
        return text

    @staticmethod
    def build_student_context(student_data: dict, learning_profile: dict) -> str:
        """
        Builds a safe, anonymized context for the AI tutor.
        """
        strengths = ", ".join(learning_profile.get("strengths", []))
        weaknesses = ", ".join(learning_profile.get("weaknesses", []))
        
        context = f"The student is strong in {strengths} but struggles with {weaknesses}. " \
                  f"Please explain concepts using analogies related to their strengths."
        
        return SafeContextBuilder.sanitize_pii(context)
