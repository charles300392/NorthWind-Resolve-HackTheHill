from fastapi import APIRouter

from data.analysis import run_full_analysis


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


@router.get("/overview")
def overview():
    analysis = run_full_analysis()

    return analysis["overall"]


@router.get("/regions")
def regions():
    analysis = run_full_analysis()

    return analysis["by_region"]


@router.get("/categories")
def categories():
    analysis = run_full_analysis()

    return analysis["by_category"]


@router.get("/priorities")
def priorities():
    analysis = run_full_analysis()

    return analysis["by_priority"]


@router.get("/channels")
def channels():
    analysis = run_full_analysis()

    return analysis["by_channel"]


@router.get("/systems")
def systems():
    analysis = run_full_analysis()

    return analysis["by_source_system"]


@router.get("/monthly")
def monthly():
    analysis = run_full_analysis()

    return analysis["monthly"]


@router.get("/meter-reads")
def meter_reads():
    analysis = run_full_analysis()

    return analysis["meter_reads"]


@router.get("/staffing")
def staffing():
    analysis = run_full_analysis()

    return analysis["staffing"]


@router.get("/ai-pilot")
def ai_pilot():
    analysis = run_full_analysis()

    return analysis["ai_pilot"]


@router.get("/unit-costs")
def unit_costs():
    analysis = run_full_analysis()

    return analysis["unit_costs"]