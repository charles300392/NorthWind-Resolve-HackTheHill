from typing import Optional

from pydantic import BaseModel, Field


class ComplaintRequest(BaseModel):
    complaint_text: str = Field(
        min_length=1,
        description="Customer complaint text",
    )

    customer_context: Optional[dict] = None

    case_context: Optional[dict] = None


class ComplaintResponse(BaseModel):
    category: str

    priority: str

    severity: str

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
        default_factory=list,
    )