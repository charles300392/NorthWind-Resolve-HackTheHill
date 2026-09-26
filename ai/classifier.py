import json

from .llm_client import call_llm
from .prompts import SYSTEM_PROMPT
from .schemas import AIAnalysis


def classify_complaint(
    complaint_text: str,
    context: dict | None = None
) -> AIAnalysis:

    user_prompt = f"""
Analyze this Northwind customer complaint.

Complaint:
{complaint_text}

Context:
{json.dumps(context or {}, indent=2)}

You MUST select exactly one category from this list:

- Billing - Disputed Amount
- Billing - Estimated Read
- Metering - No Read
- Metering - Incorrect Read
- Payment - Plan/Arrears
- Service - Poor Communication
- Supply - Interruption
- Water - Pressure/Quality
- Other

Do not create or invent another category.

Do not calculate SLA risk.
The risk engine will calculate the final SLA risk.

Return ONLY valid JSON with this structure:

{{
  "category": "ONE CATEGORY FROM THE LIST ABOVE",
  "priority": "LOW | MEDIUM | HIGH | CRITICAL",
  "severity": "LOW | MEDIUM | HIGH | CRITICAL",
  "sla_risk": 0.0,
  "root_cause": "...",
  "recommendation": "...",
  "response": "...",
  "confidence": 0.0,
  "explanation": []
}}
"""

    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT,
        },
        {
            "role": "user",
            "content": user_prompt,
        },
    ]

    raw = call_llm(messages)

    data = json.loads(raw)

    return AIAnalysis.model_validate(data)