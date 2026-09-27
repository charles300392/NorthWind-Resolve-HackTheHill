from __future__ import annotations

import pandas as pd

from data.data_loader import load_complaints


PRIORITY_TO_SCORE = {
    "CRITICAL": 1.00,
    "HIGH": 0.75,
    "MEDIUM": 0.50,
    "LOW": 0.25,
}


def priority_to_queue(priority: str) -> str:
    return {
        "CRITICAL": "Immediate response",
        "HIGH": "Priority resolution",
        "MEDIUM": "Standard resolution",
        "LOW": "Routine resolution",
    }.get(priority.upper(), "Standard resolution")


def priority_to_legacy_code(priority: str) -> str:
    return {
        "CRITICAL": "P1",
        "HIGH": "P2",
        "MEDIUM": "P3",
        "LOW": "P4",
    }.get(priority.upper(), "P3")


def local_operational_signals(region: str | None, category: str | None) -> dict:
    df = load_complaints()

    region_df = df
    if region:
        candidate = df[df["region"].astype(str).str.lower() == region.lower()]
        if not candidate.empty:
            region_df = candidate

    breach_rate = float(region_df["sla_breach"].mean()) if not region_df.empty else 0.0

    category_df = df
    if category:
        candidate = df[df["category"].astype(str).str.lower() == category.lower()]
        if not candidate.empty:
            category_df = candidate

    if category_df.empty:
        category_df = df

    median_sla = int(round(float(category_df["sla_days"].median()))) if not category_df.empty else 20
    category_volume_share = (
        float(len(category_df) / len(df)) if len(df) else 0.0
    )

    return {
        "historical_breach_rate": round(breach_rate, 4),
        "recommended_sla_days": max(median_sla, 1),
        "category_volume_share": round(category_volume_share, 4),
    }


def calculate_triage_score(
    priority: str,
    severity: str,
    historical_breach_rate: float,
) -> float:
    priority_score = PRIORITY_TO_SCORE.get(priority.upper(), 0.5)
    severity_score = PRIORITY_TO_SCORE.get(severity.upper(), 0.5)

    score = (
        0.55 * priority_score
        + 0.25 * severity_score
        + 0.20 * historical_breach_rate
    )

    return round(min(max(score, 0.0), 1.0), 2)
