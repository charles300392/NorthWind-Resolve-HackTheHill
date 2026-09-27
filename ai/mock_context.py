def get_mock_context():
    """
    Temporary mock context used while the Data Layer
    is not yet integrated.

    This data is synthetic and must NOT be treated
    as real Northwind data.
    """

    return {
        "region": "Barrowdale",

        "historical_breach_rate": 0.816,

        "estimated_read_rate": 0.641,

        "smart_meter_penetration": 0.0,

        "billing_exception_rate": 0.12,

        "complaint_history": [],

        "transfer_history": False,

        "complaint_age_days": 12,

        "transfer_risk": 0.0,
    }