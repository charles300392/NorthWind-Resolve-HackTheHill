def calculate_sla_risk(
    historical_breach_rate: float,
    complaint_age_days: float,
    transfer_risk: float = 0.0,
) -> float:

    risk = (
        0.5 * historical_breach_rate
        + 0.3 * min(complaint_age_days / 30, 1.0)
        + 0.2 * transfer_risk
    )

    return round(min(max(risk, 0.0), 1.0), 2)