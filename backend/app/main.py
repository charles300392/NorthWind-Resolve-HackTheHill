from fastapi import FastAPI

from backend.app.api.routes.complaints import router as complaints_router
from backend.app.api.routes.dashboard import router as dashboard_router
from backend.app.core.config import settings


app = FastAPI(
    title=settings.app_name,
    description="Backend for complaint triage and processing",
    version="0.1.0",
)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": settings.app_name,
    }


app.include_router(complaints_router)
app.include_router(dashboard_router)