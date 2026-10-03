from fastapi import FastAPI, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .services.ocr import get_ocr_service

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for ReguCheck AI - Packaged Product Compliance Screening",
    version="0.1.0",
)

# Configure CORS so the React Vite frontend can communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "Welcome to ReguCheck AI API",
        "status": "online",
        "docs_url": "/docs"
    }

@app.get("/api/v1/health")
def health_check():
    return {"status": "ok", "service": "ReguCheck AI Backend"}

from .api.ocr import router as ocr_router, upload_and_process_ocr
from .services.ocr import OCRResult

app.include_router(ocr_router, prefix="/api/v1")

@app.post("/api/v1/analyze", response_model=OCRResult)
@app.post("/api/analyze", response_model=OCRResult)
async def analyze_alias(
    file: UploadFile = File(..., description="Packaged product image file"),
    use_mock: bool = Query(False, description="Whether to use Mock OCR instead of Real OCR")
):
    return await upload_and_process_ocr(file=file, use_mock=use_mock)

@app.post("/api/v1/ocr/test-mock")
def test_mock_ocr():
    """
    Test endpoint to verify the OCR Service Abstraction with Mock OCR.
    """
    ocr_service = get_ocr_service(use_mock=True)
    # Passing empty bytes just to demonstrate the mock output
    result = ocr_service.process_image(b"")
    return {
        "engine": result.engine_name,
        "raw_text": result.raw_text,
        "total_blocks": len(result.blocks)
    }
