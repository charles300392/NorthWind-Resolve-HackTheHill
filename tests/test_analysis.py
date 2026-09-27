from data.analysis import (
    analyze_by_category,
    analyze_by_channel,
    analyze_by_priority,
    analyze_by_region,
    analyze_by_source_system,
    calculate_monthly_backlog,
    calculate_overall_metrics,
    run_full_analysis,
)
from data.data_loader import load_all_data


def test_overall_metrics():
    datasets = load_all_data()

    metrics = calculate_overall_metrics(
        datasets["complaints"]
    )

    assert metrics["total_complaints"] == 25416
    assert 0.0 <= metrics["sla_breach_rate"] <= 1.0
    assert 0.0 <= metrics["transfer_rate"] <= 1.0
    assert 0.0 <= metrics["reopen_rate"] <= 1.0
    assert metrics["average_days_to_close"] >= 0


def test_region_analysis():
    datasets = load_all_data()

    results = analyze_by_region(
        datasets["complaints"]
    )

    assert len(results) > 0

    for row in results:
        assert "region" in row
        assert "complaints" in row
        assert "sla_breach_rate" in row


def test_category_analysis():
    datasets = load_all_data()

    results = analyze_by_category(
        datasets["complaints"]
    )

    assert len(results) > 0

    total = sum(
        row["complaints"]
        for row in results
    )

    assert total == 25416


def test_priority_analysis():
    datasets = load_all_data()

    results = analyze_by_priority(
        datasets["complaints"]
    )

    assert len(results) > 0


def test_channel_analysis():
    datasets = load_all_data()

    results = analyze_by_channel(
        datasets["complaints"]
    )

    assert len(results) > 0


def test_source_system_analysis():
    datasets = load_all_data()

    results = analyze_by_source_system(
        datasets["complaints"],
        datasets["systems"],
    )

    assert len(results) > 0

    for row in results:
        assert "source_system" in row
        assert "system_name" in row
        assert "complaints" in row


def test_monthly_backlog():
    datasets = load_all_data()

    results = calculate_monthly_backlog(
        datasets["monthly_kpis"]
    )

    assert len(results) == 24

    for row in results:
        assert "month" in row
        assert "backlog" in row


def test_full_analysis():
    analysis = run_full_analysis()

    assert "overall" in analysis
    assert "by_region" in analysis
    assert "by_category" in analysis
    assert "by_priority" in analysis
    assert "by_channel" in analysis
    assert "by_source_system" in analysis
    assert "monthly" in analysis
    assert "meter_reads" in analysis
    assert "staffing" in analysis
    assert "ai_pilot" in analysis
    assert "unit_costs" in analysis