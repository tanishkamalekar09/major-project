"""
Pydantic Schemas for Information Extraction (Step 4).
"""

from typing import Optional, List, Any
from pydantic import BaseModel, Field


class ExtractedField(BaseModel):
    """
    Representation of an individual extracted product packaging field.
    Retains extracted value, confidence score, and source OCR text.
    """
    value: Optional[str] = Field(None, description="Normalized field value (e.g. '₹50', '200 g')")
    confidence: Optional[float] = Field(None, ge=0.0, le=1.0, description="Extraction confidence score")
    source_text: Optional[str] = Field(None, description="Original un-normalized OCR text snippet")


class ProductInformation(BaseModel):
    """
    Structured information extracted from packaged food product OCR text.
    Any field that cannot be detected defaults to None (serialized as null).
    """
    product_name: Optional[ExtractedField] = None
    brand_name: Optional[ExtractedField] = None
    mrp: Optional[ExtractedField] = None
    net_quantity: Optional[ExtractedField] = None
    manufacturer: Optional[ExtractedField] = None
    manufacturing_date: Optional[ExtractedField] = None
    best_before: Optional[ExtractedField] = None
    expiry_date: Optional[ExtractedField] = None
    batch_number: Optional[ExtractedField] = None
    fssai_license_number: Optional[ExtractedField] = None
    ingredients: Optional[ExtractedField] = None
    consumer_care: Optional[ExtractedField] = None
    country_of_origin: Optional[ExtractedField] = None
    product_category: Optional[ExtractedField] = None


class OCRInfo(BaseModel):
    """
    Structured summary of raw OCR output for Step 3/Step 4 compatibility.
    """
    text: List[str] = []
    confidence: List[float] = []
    bounding_boxes: List[Any] = []
