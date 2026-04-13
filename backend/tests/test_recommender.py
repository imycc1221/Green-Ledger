import json
import pytest
from unittest.mock import MagicMock, patch
from recommender import get_recommendations, _parse_recommendations


def test_parse_recommendations_valid():
    raw = json.dumps({
        "recommendations": [
            {"text": "Set AC to 24C", "co2e_saving_kg": 45, "rm_saving": 120},
            {"text": "Use LED lights", "co2e_saving_kg": 12, "rm_saving": 35},
            {"text": "Fix insulation", "co2e_saving_kg": 20, "rm_saving": 60},
        ]
    })
    result = _parse_recommendations(raw)
    assert len(result) == 3
    assert result[0]["text"] == "Set AC to 24C"
    assert result[0]["co2e_saving_kg"] == 45


def test_parse_recommendations_invalid_returns_fallback():
    result = _parse_recommendations("invalid json garbage")
    assert len(result) == 1
    assert "recommendation" in result[0]["text"].lower() or "unavailable" in result[0]["text"].lower()


@patch("recommender.anthropic.Anthropic")
def test_get_recommendations_calls_claude(mock_anthropic_class):
    mock_client = MagicMock()
    mock_anthropic_class.return_value = mock_client

    fake_recs = {
        "recommendations": [
            {"text": "Turn off unused equipment", "co2e_saving_kg": 30, "rm_saving": 80},
            {"text": "Switch to LED", "co2e_saving_kg": 12, "rm_saving": 35},
            {"text": "Consolidate deliveries", "co2e_saving_kg": 25, "rm_saving": 0},
        ]
    }
    mock_client.messages.create.return_value = MagicMock(
        content=[MagicMock(text=json.dumps(fake_recs))]
    )

    receipt_data = {"vendor": "TNB", "type": "electricity", "region": "peninsular"}
    emissions = {"total_co2e_kg": 200.07, "scope": 2, "source": "Suruhanjaya Tenaga 2022"}

    result = get_recommendations(receipt_data, emissions, api_key="test-key")

    assert len(result) == 3
    mock_client.messages.create.assert_called_once()
