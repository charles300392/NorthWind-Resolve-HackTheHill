from fastapi import FastAPI

from backend.app.api.routes.analytics import (
    router as analytics_router,
)

from backend.app.api.routes.complaints import (
    router as complaints_router,
)

from backend.app.core.config import settings


app = FastAPI(
    title=settings.app_name,
    description=(
        "Northwind Resolve backend for "
        "complaint triage and operational analytics"
    ),
    version="1.0.0",
)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": settings.app_name,
    }


app.include_router(
    complaints_router,
    prefix="/api",
)


app.include_router(
    analytics_router,
    prefix="/api",
)