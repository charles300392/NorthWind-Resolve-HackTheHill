from pathlib import Path

import pandas as pd


DATA_DIR = Path(__file__).resolve().parent / "raw"


FILES = {
    "complaints": "northwind_complaints.csv",
    "systems": "northwind_systems.csv",
    "monthly_kpis": "northwind_monthly_kpis.csv",
    "meter_reads": "northwind_meter_reads.csv",
    "ai_pilot": "northwind_ai_pilot_2025.csv",
    "staffing": "northwind_contact_centre_staffing.csv",
    "unit_costs": "northwind_unit_costs.csv",
}


def load_csv(filename: str) -> pd.DataFrame:
    path = DATA_DIR / filename

    if not path.exists():
        raise FileNotFoundError(
            f"Dataset not found: {path}"
        )

    df = pd.read_csv(path)

    # Minimal normalization of column names.
    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
        .str.replace("-", "_")
    )

    return df


def load_all_data() -> dict[str, pd.DataFrame]:
    return {
        name: load_csv(filename)
        for name, filename in FILES.items()
    }


def load_complaints():
    return load_csv(
        FILES["complaints"]
    )


def load_meter_reads():
    return load_csv(
        FILES["meter_reads"]
    )


def load_staffing():
    return load_csv(
        FILES["staffing"]
    )


def load_monthly_kpis():
    return load_csv(
        FILES["monthly_kpis"]
    )


def load_systems():
    return load_csv(
        FILES["systems"]
    )


def load_ai_pilot():
    return load_csv(
        FILES["ai_pilot"]
    )


def load_unit_costs():
    return load_csv(
        FILES["unit_costs"]
    )