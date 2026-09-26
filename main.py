from ai.service import analyze_complaint


complaint = """
My electricity bill is much higher than usual.
I believe the meter reading is incorrect.
I want someone to review and correct my bill.
"""


context = {
    "region": "Barrowdale",
    "historical_breach_rate": 0.816,
    "complaint_age_days": 12,
    "transfer_risk": 0.7,
}


result = analyze_complaint(
    complaint,
    context,
)


print(result.model_dump_json(indent=2))