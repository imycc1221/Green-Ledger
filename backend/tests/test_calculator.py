import pytest
from calculator import calculate_receipt_emissions


def test_electricity_peninsular():
    receipt = {
        "type": "electricity",
        "region": "peninsular",
        "line_items": [{"description": "Usage", "quantity": 342, "unit": "kWh", "amount_rm": 154.50}]
    }
    result = calculate_receipt_emissions(receipt)
    assert result["total_co2e_kg"] == pytest.approx(200.07, rel=0.01)
    assert result["scope"] == 2
    assert result["source"] == "Suruhanjaya Tenaga 2022"
    assert len(result["line_items"]) == 1
    assert result["line_items"][0]["co2e_kg"] == pytest.approx(200.07, rel=0.01)


def test_electricity_sabah():
    receipt = {
        "type": "electricity",
        "region": "sabah",
        "line_items": [{"description": "Usage", "quantity": 100, "unit": "kWh", "amount_rm": 45.0}]
    }
    result = calculate_receipt_emissions(receipt)
    assert result["total_co2e_kg"] == pytest.approx(84.0, rel=0.01)


def test_electricity_default_region():
    receipt = {
        "type": "electricity",
        "region": None,
        "line_items": [{"description": "Usage", "quantity": 100, "unit": "kWh", "amount_rm": 45.0}]
    }
    result = calculate_receipt_emissions(receipt)
    assert result["total_co2e_kg"] == pytest.approx(58.5, rel=0.01)


def test_water():
    receipt = {
        "type": "water",
        "region": None,
        "line_items": [{"description": "Water consumption", "quantity": 18.5, "unit": "m3", "amount_rm": 12.0}]
    }
    result = calculate_receipt_emissions(receipt)
    assert result["total_co2e_kg"] == pytest.approx(6.364, rel=0.01)
    assert result["scope"] == 2


def test_diesel_fuel():
    receipt = {
        "type": "fuel",
        "region": None,
        "line_items": [{"description": "Diesel", "quantity": 50, "unit": "litre", "amount_rm": 130.0}]
    }
    result = calculate_receipt_emissions(receipt)
    assert result["total_co2e_kg"] == pytest.approx(134.0, rel=0.01)
    assert result["scope"] == 1


def test_multiple_line_items_only_calculable_ones_contribute():
    # Max demand charge has no emission factor — should not contribute
    receipt = {
        "type": "electricity",
        "region": "peninsular",
        "line_items": [
            {"description": "Energy charge", "quantity": 342, "unit": "kWh", "amount_rm": 154.50},
            {"description": "Max demand charge", "quantity": 12.4, "unit": "kW", "amount_rm": 376.0},
        ]
    }
    result = calculate_receipt_emissions(receipt)
    # Only the kWh row counts; kW is not an energy unit we track
    assert result["total_co2e_kg"] == pytest.approx(200.07, rel=0.01)


def test_unknown_type_returns_zero():
    receipt = {
        "type": "other",
        "region": None,
        "line_items": [{"description": "Some item", "quantity": 10, "unit": "unit", "amount_rm": 50.0}]
    }
    result = calculate_receipt_emissions(receipt)
    assert result["total_co2e_kg"] == 0.0
    assert result["scope"] == 3


def test_mixed_fuel_types_calculated_per_item():
    receipt = {
        "type": "fuel",
        "region": None,
        "line_items": [
            {"description": "Diesel B10", "quantity": 30, "unit": "litre", "amount_rm": 78.0},
            {"description": "RON95 Petrol", "quantity": 20, "unit": "litre", "amount_rm": 48.0},
        ]
    }
    result = calculate_receipt_emissions(receipt)
    # 30 * 2.68 + 20 * 2.31 = 80.4 + 46.2 = 126.6
    assert result["total_co2e_kg"] == pytest.approx(126.6, rel=0.01)
    assert result["line_items"][0]["co2e_kg"] == pytest.approx(80.4, rel=0.01)
    assert result["line_items"][1]["co2e_kg"] == pytest.approx(46.2, rel=0.01)
