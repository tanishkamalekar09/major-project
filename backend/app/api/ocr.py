"""
OCR Endpoints for ReguCheck AI Backend.

Provides:
- POST /api/v1/ocr/upload: Upload image file and run EasyOCR detection, recognition & visualization.
- GET  /api/v1/ocr/sample-presets: List pre-loaded academic test images.
- POST /api/v1/ocr/sample-preset/{sample_id}: Run OCR on a pre-loaded sample image.
"""

import os
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from pydantic import BaseModel

from ..services.ocr import get_ocr_service, OCRResult
from ..services.extraction import InformationExtractor, OCRInfo, ProductInformation, ExtractedField
from ..services.classification import ProductClassifier

router = APIRouter(prefix="/ocr", tags=["OCR Text Extraction"])

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
SAMPLE_DIR = REPO_ROOT / "data" / "ocr_test" / "raw"


@router.post("/upload", response_model=OCRResult)
@router.post("/analyze", response_model=OCRResult)
async def upload_and_process_ocr(
    file: UploadFile = File(..., description="Packaged product image file (JPG, PNG, WebP)"),
    use_mock: bool = Query(False, description="Whether to use Mock OCR instead of Real OCR")
):
    """
    Upload a packaged product image.
    Executes preprocessing, EasyOCR CRAFT detection, CRNN text recognition,
    generates bounding boxes, confidence scores, and annotated visualization.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded.")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Supported formats: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    try:
        content = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read uploaded file: {str(e)}")

    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty (0 bytes).")

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail=f"File exceeds maximum allowed size of 25MB.")

    try:
        ocr_service = get_ocr_service(use_mock=use_mock)
        result = ocr_service.process_image(content)

        # STEP 4: Information Extraction from OCR output
        extractor = InformationExtractor()
        result.product_information = extractor.extract(result.blocks, result.raw_text)
        result.ocr = OCRInfo(
            text=[b.text for b in result.blocks],
            confidence=[b.confidence for b in result.blocks],
            bounding_boxes=[b.bounding_box or b.box for b in result.blocks]
        )

        # STEP 5: Product Classification
        classifier = ProductClassifier()
        result.classification = classifier.classify(
            ocr_result=result,
            product_information=result.product_information
        )
        if result.classification and result.classification.category != "Unknown" and result.product_information:
            result.product_information.product_category = ExtractedField(
                value=result.classification.category,
                confidence=result.classification.confidence,
                source_text=", ".join(result.classification.matched_keywords or []) or result.classification.category
            )

        return result
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as err:
        raise HTTPException(
            status_code=500,
            detail=f"Internal error during OCR processing: {str(err)}"
        )


@router.get("/sample-presets")
def get_sample_presets():
    """
    Returns available pre-loaded academic test packaging samples for 1-click testing.
    """
    presets = [
        {"id": "product_01", "name": "Britannia Good Day Butter Cookies", "category": "Biscuits / Carton", "file": "product_01.jpg"},
        {"id": "product_11_chips", "name": "Lay's Magic Masala Potato Chips", "category": "Packaged Snacks / Pouch", "file": "product_11_chips.jpg"},
        {"id": "product_02", "name": "Haldiram's Aloo Bhujia", "category": "Packaged Snacks / Pouch", "file": "product_02.jpg"},
        {"id": "product_08", "name": "Maggi 2-Minute Masala Noodles", "category": "Noodles / Pasta / Pouch", "file": "product_08.jpg"},
        {"id": "product_09", "name": "Himalayan Natural Mineral Water", "category": "Beverages / Bottle", "file": "product_09.jpg"},
        {"id": "product_03", "name": "Parachute 100% Pure Coconut Oil", "category": "Edible Oils / Bottle", "file": "product_03.jpg"},
        {"id": "product_07", "name": "Amul Taaza Toned Milk", "category": "Dairy Products / Tetra Pak", "file": "product_07.jpg"},
        {"id": "product_12_spice", "name": "Everest Pure Turmeric Powder Spice", "category": "Spices / Masala / Carton", "file": "product_12_spice.jpg"},
        {"id": "product_13_cereal", "name": "Kellogg's Corn Flakes Breakfast Cereal", "category": "Breakfast Cereals / Carton", "file": "product_13_cereal.jpg"},
        {"id": "product_14_sauce", "name": "Kissan Fresh Tomato Ketchup Sauce", "category": "Sauces / Spreads / Bottle", "file": "product_14_sauce.jpg"},
        {"id": "product_15_bakery", "name": "Britannia 100% Whole Wheat Bread", "category": "Bakery Products / Wrapper", "file": "product_15_bakery.jpg"},
        {"id": "product_16_sweets", "name": "Cadbury Dairy Milk Chocolate Sweet", "category": "Packaged Sweets / Flow Wrap", "file": "product_16_sweets.jpg"},
        {"id": "product_04", "name": "Dabur 100% Pure Natural Honey", "category": "Other Packaged Food / Jar", "file": "product_04.jpg"},
        {"id": "product_05", "name": "Tata Salt Vacuum Evaporated", "category": "Other Packaged Food / Pouch", "file": "product_05.jpg"},
        {"id": "product_17_poor_ocr", "name": "Degraded Packaging (Poor OCR Test)", "category": "Edge Case / Degraded", "file": "product_17_poor_ocr.jpg"},
        {"id": "product_18_missing_name", "name": "No Product Name (Incomplete Packaging)", "category": "Edge Case / Missing Field", "file": "product_18_missing_name.jpg"},
        {"id": "product_19_unknown", "name": "Stanley Screwdriver Hardware Set", "category": "Unknown / Non-Food", "file": "product_19_unknown.jpg"},
        {"id": "product_06", "name": "Dettol Original Liquid Handwash", "category": "Unknown / Non-Food Hygiene", "file": "product_06.jpg"},
        {"id": "product_10", "name": "Himalaya Purifying Neem Face Wash", "category": "Unknown / Non-Food Cosmetic", "file": "product_10.jpg"},
        {"id": "blank_image", "name": "Blank Empty Image (0 Text)", "category": "Edge Case / Empty", "file": "blank_image.jpg"},
    ]
    return {"presets": presets}


@router.post("/sample-preset/{sample_id}", response_model=OCRResult)
def process_preset_sample(
    sample_id: str,
    use_mock: bool = Query(False, description="Whether to use Mock OCR instead of Real OCR")
):
    """
    Run OCR directly on one of the pre-loaded academic test packaging samples.
    """
    filename = f"{sample_id}.jpg" if not sample_id.endswith(".jpg") else sample_id
    sample_path = SAMPLE_DIR / filename

    if not sample_path.exists():
        raise HTTPException(status_code=404, detail=f"Preset sample '{sample_id}' not found.")

    with open(sample_path, "rb") as f:
        content = f.read()

    try:
        ocr_service = get_ocr_service(use_mock=use_mock)
        result = ocr_service.process_image(content)

        # STEP 4: Information Extraction from OCR output
        extractor = InformationExtractor()
        result.product_information = extractor.extract(result.blocks, result.raw_text)
        result.ocr = OCRInfo(
            text=[b.text for b in result.blocks],
            confidence=[b.confidence for b in result.blocks],
            bounding_boxes=[b.bounding_box or b.box for b in result.blocks]
        )

        # STEP 5: Product Classification
        classifier = ProductClassifier()
        result.classification = classifier.classify(
            ocr_result=result,
            product_information=result.product_information
        )
        if result.classification and result.classification.category != "Unknown" and result.product_information:
            result.product_information.product_category = ExtractedField(
                value=result.classification.category,
                confidence=result.classification.confidence,
                source_text=", ".join(result.classification.matched_keywords or []) or result.classification.category
            )

        return result
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Error processing preset: {str(err)}")
