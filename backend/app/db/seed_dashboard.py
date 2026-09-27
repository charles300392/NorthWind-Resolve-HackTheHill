from pathlib import Path

import pandas as pd

from backend.app.db.database import get_connection


PROJECT_ROOT = Path(__file__).resolve().parents[3]
CSV_PATH = PROJECT_ROOT / "data" / "northwind_monthly_kpis.csv"


def seed_monthly_metrics() -> None:
    if not CSV_PATH.exists():
        raise FileNotFoundError(
            f"Monthly KPI CSV not found: {CSV_PATH}"
        )

    df = pd.read_csv(CSV_PATH)

    required_columns = [
        "month",
        "complaints_opened",
        "complaints_closed",
        "avg_days_to_close",
        "first_contact_resolution_rate",
        "inbound_calls",
        "cost_to_serve_per_account",
        "regulator_satisfaction_score_of_5",
    ]

    missing_columns = [
        column for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing columns: {missing_columns}"
        )

    connection = get_connection()

    try:
        for _, row in df.iterrows():
            connection.execute(
                """
                INSERT OR REPLACE INTO monthly_metrics (
                    month,
                    complaints_opened,
                    complaints_closed,
                    resolution_days,
                    first_contact_resolution_rate,
                    inbound_calls,
                    cost_to_serve_per_account,
                    regulator_score
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    row["month"],
                    int(row["complaints_opened"]),
                    int(row["complaints_closed"]),
                    float(row["avg_days_to_close"]),
                    float(row["first_contact_resolution_rate"]),
                    int(row["inbound_calls"]),
                    float(row["cost_to_serve_per_account"]),
                    float(row["regulator_satisfaction_score_of_5"]),
                ),
            )

        connection.commit()

    finally:
        connection.close()

    print(f"Inserted {len(df)} monthly KPI records.")


if __name__ == "__main__":
    seed_monthly_metrics()