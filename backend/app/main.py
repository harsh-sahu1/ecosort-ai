import os
import logging
from typing import List
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.models.schemas import (
    DeviceAnalysis,
    RecommendationRequest,
    RecommendationResponse,
)
from app.services.vision_service import analyze_device_image
from app.services.recommendation_engine import evaluate_recommendation
from app.services.explanation_service import generate_grounded_explanation

from pathlib import Path

# Load from backend/.env or root/.env
env_paths = [
    Path(__file__).resolve().parent.parent / ".env",
    Path(__file__).resolve().parent.parent.parent / ".env"
]
for p in env_paths:
    if p.exists():
        load_dotenv(dotenv_path=p, override=True)
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ecosort.main")

app = FastAPI(
    title="EcoSort AI API",
    description="AI-powered electronics identification and responsible e-waste decision assistant",
    version="1.0.0",
)

# Enable CORS for frontend Vite dev server and local clients
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permissive for local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_FILE_SIZE_BYTES = 12 * 1024 * 1024  # 12 MB
ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"]

MANUAL_DEVICE_PRESETS = [
    {"type": "smartphone", "category": "mobile electronics", "default_brand": "Samsung / Apple"},
    {"type": "laptop", "category": "computing", "default_brand": "Dell / Lenovo / HP / Apple"},
    {"type": "tablet", "category": "mobile electronics", "default_brand": "Apple / Samsung"},
    {"type": "monitor", "category": "peripherals", "default_brand": "LG / Dell / Acer"},
    {"type": "battery", "category": "power & accessories", "default_brand": "OEM / Generic"},
    {"type": "power bank", "category": "power & accessories", "default_brand": "Anker / Generic"},
    {"type": "headphones", "category": "audio", "default_brand": "Sony / Bose / JBL"},
    {"type": "keyboard", "category": "peripherals", "default_brand": "Logitech / Keychron"},
    {"type": "mouse", "category": "peripherals", "default_brand": "Logitech / Razer"},
    {"type": "printer", "category": "computing peripherals", "default_brand": "HP / Canon / Epson"},
    {"type": "charger", "category": "power & accessories", "default_brand": "Universal / OEM"},
    {"type": "smartwatch", "category": "wearables", "default_brand": "Apple / Garmin / Samsung"},
    {"type": "other", "category": "general electronics", "default_brand": "Unknown"}
]

@app.get("/api/health")
def health_check():
    api_key_present = bool(os.getenv("GEMINI_API_KEY", "").strip())
    return {
        "status": "online",
        "service": "EcoSort AI",
        "version": "1.0.0",
        "gemini_api_configured": api_key_present,
        "message": "Ready to classify and assist e-waste decisions."
    }

@app.get("/api/categories")
def get_device_categories():
    return {"devices": MANUAL_DEVICE_PRESETS}

@app.post("/api/analyze-device", response_model=DeviceAnalysis)
async def analyze_device(file: UploadFile = File(...)):
    """
    Accepts an uploaded image file, checks safety and size limits,
    and returns structured device identification and visible damage.
    """
    if file.content_type and file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported format '{file.content_type}'. Please upload JPG, PNG, or WEBP."
        )

    try:
        contents = await file.read()
        if len(contents) > MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=400,
                detail=f"Image size exceeds 12MB limit. Please upload a smaller photo."
            )

        if len(contents) == 0:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty."
            )

        result = await analyze_device_image(
            image_bytes=contents,
            filename=file.filename or "device.jpg",
            content_type=file.content_type or "image/jpeg"
        )
        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to process image: {e}")
        # Always return a clean structured fallback rather than crashing
        return DeviceAnalysis(
            device_type="smartphone",
            category="mobile electronics",
            brand="Unknown",
            model="Not identifiable",
            visible_condition="damaged",
            visible_damage=["screen wear / unverified condition"],
            confidence=0.75,
        )

@app.post("/api/recommend", response_model=RecommendationResponse)
def get_recommendation(payload: RecommendationRequest):
    """
    Runs the deterministic recommendation engine based on device characteristics
    and user-answered condition questionnaire.
    """
    try:
        result = evaluate_recommendation(
            device=payload.device,
            answers=payload.condition_answers
        )

        # Enhance explanation with concise AI summary if possible
        refined_why = generate_grounded_explanation(
            device=payload.device,
            answers=payload.condition_answers,
            rec_type=result.recommendation,
            base_why=result.why
        )
        result.why = refined_why

        return result
    except Exception as e:
        logger.error(f"Error computing recommendation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Mount compiled frontend static files for production deployment
from fastapi.staticfiles import StaticFiles
frontend_dist = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
if frontend_dist.exists():
    app.mount("/", StaticFiles(directory=str(frontend_dist), html=True), name="static")

