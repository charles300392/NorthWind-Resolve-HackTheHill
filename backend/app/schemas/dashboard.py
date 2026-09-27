from pydantic import BaseModel


class DashboardMetrics(BaseModel):
    open_complaints: int
    average_resolution_days: float
    previous_resolution_days: float
    sla_breach_risk: float
    regulator_score: float
    regulator_target: float
    first_contact_resolution_rate: float
    inbound_calls: int
    cost_to_serve_per_account: float


class MonthlyMetric(BaseModel):
    month: str
    complaints_opened: int
    complaints_closed: int
    resolution_days: float
    first_contact_resolution_rate: float
    inbound_calls: int
    cost_to_serve_per_account: float
    regulator_score: float


class MonthlyMetricsResponse(BaseModel):
    items: list[MonthlyMetric]