from fastapi.testclient import TestClient

from backend.app.main import app
from backend.app.api.routes import complaints as complaints_route
from ai.schemas import AIAnalysis


client = TestClient(app)


def test_create_new_complaint(monkeypatch, tmp_path):
    store_path = tmp_path / "new_complaints.json"
    store_dir = tmp_path / "runtime"

    monkeypatch.setattr(
        complaints_route,
        "analyze_complaint",
        lambda complaint_text, context=None: AIAnalysis(
            category="Metering - Incorrect Read",
            priority="HIGH",
            severity="MEDIUM",
            sla_risk=0.0,
            root_cause="Possible incorrect meter reading",
            recommendation="Review meter history and arrange a re-read.",
            response="We have received your complaint and will review the meter reading.",
            confidence=0.92,
            explanation=[
                "The complaint explicitly disputes the meter reading.",
                "The case should be reviewed by the metering team.",
            ],
        ),
    )

    monkeypatch.setattr(complaints_route, "STORE_PATH", store_path, raising=False)
    monkeypatch.setattr(complaints_route, "STORE_DIR", store_dir, raising=False)
    monkeypatch.setattr(
        "backend.app.services.complaint_store.STORE_PATH",
        store_path,
    )
    monkeypatch.setattr(
        "backend.app.services.complaint_store.STORE_DIR",
        store_dir,
    )

    response = client.post(
        "/api/complaints",
        json={
            "complaint_text": "My meter reading is incorrect and my bill is much higher than usual.",
            "account_id": "ACC-TEST-001",
            "region": "Ashford",
            "channel": "Web form",
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["complaint_id"] == "NW-NEW-0001"
    assert data["status"] == "Open"
    assert data["priority"] == "P2"
    assert data["triage_priority"] == "HIGH"
    assert data["queue"] == "Priority resolution"
    assert data["response"] is not None

    detail = client.get(
        f"/api/complaints/{data['complaint_id']}"
    )
    assert detail.status_code == 200
    assert detail.json()["account_id"] == "ACC-TEST-001"

    context = client.get(
        f"/api/complaints/{data['complaint_id']}/context"
    )
    assert context.status_code == 200
    assert context.json()["triage_score"] > 0
