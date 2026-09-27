from __future__ import annotations

import json
import math
from datetime import datetime, timezone
from typing import Any

import pandas as pd
from fastapi import APIRouter, HTTPException, Query

from ai.service import analyze_complaint
from data.context_builder import build_context
from data.data_loader import load_complaints

from backend.app.schemas.complaints import (
    ComplaintRequest,
    ComplaintResponse,
    NewComplaintRequest,
)

from backend.app.services.complaint_store import (
    append_complaint,
    find_complaint,
    load_new_complaints,
)

from backend.app.services.triage import (
    calculate_triage_score,
    local_operational_signals,
    priority_to_legacy_code,
    priority_to_queue,
)


router = APIRouter(
    prefix="/complaints",
    tags=["Complaints"],
)


# ============================================================
# JSON SAFETY
# ============================================================

def _json_safe(value: Any) -> Any:
    """
    Convert pandas / NumPy values into JSON-safe Python values.

    Important:
    JSON does not support NaN, Infinity or -Infinity.
    Missing numeric values are therefore converted to None.
    """

    if isinstance(value, dict):
        return {
            str(key): _json_safe(item)
            for key, item in value.items()
        }

    if isinstance(value, list):
        return [
            _json_safe(item)
            for item in value
        ]

    if isinstance(value, tuple):
        return [
            _json_safe(item)
            for item in value
        ]

    # Handle pandas / NumPy scalar values.
    if hasattr(value, "item") and not isinstance(
        value,
        (str, bytes, bytearray),
    ):
        try:
            value = value.item()
        except (ValueError, TypeError):
            pass

    # Handle floating-point NaN / Infinity.
    if isinstance(value, float):
        if not math.isfinite(value):
            return None

        return value

    # Handle pandas missing values such as pd.NA / NaT.
    try:
        missing = pd.isna(value)

        if isinstance(missing, bool) and missing:
            return None

    except (TypeError, ValueError):
        pass

    return value


# ============================================================
# ALL COMPLAINTS
# ============================================================

def _all_complaints():
    base = load_complaints().copy()

    new = load_new_complaints()

    if not new:
        return base

    new_df_records = []

    for record in new:
        new_df_records.append(
            {
                "complaint_id": record["complaint_id"],
                "date_opened": record["date_opened"],
                "date_closed": None,
                "status": record["status"],
                "channel": record["channel"],
                "category": record["category"],
                "priority": record["priority"],
                "region": record["region"],
                "source_system": "NORTHWIND-RESOLVE",
                "transferred_between_systems": 0,
                "sla_days": record["sla_days"],
                "days_to_close": None,
                "sla_breach": 0,
                "reopened": 0,
                "resolution_action": None,
                "resolvable_by_information_only": None,
                "bill_correction_value": None,
                "account_id": record["account_id"],
            }
        )

    return pd.concat(
        [
            base,
            pd.DataFrame(new_df_records),
        ],
        ignore_index=True,
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
    Analyze user-supplied complaint text with the AI triage engine.
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
# CREATE NEW COMPLAINT + AUTOMATIC TRIAGE
# ============================================================

@router.post(
    "",
    status_code=201,
)
def create_complaint(
    request: NewComplaintRequest,
):
    """
    Create a new complaint locally, automatically triage it
    with AI, calculate local operational risk, and store the
    draft response.

    The challenge CSVs are never modified and are never sent
    to the LLM.
    """

    now = (
        datetime
        .now(timezone.utc)
        .date()
        .isoformat()
    )

    existing = _all_complaints()

    new_count = (
        len(load_new_complaints()) + 1
    )

    complaint_id = (
        f"NW-NEW-{new_count:04d}"
    )

    account_id = (
        request.account_id
        or f"NEW-ACC-{new_count:05d}"
    )

    # Gemini receives only the newly submitted complaint text.
    ai_result = analyze_complaint(
        complaint_text=request.complaint_text,
        context={},
    )

    signals = local_operational_signals(
        region=request.region,
        category=ai_result.category,
    )

    # New complaints have age 0 and no transfer history yet.
    historical_breach = (
        signals["historical_breach_rate"]
    )

    local_sla_risk = round(
        min(
            max(
                0.5 * historical_breach,
                0.0,
            ),
            1.0,
        ),
        2,
    )

    triage_score = calculate_triage_score(
        priority=ai_result.priority,
        severity=ai_result.severity,
        historical_breach_rate=historical_breach,
    )

    priority_code = (
        priority_to_legacy_code(
            ai_result.priority
        )
    )

    record = {
        "complaint_id": complaint_id,
        "account_id": account_id,
        "complaint_text": request.complaint_text,
        "date_opened": now,
        "status": "Open",
        "channel": request.channel,
        "category": ai_result.category,
        "priority": priority_code,
        "triage_priority": ai_result.priority,
        "severity": ai_result.severity,
        "triage_score": triage_score,
        "queue": priority_to_queue(
            ai_result.priority
        ),
        "sla_risk": local_sla_risk,
        "sla_days": signals[
            "recommended_sla_days"
        ],
        "region": request.region,
        "source_system": "NORTHWIND-RESOLVE",
        "transferred_between_systems": 0,
        "sla_breach": 0,
        "reopened": 0,
        "historical_breach_rate": historical_breach,
        "category_volume_share": signals[
            "category_volume_share"
        ],
        "root_cause": ai_result.root_cause,
        "recommendation": ai_result.recommendation,
        "response": ai_result.response,
        "confidence": ai_result.confidence,
        "explanation": ai_result.explanation,
    }

    append_complaint(record)

    return _json_safe(record)


# ============================================================
# COMPLAINT LIST
# ============================================================

@router.get("")
def list_complaints(
    limit: int = Query(
        default=50,
        ge=1,
        le=200,
    ),
    offset: int = Query(
        default=0,
        ge=0,
    ),
    region: str | None = Query(
        default=None,
    ),
    category: str | None = Query(
        default=None,
    ),
    priority: str | None = Query(
        default=None,
    ),
    status: str | None = Query(
        default=None,
    ),
    search: str | None = Query(
        default=None,
    ),
):
    complaints = _all_complaints()

    if region:
        complaints = complaints[
            complaints["region"]
            .astype(str)
            .str.lower()
            == region.lower()
        ]

    if category:
        complaints = complaints[
            complaints["category"]
            .astype(str)
            .str.lower()
            == category.lower()
        ]

    if priority:
        complaints = complaints[
            complaints["priority"]
            .astype(str)
            .str.lower()
            == priority.lower()
        ]

    if status:
        complaints = complaints[
            complaints["status"]
            .astype(str)
            .str.lower()
            == status.lower()
        ]

    if search and search.strip():
        q = search.strip().lower()

        complaints = complaints[
            complaints.apply(
                lambda row: any(
                    q in str(
                        row.get(
                            column,
                            "",
                        )
                    ).lower()
                    for column in [
                        "complaint_id",
                        "account_id",
                        "category",
                        "region",
                        "status",
                    ]
                ),
                axis=1,
            )
        ]

    # New complaints are placed first,
    # then the existing reporting dataset.
    complaints = complaints.copy()

    complaints["_new_first"] = (
        complaints["complaint_id"]
        .astype(str)
        .str.startswith("NW-NEW-")
    )

    complaints = (
        complaints
        .sort_values(
            by=[
                "_new_first",
                "date_opened",
            ],
            ascending=[
                False,
                False,
            ],
        )
        .drop(
            columns=["_new_first"]
        )
    )

    total = len(complaints)

    page = complaints.iloc[
        offset:
        offset + limit
    ]

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

@router.get(
    "/{complaint_id}"
)
def get_complaint(
    complaint_id: str,
):
    new_record = find_complaint(
        complaint_id
    )

    if new_record:
        return _json_safe(
            {
                **new_record,
                "date_closed": None,
                "days_to_close": None,
                "resolution_action": None,
                "resolvable_by_information_only": None,
                "bill_correction_value": None,
            }
        )

    complaints = load_complaints()

    result = complaints[
        complaints["complaint_id"]
        .astype(str)
        == complaint_id
    ]

    if result.empty:
        raise HTTPException(
            status_code=404,
            detail=(
                f"Complaint "
                f"'{complaint_id}' "
                f"not found"
            ),
        )

    record = json.loads(
        result.iloc[[0]].to_json(
            orient="records",
            date_format="iso",
        )
    )[0]

    return _json_safe(record)


# ============================================================
# LOCAL COMPLAINT CONTEXT
# ============================================================

@router.get(
    "/{complaint_id}/context"
)
def get_complaint_context(
    complaint_id: str,
):
    new_record = find_complaint(
        complaint_id
    )

    if new_record:
        context = {
            "complaint": new_record,
            "region": new_record["region"],
            "month": new_record["date_opened"][:7],
            "historical_breach_rate": new_record[
                "historical_breach_rate"
            ],
            "category_volume_share": new_record[
                "category_volume_share"
            ],
            "triage_priority": new_record[
                "triage_priority"
            ],
            "triage_score": new_record[
                "triage_score"
            ],
            "queue": new_record["queue"],
            "sla_risk": new_record["sla_risk"],
            "root_cause": new_record[
                "root_cause"
            ],
            "recommendation": new_record[
                "recommendation"
            ],
            "response": new_record[
                "response"
            ],
            "confidence": new_record[
                "confidence"
            ],
            "explanation": new_record[
                "explanation"
            ],
        }

        return _json_safe(context)

    try:
        context = build_context(
            complaint_id
        )

        return _json_safe(context)

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )

    except KeyError as exc:
        raise HTTPException(
            status_code=404,
            detail=(
                f"Could not build context "
                f"for complaint "
                f"'{complaint_id}': {exc}"
            ),
        )