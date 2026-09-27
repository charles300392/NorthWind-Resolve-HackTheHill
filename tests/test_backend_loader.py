from backend.app.data.loader import (
    data_file_exists,
    load_csv,
)


def test_complaints_file_exists():

    assert data_file_exists(
        "northwind_complaints.csv"
    )


def test_complaints_can_be_loaded():

    df = load_csv(
        "northwind_complaints.csv"
    )

    assert len(df) == 25416

    assert "complaint_id" in df.columns

    assert "region" in df.columns

    assert "source_system" in df.columns