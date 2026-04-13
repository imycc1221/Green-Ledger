import json
import re
import anthropic

_SYSTEM_PROMPT = """You are a carbon reduction advisor for Malaysian SMEs.
Given a receipt's carbon data, provide exactly 3 actionable recommendations.

Return ONLY valid JSON (no markdown):
{
  "recommendations": [
    {
      "text": "string — specific, actionable recommendation with context",
      "co2e_saving_kg": number — estimated kg CO2e saved per month,
      "rm_saving": number — estimated RM saved per month (0 if no direct cost saving)
    }
  ]
}

Rules:
- Be specific to Malaysian context (TNB, Petronas, typical F&B operations)
- Include both CO2e and RM savings where applicable
- Recommendations must be immediately actionable, not aspirational
- Return ONLY the JSON object"""

_FALLBACK = [
    {
        "text": "AI recommendation unavailable. Please check your bill manually.",
        "co2e_saving_kg": 0,
        "rm_saving": 0,
    }
]


def _parse_recommendations(raw: str) -> list[dict]:
    """Parse Claude's recommendations response."""
    text = raw.strip()

    match = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
    if match:
        text = match.group(1).strip()

    try:
        data = json.loads(text)
        return data.get("recommendations", [])
    except json.JSONDecodeError:
        return [{"text": "AI recommendation unavailable. Please check your bill manually.", "co2e_saving_kg": 0, "rm_saving": 0}]


def get_recommendations(receipt_data: dict, emissions: dict, api_key: str) -> list[dict]:
    """
    Get 3 actionable carbon reduction recommendations from Claude.

    Args:
        receipt_data: Extracted receipt dict (vendor, type, region, line_items, total_rm)
        emissions: Calculated emissions dict (total_co2e_kg, scope, source)
        api_key: Anthropic API key

    Returns:
        List of recommendation dicts: [{text, co2e_saving_kg, rm_saving}]
    """
    client = anthropic.Anthropic(api_key=api_key)

    context = (
        f"Vendor: {receipt_data.get('vendor', 'Unknown')}\n"
        f"Receipt type: {receipt_data.get('type', 'unknown')}\n"
        f"Region: {receipt_data.get('region', 'peninsular')}\n"
        f"Total CO2e: {emissions.get('total_co2e_kg', 0):.1f} kg\n"
        f"Scope: {emissions.get('scope', 2)}\n"
        f"Line items: {json.dumps(receipt_data.get('line_items', []))}"
    )

    try:
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=512,
            system=_SYSTEM_PROMPT,
            messages=[
                {"role": "user", "content": f"Provide 3 recommendations for this receipt:\n\n{context}"}
            ],
        )
        if not message.content:
            return _parse_recommendations("")  # triggers fallback
        raw_text = message.content[0].text
        return _parse_recommendations(raw_text)
    except anthropic.APIError:
        return _parse_recommendations("")
