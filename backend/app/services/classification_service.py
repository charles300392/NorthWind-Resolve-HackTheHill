from backend.app.schemas.complaint import Complaint


def classify_complaint(complaint: Complaint) -> dict:
    """
    Temporary local classification.

    This function is the integration point for the AI model.
    The Gemini/LiteLLM implementation will be plugged in here.
    """

    return {
        "category": complaint.category,
        "confidence": 1.0,
        "reasoning": "Temporary classification using the existing Northwind category.",
    }