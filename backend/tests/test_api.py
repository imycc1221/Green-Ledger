import json
import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from main import app, _history

client = TestClient(app)


@pytest.fixture(autouse=True)
def clear_history():
    """Reset in-memory history before each test to prevent state bleed."""
    _history.clear()
    yield
    _history.clear()


def test_get_history_empty():
    response = client.get("/api/history")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@patch("main.extract_receipt_data")
@patch("main.get_recommendations")
def test_upload_receipt(mock_recs, mock_extract):
    mock_extract.return_value = {
        "vendor": "TNB",
        "date": "2025-06",
        "type": "electricity",
        "region": "peninsular",
        "line_items": [
            {"description": "Electricity usage", "quantity": 342, "unit": "kWh", "amount_rm": 154.50}
        ],
        "total_rm": 530.00
    }
    mock_recs.return_value = [
        {"text": "Set AC to 24C", "co2e_saving_kg": 45, "rm_saving": 120}
    ]

    with open("tests/fixtures/sample_bill.jpg", "rb") as f:
        img_bytes = f.read()

    response = client.post(
        "/api/upload",
        files={"file": ("tnb_bill.jpg", img_bytes, "image/jpeg")},
        headers={"X-API-Key": "test-key"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["receipt"]["vendor"] == "TNB"
    assert data["emissions"]["total_co2e_kg"] == pytest.approx(200.07, rel=0.01)
    assert len(data["recommendations"]) == 1
    assert "id" in data


def test_upload_missing_api_key():
    response = client.post("/api/upload", files={"file": ("x.jpg", b"fake", "image/jpeg")})
    assert response.status_code == 400


def test_upload_invalid_file_type():
    response = client.post(
        "/api/upload",
        files={"file": ("doc.pdf", b"fake pdf", "application/pdf")},
        headers={"X-API-Key": "test-key"},
    )
    assert response.status_code == 422
