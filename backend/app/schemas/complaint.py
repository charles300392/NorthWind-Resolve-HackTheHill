from typing import Optional

from pydantic import BaseModel


class Complaint(BaseModel):
    complaint_id: str
    date_opened: str
    date_closed: Optional[str] = None
    status: str
    channel: str
    category: str
    priority: str
    region: str
    source_system: str
    transferred_between_systems: int
    sla_days: int
    days_to_close: Optional[int] = None
    sla_breach: int
    reopened: int
    resolution_action: Optional[str] = None
    resolvable_by_information_only: Optional[int] = None
    bill_correction_value: Optional[float] = None
    account_id: str


class ClassificationResult(BaseModel):
    category: str
    confidence: float
    reasoning: str


class TriageResult(BaseModel):
    category: str
    priority: str
    assigned_team: str
    reasoning: str
    confidence: float


class ComplaintListResponse(BaseModel):
    page: int
    page_size: int
    total: int
    items: list[Complaint]