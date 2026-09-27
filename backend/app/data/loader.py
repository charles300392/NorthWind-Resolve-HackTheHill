from pathlib import Path

import pandas as pd


# Project root:
#
# NorthWind-Resolve-HackTheHill/
# ├── backend/
# │   └── app/
# │       └── data/
# │           └── loader.py
# └── data/
#     └── raw/
#
PROJECT_ROOT = Path(__file__).resolve().parents[3]

DATA_DIR = PROJECT_ROOT / "data" / "raw"


def load_csv(filename: str) -> pd.DataFrame:
    """
    Load a Northwind CSV file from the local data directory.

    This function only handles data access.
    Analytics and business logic remain in the data layer.
    """

    file_path = DATA_DIR / filename

    if not file_path.exists():
        raise FileNotFoundError(
            f"Data file not found: {file_path}"
        )

    return pd.read_csv(file_path)


def data_file_exists(filename: str) -> bool:
    """
    Check whether a Northwind data file exists.
    """

    return (DATA_DIR / filename).exists()