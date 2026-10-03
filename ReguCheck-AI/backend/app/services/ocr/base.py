from abc import ABC, abstractmethod
from typing import List, Optional
from pydantic import BaseModel, Field

class OCRTextBlock(BaseModel):
    """Represents a detected block or line of text from an image."""
    text: str
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)
    bounding_box: Optional[List[float]] = None  # [x_min, y_min, x_max, y_max] or polygon points

class OCRResult(BaseModel):
    """
    Standardized output format for OCR services.
    Whether using Mock OCR or your teammate's actual OCR model,
    the output will always conform to this structure.
    """
    raw_text: str
    blocks: List[OCRTextBlock] = []
    engine_name: str = "mock-ocr"

class BaseOCRService(ABC):
    """
    Abstract Base Class for OCR Services.
    
    HOW TO PLUG IN YOUR TEAMMATE'S MODEL LATER:
    1. Create a new file (e.g. `team_ocr.py`) in this folder.
    2. Define a class that inherits from `BaseOCRService`.
    3. Implement `process_image` to call your teammate's model and return `OCRResult`.
    4. Switch the active service in `services/ocr/__init__.py`.
    """

    @abstractmethod
    def process_image(self, image_bytes: bytes) -> OCRResult:
        """
        Process raw image bytes and return standardized OCRResult.
        
        Args:
            image_bytes: The binary content of the uploaded product image.
            
        Returns:
            OCRResult containing extracted raw text and text blocks.
        """
        pass
