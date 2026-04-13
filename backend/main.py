import uuid
from fastapi import FastAPI, File, UploadFile, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from extractor import extract_receipt_data
from calculator import calculate_receipt_emissions
from recommender import get_recommendations

app = FastAPI(title="GreenLedger API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store — demo only
_history: list[dict] = []

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}


@app.post("/api/upload")
async def upload_receipt(
    file: UploadFile = File(...),
    x_api_key: str = Header(None),
):
    if not x_api_key:
        raise HTTPException(status_code=400, detail="X-API-Key header is required")

    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=422,
            detail=f"Unsupported file type: {file.content_type}. Use JPEG, PNG, or WebP."
        )

    image_bytes = await file.read()

    try:
        receipt_data = extract_receipt_data(image_bytes, file.content_type, api_key=x_api_key)
        emissions = calculate_receipt_emissions(receipt_data)
        recommendations = get_recommendations(receipt_data, emissions, api_key=x_api_key)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Receipt processing failed: {str(e)}")

    record = {
        "id": str(uuid.uuid4()),
        "filename": file.filename,
        "receipt": receipt_data,
        "emissions": emissions,
        "recommendations": recommendations,
    }

    _history.insert(0, record)  # newest first

    return record


@app.get("/api/history")
async def get_history():
    return _history
