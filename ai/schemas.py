from typing import Literal, Optional

from pydantic import BaseModel, Field


Category = Literal[
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

Priority = Literal[
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL",
]

Severity = Literal[
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL",
]


class ComplaintInput(BaseModel):
    complaint_text: str
    customer_context: Optional[dict] = None
    case_context: Optional[dict] = None


class AIAnalysis(BaseModel):
    category: Category

    priority: Priority

    severity: Severity

    sla_risk: float = Field(
        ge=0.0,
        le=1.0,
    )

    root_cause: Optional[str] = None

    recommendation: Optional[str] = None

    response: Optional[str] = None

    confidence: float = Field(
        ge=0.0,
        le=1.0,
    )

    explanation: list[str] = Field(
        default_factory=list
    )