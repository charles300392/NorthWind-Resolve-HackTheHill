from pathlib import Path

import pandas as pd


# Project root:
# HTH/
# ├── backend/
# │   └── app/
# │       └── data/
# │           └── loader.py
PROJECT_ROOT = Path(__file__).resolve().parents[3]

DATA_DIR = PROJECT_ROOT / "data"


def load_csv(filename: str) -> pd.DataFrame:
    """
    Load a CSV file from the project's data directory.

    This function only handles data access.
    It does not perform analytics or business logic.
    """

    file_path = DATA_DIR / filename

    if not file_path.exists():
        raise FileNotFoundError(
            f"Data file not found: {file_path}"
        )

    return pd.read_csv(file_path)


def data_file_exists(filename: str) -> bool:
    """
    Check whether a data file exists.
    """

    return (DATA_DIR / filename).exists()