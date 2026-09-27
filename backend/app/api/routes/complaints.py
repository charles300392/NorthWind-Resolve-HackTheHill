from fastapi import APIRouter

from ai.service import analyze_complaint

from backend.app.schemas.complaints import (
    ComplaintRequest,
    ComplaintResponse,
)


router = APIRouter(
    prefix="/complaints",
    tags=["Complaints"],
)


@router.post(
    "/analyze",
    response_model=ComplaintResponse,
)
def analyze(request: ComplaintRequest):

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