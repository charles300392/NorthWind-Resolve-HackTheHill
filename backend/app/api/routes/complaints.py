from fastapi import APIRouter, HTTPException, Query

from backend.app.schemas.complaint import (
    ClassificationResult,
    Complaint,
    ComplaintListResponse,
    TriageResult,
)

from backend.app.services.classification_service import (
    classify_complaint,
)

from backend.app.services.complaint_service import (
    get_complaint,
    get_complaints,
)

from backend.app.services.triage_service import (
    triage_complaint,
)


router = APIRouter(
    prefix="/complaints",
    tags=["Complaints"],
)


@router.get(
    "/",
    response_model=ComplaintListResponse,
)
def list_complaints(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
):
    return get_complaints(
        page=page,
        page_size=page_size,
    )


@router.get(
    "/{complaint_id}",
    response_model=Complaint,
)
def get_complaint_endpoint(complaint_id: str):
    complaint = get_complaint(complaint_id)

    if complaint is None:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found",
        )

    return complaint

@router.post(
    "/{complaint_id}/triage",
    response_model=TriageResult,
)

@router.post(
    "/{complaint_id}/triage",
    response_model=TriageResult,
)
def triage_complaint_endpoint(complaint_id: str):
    complaint_data = get_complaint(complaint_id)

    if complaint_data is None:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found",
        )

    complaint = Complaint(**complaint_data)

    classification_data = classify_complaint(complaint)

    classification = ClassificationResult(
        **classification_data
    )

    return triage_complaint(
        complaint,
        classification,
    )