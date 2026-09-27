from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.routes.analytics import (
    router as analytics_router,
    dashboard_router,
)

from backend.app.api.routes.complaints import (
    router as complaints_router,
)

from backend.app.api.routes.customers import (
    router as customers_router,
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


app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",

        "http://localhost:3000",
        "http://127.0.0.1:3000",

        "http://localhost:5500",
        "http://127.0.0.1:5500",
    ],

    allow_credentials=True,

    allow_methods=[
        "*",
    ],

    allow_headers=[
        "*",
    ],
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


app.include_router(
    dashboard_router,
    prefix="/api",
)


app.include_router(
    customers_router,
    prefix="/api",
)