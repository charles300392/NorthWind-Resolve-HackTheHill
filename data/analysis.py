from __future__ import annotations

from typing import Any

import pandas as pd

from .data_loader import load_all_data


def _safe_rate(numerator: float, denominator: float) -> float:
    """Return a safe ratio between 0 and 1."""
    if denominator == 0:
        return 0.0

    return round(float(numerator) / float(denominator), 4)


def _clean_data(datasets: dict[str, pd.DataFrame]) -> dict[str, pd.DataFrame]:
    """
    Normalize important data types locally.

    No external service or AI model is called here.
    """
    complaints = datasets["complaints"].copy()
    monthly_kpis = datasets["monthly_kpis"].copy()
    meter_reads = datasets["meter_reads"].copy()
    staffing = datasets["staffing"].copy()
    systems = datasets["systems"].copy()
    ai_pilot = datasets["ai_pilot"].copy()
    unit_costs = datasets["unit_costs"].copy()

    # Complaints
    complaints["date_opened"] = pd.to_datetime(
        complaints["date_opened"],
        errors="coerce",
    )

    complaints["date_closed"] = pd.to_datetime(
        complaints["date_closed"],
        errors="coerce",
    )

    numeric_complaint_columns = [
        "transferred_between_systems",
        "sla_days",
        "days_to_close",
        "sla_breach",
        "reopened",
        "resolvable_by_information_only",
        "bill_correction_value",
    ]

    for column in numeric_complaint_columns:
        if column in complaints.columns:
            complaints[column] = pd.to_numeric(
                complaints[column],
                errors="coerce",
            )

    # Monthly KPI
    if "month" in monthly_kpis.columns:
        monthly_kpis["month"] = monthly_kpis["month"].astype(str)

    # Meter reads
    if "month" in meter_reads.columns:
        meter_reads["month"] = meter_reads["month"].astype(str)

    # Staffing
    if "month" in staffing.columns:
        staffing["month"] = staffing["month"].astype(str)

    # AI pilot
    if "month" in ai_pilot.columns:
        ai_pilot["month"] = ai_pilot["month"].astype(str)

    # Unit costs
    if "unit_cost" in unit_costs.columns:
        unit_costs["unit_cost"] = pd.to_numeric(
            unit_costs["unit_cost"],
            errors="coerce",
        )

    # Systems
    if "year_installed" in systems.columns:
        systems["year_installed"] = pd.to_numeric(
            systems["year_installed"],
            errors="coerce",
        )

    if "annual_run_cost" in systems.columns:
        systems["annual_run_cost"] = pd.to_numeric(
            systems["annual_run_cost"],
            errors="coerce",
        )

    return {
        "complaints": complaints,
        "monthly_kpis": monthly_kpis,
        "meter_reads": meter_reads,
        "staffing": staffing,
        "systems": systems,
        "ai_pilot": ai_pilot,
        "unit_costs": unit_costs,
    }


def calculate_overall_metrics(
    complaints: pd.DataFrame,
) -> dict[str, Any]:
    """Calculate high-level complaint KPIs."""

    total_complaints = len(complaints)

    closed_complaints = int(
        (complaints["status"].astype(str).str.lower() == "closed").sum()
    )

    open_complaints = total_complaints - closed_complaints

    breach_count = int(
        complaints["sla_breach"].fillna(0).sum()
    )

    transfer_count = int(
        complaints["transferred_between_systems"].fillna(0).sum()
    )

    reopen_count = int(
        complaints["reopened"].fillna(0).sum()
    )

    info_only_count = int(
        (
            complaints["resolvable_by_information_only"]
            .fillna(0)
            == 1
        ).sum()
    )

    valid_days = complaints["days_to_close"].dropna()

    average_days_to_close = (
        round(float(valid_days.mean()), 2)
        if not valid_days.empty
        else 0.0
    )

    correction_values = complaints[
        "bill_correction_value"
    ].dropna()

    total_bill_correction_value = (
        round(float(correction_values.sum()), 2)
        if not correction_values.empty
        else 0.0
    )

    average_bill_correction_value = (
        round(float(correction_values.mean()), 2)
        if not correction_values.empty
        else 0.0
    )

    return {
        "total_complaints": total_complaints,
        "closed_complaints": closed_complaints,
        "open_complaints": open_complaints,
        "sla_breach_rate": _safe_rate(
            breach_count,
            total_complaints,
        ),
        "transfer_rate": _safe_rate(
            transfer_count,
            total_complaints,
        ),
        "reopen_rate": _safe_rate(
            reopen_count,
            total_complaints,
        ),
        "information_only_resolution_rate": _safe_rate(
            info_only_count,
            total_complaints,
        ),
        "average_days_to_close": average_days_to_close,
        "total_bill_correction_value": total_bill_correction_value,
        "average_bill_correction_value": average_bill_correction_value,
    }


def analyze_by_region(
    complaints: pd.DataFrame,
) -> list[dict[str, Any]]:
    """Calculate complaint metrics by region."""

    results = []

    for region, group in complaints.groupby(
        "region",
        dropna=False,
    ):
        total = len(group)

        results.append(
            {
                "region": str(region),
                "complaints": total,
                "sla_breach_rate": _safe_rate(
                    group["sla_breach"].fillna(0).sum(),
                    total,
                ),
                "transfer_rate": _safe_rate(
                    group["transferred_between_systems"].fillna(0).sum(),
                    total,
                ),
                "reopen_rate": _safe_rate(
                    group["reopened"].fillna(0).sum(),
                    total,
                ),
                "average_days_to_close": round(
                    float(group["days_to_close"].mean()),
                    2,
                )
                if group["days_to_close"].notna().any()
                else 0.0,
            }
        )

    return sorted(
        results,
        key=lambda x: x["complaints"],
        reverse=True,
    )


def analyze_by_category(
    complaints: pd.DataFrame,
) -> list[dict[str, Any]]:
    """Calculate complaint metrics by category."""

    results = []

    for category, group in complaints.groupby(
        "category",
        dropna=False,
    ):
        total = len(group)

        results.append(
            {
                "category": str(category),
                "complaints": total,
                "share": _safe_rate(
                    total,
                    len(complaints),
                ),
                "sla_breach_rate": _safe_rate(
                    group["sla_breach"].fillna(0).sum(),
                    total,
                ),
                "average_days_to_close": round(
                    float(group["days_to_close"].mean()),
                    2,
                )
                if group["days_to_close"].notna().any()
                else 0.0,
            }
        )

    return sorted(
        results,
        key=lambda x: x["complaints"],
        reverse=True,
    )


def analyze_by_priority(
    complaints: pd.DataFrame,
) -> list[dict[str, Any]]:
    """Calculate complaint metrics by priority."""

    results = []

    for priority, group in complaints.groupby(
        "priority",
        dropna=False,
    ):
        total = len(group)

        results.append(
            {
                "priority": str(priority),
                "complaints": total,
                "share": _safe_rate(
                    total,
                    len(complaints),
                ),
                "sla_breach_rate": _safe_rate(
                    group["sla_breach"].fillna(0).sum(),
                    total,
                ),
                "average_days_to_close": round(
                    float(group["days_to_close"].mean()),
                    2,
                )
                if group["days_to_close"].notna().any()
                else 0.0,
            }
        )

    return sorted(
        results,
        key=lambda x: x["complaints"],
        reverse=True,
    )


def analyze_by_channel(
    complaints: pd.DataFrame,
) -> list[dict[str, Any]]:
    """Calculate complaint metrics by customer channel."""

    results = []

    for channel, group in complaints.groupby(
        "channel",
        dropna=False,
    ):
        total = len(group)

        results.append(
            {
                "channel": str(channel),
                "complaints": total,
                "share": _safe_rate(
                    total,
                    len(complaints),
                ),
                "sla_breach_rate": _safe_rate(
                    group["sla_breach"].fillna(0).sum(),
                    total,
                ),
            }
        )

    return sorted(
        results,
        key=lambda x: x["complaints"],
        reverse=True,
    )


def analyze_by_source_system(
    complaints: pd.DataFrame,
    systems: pd.DataFrame,
) -> list[dict[str, Any]]:
    """
    Analyze complaints by originating system and enrich
    the result with system metadata.
    """

    complaint_summary = (
        complaints.groupby("source_system")
        .agg(
            complaints=("complaint_id", "count"),
            transfer_rate=(
                "transferred_between_systems",
                "mean",
            ),
            sla_breach_rate=(
                "sla_breach",
                "mean",
            ),
            average_days_to_close=(
                "days_to_close",
                "mean",
            ),
        )
        .reset_index()
    )

    result = complaint_summary.merge(
        systems[
            [
                "system_id",
                "system_name",
                "year_installed",
                "integration_method",
                "annual_run_cost",
            ]
        ],
        left_on="source_system",
        right_on="system_id",
        how="left",
    )

    output = []

    for _, row in result.iterrows():
        output.append(
            {
                "source_system": str(row["source_system"]),
                "system_name": (
                    None
                    if pd.isna(row["system_name"])
                    else str(row["system_name"])
                ),
                "complaints": int(row["complaints"]),
                "transfer_rate": round(
                    float(row["transfer_rate"]),
                    4,
                ),
                "sla_breach_rate": round(
                    float(row["sla_breach_rate"]),
                    4,
                ),
                "average_days_to_close": (
                    round(
                        float(row["average_days_to_close"]),
                        2,
                    )
                    if not pd.isna(
                        row["average_days_to_close"]
                    )
                    else 0.0
                ),
                "year_installed": (
                    int(row["year_installed"])
                    if not pd.isna(row["year_installed"])
                    else None
                ),
                "integration_method": (
                    None
                    if pd.isna(row["integration_method"])
                    else str(row["integration_method"])
                ),
                "annual_run_cost": (
                    float(row["annual_run_cost"])
                    if not pd.isna(row["annual_run_cost"])
                    else 0.0
                ),
            }
        )

    return sorted(
        output,
        key=lambda x: x["complaints"],
        reverse=True,
    )


def calculate_monthly_backlog(
    monthly_kpis: pd.DataFrame,
) -> list[dict[str, Any]]:
    """
    Calculate cumulative monthly backlog using:
    previous backlog + opened - closed.
    """

    df = monthly_kpis.copy()

    df = df.sort_values("month")

    backlog = 0
    results = []

    for _, row in df.iterrows():
        opened = int(row["complaints_opened"])
        closed = int(row["complaints_closed"])

        backlog += opened - closed

        results.append(
            {
                "month": str(row["month"]),
                "complaints_opened": opened,
                "complaints_closed": closed,
                "backlog": backlog,
                "avg_days_to_close": float(
                    row["avg_days_to_close"]
                ),
                "first_contact_resolution_rate": float(
                    row["first_contact_resolution_rate"]
                ),
                "inbound_calls": int(
                    row["inbound_calls"]
                ),
                "cost_to_serve_per_account": float(
                    row["cost_to_serve_per_account"]
                ),
                "regulator_satisfaction_score": float(
                    row["regulator_satisfaction_score_of_5"]
                ),
            }
        )

    return results


def analyze_meter_reads(
    meter_reads: pd.DataFrame,
) -> list[dict[str, Any]]:
    """Summarize meter-read indicators by region."""

    grouped = (
        meter_reads.groupby("region")
        .agg(
            accounts=("accounts", "mean"),
            estimated_read_rate=(
                "estimated_read_rate",
                "mean",
            ),
            smart_meter_penetration=(
                "smart_meter_penetration",
                "mean",
            ),
            billing_exceptions_raised=(
                "billing_exceptions_raised",
                "sum",
            ),
        )
        .reset_index()
    )

    results = []

    for _, row in grouped.iterrows():
        results.append(
            {
                "region": str(row["region"]),
                "average_accounts": round(
                    float(row["accounts"]),
                    0,
                ),
                "estimated_read_rate": round(
                    float(row["estimated_read_rate"]),
                    4,
                ),
                "smart_meter_penetration": round(
                    float(row["smart_meter_penetration"]),
                    4,
                ),
                "billing_exceptions_raised": int(
                    row["billing_exceptions_raised"]
                ),
            }
        )

    return sorted(
        results,
        key=lambda x: x["billing_exceptions_raised"],
        reverse=True,
    )


def analyze_staffing(
    staffing: pd.DataFrame,
) -> list[dict[str, Any]]:
    """Summarize staffing indicators by region."""

    grouped = (
        staffing.groupby("region")
        .agg(
            average_agent_fte=("agent_fte", "mean"),
            average_open_vacancies=(
                "open_vacancies",
                "mean",
            ),
            average_attrition_rate=(
                "attrition_rate_12m",
                "mean",
            ),
            average_complaints_per_agent=(
                "complaints_opened_per_agent",
                "mean",
            ),
        )
        .reset_index()
    )

    results = []

    for _, row in grouped.iterrows():
        results.append(
            {
                "region": str(row["region"]),
                "average_agent_fte": round(
                    float(row["average_agent_fte"]),
                    2,
                ),
                "average_open_vacancies": round(
                    float(row["average_open_vacancies"]),
                    2,
                ),
                "average_attrition_rate": round(
                    float(row["average_attrition_rate"]),
                    4,
                ),
                "average_complaints_per_agent": round(
                    float(row["average_complaints_per_agent"]),
                    2,
                ),
            }
        )

    return sorted(
        results,
        key=lambda x: x["average_complaints_per_agent"],
        reverse=True,
    )


def analyze_ai_pilot(
    ai_pilot: pd.DataFrame,
) -> dict[str, Any]:
    """Summarize the historical AskNorthwind pilot."""

    if ai_pilot.empty:
        return {}

    numeric_columns = [
        "assistant_sessions",
        "fully_contained_rate",
        "escalated_to_agent_rate",
        "abandoned_rate",
        "repeat_contact_within_7_days_rate",
        "assistant_csat_of_5",
        "complaint_raised_after_session_rate",
    ]

    latest = ai_pilot.sort_values("month").iloc[-1]

    result = {
        "months": int(len(ai_pilot)),
        "total_sessions": int(
            ai_pilot["assistant_sessions"].sum()
        ),
        "latest_month": str(latest["month"]),
    }

    for column in numeric_columns[1:]:
        result[column] = round(
            float(latest[column]),
            4,
        )

    return result


def calculate_unit_cost_summary(
    unit_costs: pd.DataFrame,
) -> dict[str, float]:
    """Return unit costs in a simple lookup dictionary."""

    result = {}

    for _, row in unit_costs.iterrows():
        item = str(row["item"])

        if pd.isna(row["unit_cost"]):
            continue

        result[item] = float(row["unit_cost"])

    return result


def run_full_analysis() -> dict[str, Any]:
    """
    Run the complete local Northwind analytics pipeline.

    This function does not call Gemini, LiteLLM, OpenAI,
    or any external AI service.
    """

    datasets = load_all_data()

    datasets = _clean_data(datasets)

    complaints = datasets["complaints"]

    return {
        "overall": calculate_overall_metrics(
            complaints
        ),
        "by_region": analyze_by_region(
            complaints
        ),
        "by_category": analyze_by_category(
            complaints
        ),
        "by_priority": analyze_by_priority(
            complaints
        ),
        "by_channel": analyze_by_channel(
            complaints
        ),
        "by_source_system": analyze_by_source_system(
            complaints,
            datasets["systems"],
        ),
        "monthly": calculate_monthly_backlog(
            datasets["monthly_kpis"]
        ),
        "meter_reads": analyze_meter_reads(
            datasets["meter_reads"]
        ),
        "staffing": analyze_staffing(
            datasets["staffing"]
        ),
        "ai_pilot": analyze_ai_pilot(
            datasets["ai_pilot"]
        ),
        "unit_costs": calculate_unit_cost_summary(
            datasets["unit_costs"]
        ),
    }