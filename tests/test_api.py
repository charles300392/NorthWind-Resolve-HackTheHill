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


def test_complaints_list():

    response = client.get(
        "/api/complaints"
    )

    assert response.status_code == 200

    data = response.json()

    assert "total" in data

    assert "items" in data

    assert data["total"] > 0

    assert len(data["items"]) > 0


def test_complaints_list_pagination():

    response = client.get(
        "/api/complaints?limit=5&offset=0"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["limit"] == 5

    assert data["offset"] == 0

    assert data["count"] == 5


def test_complaint_detail():

    response = client.get(
        "/api/complaints/NW-100001"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["complaint_id"] == "NW-100001"

    assert data["region"] == "Ashford"


def test_complaint_not_found():

    response = client.get(
        "/api/complaints/NW-DOES-NOT-EXIST"
    )

    assert response.status_code == 404


def test_complaint_context():

    response = client.get(
        "/api/complaints/NW-100001/context"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["region"] == "Ashford"

    assert data["month"] == "2024-10"

    assert "historical_breach_rate" in data

    assert "estimated_read_rate" in data

    assert "smart_meter_penetration" in data


def test_dashboard_summary():

    response = client.get(
        "/api/dashboard/summary"
    )

    assert response.status_code == 200

    data = response.json()

    assert "overall" in data

    assert "by_region" in data

    assert "by_category" in data

    assert "by_priority" in data

    assert "by_channel" in data

    assert "monthly" in data

    assert data["overall"]["total_complaints"] > 0

    assert len(data["by_region"]) > 0

    assert len(data["by_category"]) > 0

    assert len(data["monthly"]) == 24

def test_complaints_search():
    response = client.get(
        "/api/complaints?search=NW-100001&limit=5"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    assert any(
        item["complaint_id"] == "NW-100001"
        for item in data["items"]
    )
