from backend.app.schemas.complaint import (
    ClassificationResult,
    Complaint,
    TriageResult,
)


def triage_complaint(
    complaint: Complaint,
    classification: ClassificationResult,
) -> TriageResult:
    """
    Combine the existing complaint data with the AI classification.
    """

    return TriageResult(
        category=classification.category,
        priority=complaint.priority,
        assigned_team="general",
        reasoning=classification.reasoning,
        confidence=classification.confidence,
    )