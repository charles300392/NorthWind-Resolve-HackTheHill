from data.context_builder import build_context
from data.data_loader import load_all_data


def test_all_datasets_load():

    datasets = load_all_data()

    assert len(datasets) == 7

    for name, df in datasets.items():

        assert not df.empty, (
            f"{name} is empty"
        )


def test_complaints_schema():

    datasets = load_all_data()

    complaints = datasets[
        "complaints"
    ]

    required = {
        "complaint_id",
        "date_opened",
        "region",
        "source_system",
        "account_id",
        "sla_breach",
        "transferred_between_systems",
    }

    assert required.issubset(
        complaints.columns
    )


def test_meter_schema():

    datasets = load_all_data()

    meter = datasets[
        "meter_reads"
    ]

    required = {
        "month",
        "region",
        "accounts",
        "estimated_read_rate",
        "smart_meter_penetration",
        "billing_exceptions_raised",
    }

    assert required.issubset(
        meter.columns
    )


def test_staffing_schema():

    datasets = load_all_data()

    staffing = datasets[
        "staffing"
    ]

    required = {
        "month",
        "region",
        "agent_fte",
        "open_vacancies",
        "attrition_rate_12m",
    }

    assert required.issubset(
        staffing.columns
    )


def test_context_builder():

    context = build_context(
        "NW-100001"
    )

    assert context["region"] == "Ashford"

    assert (
        context["month"]
        == "2024-10"
    )

    assert (
        "historical_breach_rate"
        in context
    )

    assert (
        "estimated_read_rate"
        in context
    )

    assert (
        "smart_meter_penetration"
        in context
    )

    assert (
        "billing_exception_rate"
        in context
    )

    assert (
        "staffing"
        in context
    )

    assert (
        "monthly_kpis"
        in context
    )

    assert (
        "source_system_context"
        in context
    )