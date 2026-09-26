from ai.risk_engine import calculate_sla_risk


def test_sla_risk_is_between_zero_and_one():

    risk = calculate_sla_risk(
        historical_breach_rate=0.80,
        complaint_age_days=20,
        transfer_risk=0.70,
    )

    assert 0 <= risk <= 1