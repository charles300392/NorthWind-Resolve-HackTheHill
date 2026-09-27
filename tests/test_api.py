from fastapi.testclient import TestClient

from backend.app.main import app


client = TestClient(app)


def test_health():

    response = client.get("/health")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "ok"


def test_analytics_overview():

    response = client.get(
        "/api/analytics/overview"
    )

    assert response.status_code == 200

    data = response.json()

    assert "total_complaints" in data

    assert "sla_breach_rate" in data

    assert "average_days_to_close" in data


def test_analytics_regions():

    response = client.get(
        "/api/analytics/regions"
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)

    assert len(data) > 0


def test_analytics_monthly():

    response = client.get(
        "/api/analytics/monthly"
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 24