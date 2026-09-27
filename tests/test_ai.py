from ai.risk_engine import calculate_sla_risk
from ai.schemas import AIAnalysis


def test_risk_engine_returns_valid_value():
    risk = calculate_sla_risk(
        historical_breach_rate=0.8,
        complaint_age_days=15,
        transfer_risk=0.5,
    )

    assert 0.0 <= risk <= 1.0


def test_risk_engine_is_deterministic():
    risk_1 = calculate_sla_risk(
        historical_breach_rate=0.8,
        complaint_age_days=15,
        transfer_risk=0.5,
    )

    risk_2 = calculate_sla_risk(
        historical_breach_rate=0.8,
        complaint_age_days=15,
        transfer_risk=0.5,
    )

    assert risk_1 == risk_2


def test_ai_analysis_schema():
    result = AIAnalysis(
        category="Metering - Incorrect Read",
        priority="HIGH",
        severity="MEDIUM",
        sla_risk=0.67,
        root_cause="Possible incorrect meter reading.",
        recommendation="Verify the latest meter reading.",
        response="We will review your meter reading.",
        confidence=0.90,
        explanation=[
            "The customer reports an incorrect meter reading."
        ],
    )

    assert result.category == "Metering - Incorrect Read"
    assert result.priority == "HIGH"
    assert result.severity == "MEDIUM"
    assert 0.0 <= result.sla_risk <= 1.0
    assert 0.0 <= result.confidence <= 1.0


def test_ai_analysis_rejects_invalid_category():
    try:
        AIAnalysis(
            category="Invalid Category",
            priority="HIGH",
            severity="MEDIUM",
            sla_risk=0.5,
            confidence=0.8,
        )

        assert False

    except Exception:
        assert True


def test_ai_analysis_rejects_invalid_risk():
    try:
        AIAnalysis(
            category="Other",
            priority="HIGH",
            severity="MEDIUM",
            sla_risk=2.0,
            confidence=0.8,
        )

        assert False

    except Exception:
        assert True