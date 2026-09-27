import json

from fastapi import APIRouter, HTTPException, Query

from ai.service import analyze_complaint
from data.context_builder import build_context
from data.data_loader import load_complaints

from backend.app.schemas.complaints import (
    ComplaintRequest,
    ComplaintResponse,
)


router = APIRouter(
    prefix="/complaints",
    tags=["Complaints"],
)


# ============================================================
# AI ANALYSIS
# ============================================================

@router.post(
    "/analyze",
    response_model=ComplaintResponse,
)
def analyze(request: ComplaintRequest):
    """
    Analyze a complaint supplied by the user.

    This endpoint is intended for synthetic/demo complaint text.
    Northwind CSV complaint data is not automatically sent to the LLM.
    """

    context = {}

    if request.customer_context:
        context.update(
            request.customer_context
        )

    if request.case_context:
        context.update(
            request.case_context
        )

    result = analyze_complaint(
        complaint_text=request.complaint_text,
        context=context,
    )

    return result


# ============================================================
# COMPLAINT LIST
# ============================================================

@router.get("")
def list_complaints(
    limit: int = Query(
        default=50,
        ge=1,
        le=200,
        description="Maximum number of complaints to return",
    ),
    offset: int = Query(
        default=0,
        ge=0,
        description="Number of complaints to skip",
    ),
    region: str | None = Query(
        default=None,
        description="Filter by region",
    ),
    category: str | None = Query(
        default=None,
        description="Filter by complaint category",
    ),
    priority: str | None = Query(
        default=None,
        description="Filter by priority",
    ),
    status: str | None = Query(
        default=None,
        description="Filter by complaint status",
    ),
):
    """
    Return a paginated list of Northwind complaints.

    All data remains local.
    """

    complaints = load_complaints()

    # --------------------------------------------------------
    # Filters
    # --------------------------------------------------------

    if region:
        complaints = complaints[
            complaints["region"].astype(str).str.lower()
            == region.lower()
        ]

    if category:
        complaints = complaints[
            complaints["category"].astype(str).str.lower()
            == category.lower()
        ]

    if priority:
        complaints = complaints[
            complaints["priority"].astype(str).str.lower()
            == priority.lower()
        ]

    if status:
        complaints = complaints[
            complaints["status"].astype(str).str.lower()
            == status.lower()
        ]

    # --------------------------------------------------------
    # Pagination
    # --------------------------------------------------------

    total = len(complaints)

    page = complaints.iloc[
        offset: offset + limit
    ]

    # Convert NaN values to JSON null
    records = json.loads(
        page.to_json(
            orient="records",
            date_format="iso",
        )
    )

    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "count": len(records),
        "items": records,
    }


# ============================================================
# SINGLE COMPLAINT
# ============================================================

@router.get("/{complaint_id}")
def get_complaint(
    complaint_id: str,
):
    """
    Return one Northwind complaint by complaint ID.
    """

    complaints = load_complaints()

    result = complaints[
        complaints["complaint_id"].astype(str)
        == complaint_id
    ]

    if result.empty:
        raise HTTPException(
            status_code=404,
            detail=f"Complaint '{complaint_id}' not found",
        )

    record = json.loads(
        result.iloc[[0]].to_json(
            orient="records",
            date_format="iso",
        )
    )[0]

    return record


# ============================================================
# LOCAL COMPLAINT CONTEXT
# ============================================================

@router.get("/{complaint_id}/context")
def get_complaint_context(
    complaint_id: str,
):
    """
    Build the local operational context for a complaint.

    This uses the local Northwind datasets and does not send
    the data to the LLM.
    """

    try:
        context = build_context(
            complaint_id
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )

    except KeyError as exc:
        raise HTTPException(
            status_code=404,
            detail=(
                f"Could not build context for "
                f"complaint '{complaint_id}': {exc}"
            ),
        )

    return context