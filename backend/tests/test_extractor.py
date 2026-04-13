import json
import pytest
import anthropic
from unittest.mock import MagicMock, patch
from extractor import extract_receipt_data, _parse_claude_json


def test_parse_claude_json_plain():
    raw = '{"vendor": "TNB", "type": "electricity"}'
    result = _parse_claude_json(raw)
    assert result["vendor"] == "TNB"


def test_parse_claude_json_with_markdown_block():
    raw = '```json\n{"vendor": "TNB", "type": "electricity"}\n```'
    result = _parse_claude_json(raw)
    assert result["vendor"] == "TNB"


def test_parse_claude_json_invalid_returns_fallback():
    result = _parse_claude_json("not valid json at all")
    assert result["type"] == "other"
    assert result["line_items"] == []


@patch("extractor.anthropic.Anthropic")
def test_extract_receipt_data_calls_claude(mock_anthropic_class):
    mock_client = MagicMock()
    mock_anthropic_class.return_value = mock_client

    fake_response = {
        "vendor": "TNB",
        "date": "2025-06",
        "type": "electricity",
        "region": "peninsular",
        "line_items": [
            {"description": "Electricity usage", "quantity": 342, "unit": "kWh", "amount_rm": 154.50}
        ],
        "total_rm": 530.00
    }

    mock_client.messages.create.return_value = MagicMock(
        content=[MagicMock(text=json.dumps(fake_response))]
    )

    result = extract_receipt_data(b"fake_image_bytes", "image/jpeg", api_key="test-key")

    assert result["vendor"] == "TNB"
    assert result["type"] == "electricity"
    assert result["region"] == "peninsular"
    assert len(result["line_items"]) == 1
    assert result["line_items"][0]["quantity"] == 342


@patch("extractor.anthropic.Anthropic")
def test_extract_receipt_data_returns_fallback_on_api_error(mock_anthropic_class):
    mock_client = MagicMock()
    mock_anthropic_class.return_value = mock_client
    mock_client.messages.create.side_effect = anthropic.APIConnectionError(request=MagicMock())

    result = extract_receipt_data(b"fake_image_bytes", "image/jpeg", api_key="test-key")

    assert result["type"] == "other"
    assert result["line_items"] == []


def test_extract_receipt_data_raises_on_empty_bytes():
    with pytest.raises(ValueError, match="must not be empty"):
        extract_receipt_data(b"", "image/jpeg", api_key="test-key")
