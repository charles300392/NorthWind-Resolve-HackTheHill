from fastapi import APIRouter, HTTPException

from backend.app.schemas.dashboard import (
    DashboardMetrics,
    MonthlyMetricsResponse,
)

from backend.app.services.dashboard_service import (
    get_dashboard_metrics,
    get_monthly_metrics,
)


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "/metrics",
    response_model=DashboardMetrics,
)
def dashboard_metrics():
    metrics = get_dashboard_metrics()

    if metrics is None:
        raise HTTPException(
            status_code=404,
            detail="Dashboard metrics are not available yet",
        )

    return metrics


@router.get(
    "/monthly-metrics",
    response_model=MonthlyMetricsResponse,
)
def dashboard_monthly_metrics():
    return {
        "items": get_monthly_metrics()
    }