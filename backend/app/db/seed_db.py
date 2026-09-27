from pathlib import Path

import pandas as pd

from backend.app.db.database import get_connection


PROJECT_ROOT = Path(__file__).resolve().parents[3]
CSV_PATH = PROJECT_ROOT / "data" / "northwind_complaints.csv"


def seed_database() -> None:
    if not CSV_PATH.exists():
        raise FileNotFoundError(
            f"Complaints CSV not found: {CSV_PATH}"
        )

    df = pd.read_csv(CSV_PATH)

    connection = get_connection()

    try:
        df.to_sql(
            "complaints",
            connection,
            if_exists="append",
            index=False,
        )

        connection.commit()

    finally:
        connection.close()

    print(f"Inserted {len(df)} complaints.")


if __name__ == "__main__":
    seed_database()