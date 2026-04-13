import json
from pathlib import Path

_FACTORS_PATH = Path(__file__).parent / "emission_factors.json"

with open(_FACTORS_PATH) as f:
    _FACTORS = json.load(f)

# Keywords to detect fuel sub-types from line item descriptions
_FUEL_SUBTYPE_KEYWORDS = {
    "diesel": "diesel",
    "petrol": "petrol",
    "gasoline": "petrol",
}


def _get_factor_entry(receipt_type: str, region: str | None, description: str | None = None) -> dict | None:
    """Return the emission factor entry for a given receipt type, region, and optional item description.

    For fuel type with no region, attempts to detect the sub-type (diesel/petrol)
    from the item description before falling back to default.
    """
    type_key = receipt_type.lower()
    region_key = (region or "default").lower()

    if type_key not in _FACTORS:
        return None

    type_factors = _FACTORS[type_key]

    # For fuel with no region, sniff the sub-type from the item's description
    if type_key == "fuel" and region is None and description:
        desc_lower = description.lower()
        for keyword, subtype_key in _FUEL_SUBTYPE_KEYWORDS.items():
            if keyword in desc_lower and subtype_key in type_factors:
                return type_factors[subtype_key]

    # Direct region match (e.g. electricity/peninsular) or "default" fallback
    if region_key in type_factors:
        return type_factors[region_key]

    # Fall back to "default" entry
    if "default" in type_factors:
        return type_factors["default"]

    return None


def calculate_receipt_emissions(receipt: dict) -> dict:
    """
    Calculate CO2e emissions for a receipt.

    Args:
        receipt: dict with keys:
            - type: str (electricity | water | fuel | gas | waste | other)
            - region: str | None (peninsular | sabah | sarawak | None)
            - line_items: list of {description, quantity, unit, amount_rm}

    Returns:
        dict with keys:
            - total_co2e_kg: float
            - scope: int (1 | 2 | 3)
            - source: str
            - line_items: list of {description, quantity, unit, amount_rm, co2e_kg, calculable}
    """
    receipt_type = receipt.get("type", "other")
    region = receipt.get("region")
    line_items = receipt.get("line_items", [])

    # Check if this receipt type is known at all (using a probe with no description)
    probe_entry = _get_factor_entry(receipt_type, region)

    if probe_entry is None:
        return {
            "total_co2e_kg": 0.0,
            "scope": 3,
            "source": "N/A",
            "line_items": [
                {**item, "co2e_kg": 0.0, "calculable": False}
                for item in line_items
            ],
        }

    enriched_items = []
    total = 0.0

    for item in line_items:
        unit = item.get("unit", "").lower().strip()

        # Robust quantity parsing: LLM may return a string instead of a number
        try:
            qty = float(item.get("quantity") or 0)
        except (TypeError, ValueError):
            qty = 0.0

        # Per-item factor lookup so mixed fuel types get the right factor each
        entry = _get_factor_entry(receipt_type, region, item.get("description", ""))

        # Only calculate items whose unit matches the factor unit
        is_calculable = entry is not None and unit == entry["unit"].lower()

        if is_calculable:
            co2e = round(qty * entry["factor"], 3)
            total += co2e
        else:
            co2e = 0.0

        enriched_items.append({**item, "co2e_kg": co2e, "calculable": is_calculable})

    # Use the probe entry's scope/source as the receipt-level metadata
    return {
        "total_co2e_kg": round(total, 3),
        "scope": probe_entry["scope"],
        "source": probe_entry["source"],
        "line_items": enriched_items,
    }
