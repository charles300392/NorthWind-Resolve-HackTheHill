from .classifier import classify_complaint
from .risk_engine import calculate_sla_risk


def analyze_complaint(
    complaint_text: str,
    context: dict | None = None,
):
    context = context or {}

    # Step 1: AI analysis
    result = classify_complaint(
        complaint_text,
        context,
    )

    # Step 2: Get deterministic risk inputs
    historical_breach = context.get(
        "historical_breach_rate",
        0.0,
    )

    complaint_age = context.get(
        "complaint_age_days",
        0.0,
    )

    transfer_risk = context.get(
        "transfer_risk",
        0.0,
    )

    # Step 3: Calculate SLA risk using the deterministic engine
    result.sla_risk = calculate_sla_risk(
        historical_breach_rate=historical_breach,
        complaint_age_days=complaint_age,
        transfer_risk=transfer_risk,
    )

    return result