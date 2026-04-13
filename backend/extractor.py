import base64
import json
import re
import anthropic

_SYSTEM_PROMPT = """You are a receipt data extractor for Malaysian businesses.
Extract structured data from this receipt/bill image.

Return ONLY valid JSON (no markdown, no explanation) with this exact schema:
{
  "vendor": "string — business name on receipt",
  "date": "YYYY-MM — billing month/year",
  "type": "electricity | water | fuel | gas | waste | other",
  "region": "peninsular | sabah | sarawak | null — for electricity bills only",
  "line_items": [
    {
      "description": "string",
      "quantity": number,
      "unit": "string — kWh | m3 | litre | kg | kW | etc",
      "amount_rm": number
    }
  ],
  "total_rm": number
}

Rules:
- For TNB bills: type = "electricity", extract kWh consumption as a line item
- For Petronas/Shell receipts: type = "fuel", unit = "litre"
- For IWK/SYABAS bills: type = "water", unit = "m3"
- If region is unclear for electricity, default to "peninsular"
- Return ONLY the JSON object, nothing else"""


def _parse_claude_json(raw: str) -> dict:
    """Parse Claude's response, handling markdown code blocks if present."""
    text = raw.strip()

    # Strip markdown code blocks if present
    match = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
    if match:
        text = match.group(1).strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {
            "vendor": "Unknown",
            "date": None,
            "type": "other",
            "region": None,
            "line_items": [],
            "total_rm": 0,
        }


def extract_receipt_data(image_bytes: bytes, media_type: str, api_key: str) -> dict:
    """
    Send a receipt image to Claude Haiku 4.5 and return structured data.

    Args:
        image_bytes: Raw image bytes
        media_type: MIME type e.g. "image/jpeg" or "image/png"
        api_key: Anthropic API key

    Returns:
        dict matching the schema in _SYSTEM_PROMPT
    """
    if not image_bytes:
        raise ValueError("image_bytes must not be empty")

    client = anthropic.Anthropic(api_key=api_key)

    encoded = base64.standard_b64encode(image_bytes).decode("utf-8")

    try:
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1024,
            system=_SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": media_type,
                                "data": encoded,
                            },
                        },
                        {
                            "type": "text",
                            "text": "Extract the data from this receipt and return JSON."
                        }
                    ],
                }
            ],
        )
        if not message.content:
            return _parse_claude_json("")  # triggers fallback
        raw_text = message.content[0].text
        return _parse_claude_json(raw_text)
    except anthropic.APIError:
        return _parse_claude_json("")
