from ai.mock_context import get_mock_context
from ai.service import analyze_complaint


complaint = """
My electricity bill is much higher than usual.
I believe the meter reading is incorrect.
I want someone to review and correct my bill.
"""


context = get_mock_context()


result = analyze_complaint(
    complaint_text=complaint,
    context=context,
)


print("\n=== AI ANALYSIS ===\n")

print(
    result.model_dump_json(
        indent=2
    )
)