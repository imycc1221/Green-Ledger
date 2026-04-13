# GreenLedger

**Carbon · Clarity · Action**

GreenLedger lets Malaysian SMEs photograph a utility bill and receive an instant, GHG Protocol-aligned carbon footprint breakdown together with three actionable cost-reduction recommendations — all powered by Claude Haiku 4.5 Vision.

Built in 48 hours for the **Earth Day Hackathon 2026** hosted by The Access Group, Kuala Lumpur (22 April 2026).

---

## Features

- **Vision-based bill parsing** — upload a TNB electricity bill, Petronas/Shell fuel receipt, SYABAS/IWK water bill, or LPG invoice; Claude Haiku 4.5 extracts vendor, billing month, line items, quantities, and units automatically.
- **Malaysian emission factors** — region-aware electricity grid intensities (Peninsular 0.585, Sabah 0.840, Sarawak 0.474 kgCO2e/kWh) sourced from Suruhanjaya Tenaga 2022; fuel factors from IPCC AR6; water from DEFRA 2023.
- **GHG Protocol scope classification** — each receipt is tagged Scope 1 (direct fuel/gas combustion), Scope 2 (purchased electricity and water), or Scope 3 (waste and unclassified).
- **Per-line-item CO2e calculation** — only line items whose unit matches the emission factor unit are calculated; non-calculable rows (e.g. kW demand charges) are flagged separately.
- **AI recommendations** — Claude returns three immediately-actionable, Malaysian-context suggestions with estimated CO2e savings (kg/month) and RM savings (RM/month).
- **Session history** — all processed receipts persist in the browser's localStorage and are viewable on the History page with a side-by-side detail panel.
- **Browser-held API key** — the Anthropic key is entered once in the top bar and stored in localStorage; nothing is stored server-side.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18.3, React Router v6, Vite 5, Tailwind CSS 3, lucide-react |
| Backend | Python, FastAPI 0.115, Uvicorn 0.30 |
| AI | Anthropic Python SDK 0.34, model `claude-haiku-4-5-20251001` |
| Testing | pytest 8.3, httpx 0.27, FastAPI TestClient |

---

## Prerequisites

- **Python 3.11+** (3.12 recommended)
- **Node.js 20+** and npm
- An **Anthropic API key** with access to `claude-haiku-4-5-20251001`

---

## Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd greenledger
```

### 2. Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

The API starts on **http://localhost:8000**.

`requirements.txt` installs:

```
fastapi==0.115.0
uvicorn[standard]==0.30.6
anthropic==0.34.2
python-multipart==0.0.9
pytest==8.3.3
httpx==0.27.2
```

### 3. Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app opens on **http://localhost:5173**.

Vite proxies every `/api/*` request to `http://localhost:8000`, so the frontend and backend never need to share a domain in development.

---

## How to Use

1. Open **http://localhost:5173** in your browser.
2. Paste your Anthropic API key (`sk-ant-...`) into the input field in the top-right header. A green "Key set" badge confirms it was accepted. The key is saved to localStorage and survives page refreshes.
3. On the **Dashboard**, drag and drop a bill image onto the upload zone, or click **Browse files** to pick one. Accepted formats: JPEG, PNG, WebP.
4. GreenLedger sends the image to the backend, which calls Claude Haiku 4.5 to extract line items, calculates CO2e for each calculable row, and generates three recommendations.
5. The result card shows:
   - Extracted line items with quantities, calculated emission factors, and per-line CO2e.
   - Total CO2e for the receipt.
   - GHG Protocol scope and emission factor source.
   - Three AI recommendations with CO2e and RM savings estimates.
6. Click **History** in the sidebar to browse all receipts analysed in the session. Click any row to open the full detail panel.

---

## API Reference

The backend exposes two endpoints.

### POST /api/upload

Upload a bill image for analysis.

**Headers**

| Header | Required | Description |
|---|---|---|
| `X-API-Key` | Yes | Anthropic API key forwarded to Claude |

**Body** — `multipart/form-data`

| Field | Type | Description |
|---|---|---|
| `file` | image/jpeg, image/png, or image/webp | The bill or receipt photo |

**Response 200**

```json
{
  "id": "3f2a1b...",
  "filename": "tnb_bill.jpg",
  "receipt": {
    "vendor": "TNB",
    "date": "2025-06",
    "type": "electricity",
    "region": "peninsular",
    "line_items": [
      { "description": "Energy charge", "quantity": 342, "unit": "kWh", "amount_rm": 154.50 }
    ],
    "total_rm": 530.00
  },
  "emissions": {
    "total_co2e_kg": 200.07,
    "scope": 2,
    "source": "Suruhanjaya Tenaga 2022",
    "line_items": [
      { "description": "Energy charge", "quantity": 342, "unit": "kWh", "amount_rm": 154.50, "co2e_kg": 200.07, "calculable": true }
    ]
  },
  "recommendations": [
    { "text": "Set air conditioning to 24°C ...", "co2e_saving_kg": 45, "rm_saving": 120 }
  ]
}
```

**Error responses**

| Status | Condition |
|---|---|
| 400 | `X-API-Key` header missing |
| 422 | File type is not JPEG, PNG, or WebP |
| 500 | Receipt processing failed (Claude API error or parse failure) |

### GET /api/history

Returns all records processed since the server started (in-memory, newest first). This store resets on server restart.

---

## Emission Factors

All factors are stored in `backend/emission_factors.json`.

| Utility | Sub-type | Factor | Unit | Scope | Source |
|---|---|---|---|---|---|
| Electricity | Peninsular | 0.585 kgCO2e | kWh | 2 | Suruhanjaya Tenaga 2022 |
| Electricity | Sabah | 0.840 kgCO2e | kWh | 2 | Suruhanjaya Tenaga 2022 |
| Electricity | Sarawak | 0.474 kgCO2e | kWh | 2 | Suruhanjaya Tenaga 2022 |
| Water | — | 0.344 kgCO2e | m3 | 2 | DEFRA 2023 |
| Fuel | Diesel | 2.68 kgCO2e | litre | 1 | IPCC AR6 |
| Fuel | Petrol | 2.31 kgCO2e | litre | 1 | IPCC AR6 |
| Gas | LPG | 1.51 kgCO2e | kg | 1 | IPCC AR6 |
| Waste | — | 0.58 kgCO2e | kg | 3 | IPCC |

When Claude identifies a fuel receipt without an explicit region, the calculator inspects each line item description for the keywords `diesel`, `petrol`, or `gasoline` to select the correct factor. Unrecognised electricity regions default to Peninsular.

---

## Running Tests

All tests live in `backend/tests/` and require no real API key — Claude calls are mocked.

```bash
cd backend
pytest
```

Test coverage:

| Test file | What it covers |
|---|---|
| `test_calculator.py` | Emission calculations for electricity (all three regions), water, diesel, petrol, mixed fuel receipts, unknown types |
| `test_extractor.py` | JSON parsing (plain and markdown-wrapped), Claude call construction, API error fallback, empty-bytes guard |
| `test_recommender.py` | Recommendation parsing, fallback on invalid JSON, Claude call construction |
| `test_api.py` | `/api/upload` happy path (mocked Claude), missing API key (400), unsupported file type (422), `/api/history` empty state |

A JPEG fixture used by `test_api.py` is located at `backend/tests/fixtures/sample_bill.jpg`.

---

## Project Structure

```
greenledger/
├── backend/
│   ├── main.py                  # FastAPI app — /api/upload and /api/history
│   ├── extractor.py             # Claude Haiku 4.5 vision call, JSON parsing
│   ├── calculator.py            # CO2e calculation, emission factor lookup
│   ├── recommender.py           # Claude text call for 3 recommendations
│   ├── emission_factors.json    # All emission factors (edit here to update)
│   ├── requirements.txt
│   └── tests/
│       ├── fixtures/
│       │   └── sample_bill.jpg
│       ├── test_api.py
│       ├── test_calculator.py
│       ├── test_extractor.py
│       └── test_recommender.py
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js           # Proxy /api → localhost:8000
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx              # API key state, routing, localStorage persistence
│       ├── index.css
│       ├── components/
│       │   ├── Sidebar.jsx      # Navigation: Dashboard, History
│       │   ├── UploadZone.jsx   # Drag-and-drop image picker
│       │   ├── ReceiptResults.jsx  # Line items table, scope badge, recommendations
│       │   └── StatCard.jsx     # Glass metric card (total CO2e, receipts, savings)
│       └── pages/
│           ├── Dashboard.jsx    # Upload flow, summary stats, recent uploads list
│           └── History.jsx      # Full session history with detail panel
└── slides/
    ├── GreenLedger_Hackathon_2026.pptx
    └── generate.cjs             # Slide deck generator script
```

---

## Architecture

```
Browser (React + Vite :5173)
        |
        |  POST /api/upload  (multipart + X-API-Key header)
        |  GET  /api/history
        v
FastAPI backend (:8000)
        |
        |-- extractor.py  ──►  Claude Haiku 4.5 Vision  (image → structured JSON)
        |-- calculator.py ──►  emission_factors.json     (JSON → CO2e kg)
        └-- recommender.py ──► Claude Haiku 4.5 Text    (context → 3 recommendations)
```

The API key travels from the browser as the `X-API-Key` request header and is passed directly to the Anthropic SDK on every call. The server holds no credentials.

The in-memory `_history` list in `main.py` is a demo convenience; it resets on every server restart. For production use, replace it with a database.

---

## Hackathon Context

GreenLedger was created by **Team Da House** for the **Earth Day Hackathon 2026** run by The Access Group in Kuala Lumpur on 22 April 2026. The brief asked for a practical tool that helps Malaysian SMEs understand and act on their environmental footprint without requiring specialist knowledge or expensive software. The entire stack — vision extraction, calculation engine, and recommendations — was designed and built within the hackathon window.

Presentation slides are in `slides/GreenLedger_Hackathon_2026.pptx`.

---

## License

This project was built for a hackathon demonstration. No production license has been applied. Contact the team before reusing any part of this codebase.
