import json

from .llm_client import call_llm
from .prompts import SYSTEM_PROMPT
from .schemas import AIAnalysis


ALLOWED_CATEGORIES = [
    "Billing - Disputed Amount",
    "Billing - Estimated Read",
    "Metering - No Read",
    "Metering - Incorrect Read",
    "Payment - Plan/Arrears",
    "Service - Poor Communication",
    "Supply - Interruption",
    "Water - Pressure/Quality",
    "Other",
]


def classify_complaint(
    complaint_text: str,
    context: dict | None = None,
) -> AIAnalysis:

    user_prompt = f"""
Analyze this Northwind customer complaint.

Complaint:
{complaint_text}

Operational Context:
{json.dumps(context or {}, indent=2)}

You MUST select exactly one category from this list:

{json.dumps(ALLOWED_CATEGORIES, indent=2)}

Do not create or invent another category.

Use the operational context as evidence when relevant.

Do not calculate SLA risk.

The risk engine will calculate the final SLA risk.

Set "sla_risk" to 0.0.

Return ONLY valid JSON.

The JSON must have exactly this structure:

{{
  "category": "ONE CATEGORY FROM THE LIST ABOVE",
  "priority": "LOW | MEDIUM | HIGH | CRITICAL",
  "severity": "LOW | MEDIUM | HIGH | CRITICAL",
  "sla_risk": 0.0,
  "root_cause": "string or null",
  "recommendation": "string or null",
  "response": "string or null",
  "confidence": 0.0,
  "explanation": [
    "evidence-based reason 1",
    "evidence-based reason 2"
  ]
}}

Important:

- Do not invent customer information.
- Do not invent operational information.
- Do not claim an action has already been completed.
- Use the provided context as evidence.
- If evidence is insufficient, explicitly state that.
- Do not mention numerical SLA risk in the explanation.
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

    # Remove accidental markdown code fences if Gemini returns them.
    raw = raw.strip()

    if raw.startswith("```"):
        raw = raw.replace("```json", "")
        raw = raw.replace("```", "")
        raw = raw.strip()

    data = json.loads(raw)

    return AIAnalysis.model_validate(data)