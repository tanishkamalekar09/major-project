"""
Pydantic Schemas for Product Classification (Step 5).
"""

from typing import Optional, List
from pydantic import BaseModel, Field


class ProductClassification(BaseModel):
    """
    Structured classification result for packaged food products.
    Conforms strictly to Step 5 specifications.
    """
    category: str = Field(..., description="Determined packaged food category")
    subcategory: Optional[str] = Field(None, description="Conclusive subcategory or null")
    confidence: Optional[float] = Field(None, ge=0.0, le=1.0, description="Rule-based classification confidence")
    method: str = Field("rule_based", description="Classification method: 'rule_based' or 'insufficient_information'")

    # Debug / development details (retained in API for tracking, not exposed to UI)
    matched_keywords: Optional[List[str]] = Field(default_factory=list, description="Keywords contributing to classification")
    matched_fields: Optional[List[str]] = Field(default_factory=list, description="Fields where matching occurred")
    classification_score: Optional[float] = Field(None, description="Aggregated rule evidence score before normalization")
    selected_category: Optional[str] = Field(None, description="Selected category")
    selected_subcategory: Optional[str] = Field(None, description="Selected subcategory")
