from .base import BaseOCRService, OCRResult, OCRTextBlock
from .mock_ocr import MockOCRService
from .real_ocr import RealOCRService

# Cache instance so EasyOCR models are loaded once into memory
_real_ocr_instance = None

def get_ocr_service(use_mock: bool = False) -> BaseOCRService:
    """
    Factory function returning the active OCR service.
    Returns RealOCRService (EasyOCR CRAFT + CRNN) by default.
    """
    global _real_ocr_instance
    if use_mock:
        return MockOCRService()

    if _real_ocr_instance is None:
        _real_ocr_instance = RealOCRService()

    return _real_ocr_instance

__all__ = [
    "BaseOCRService",
    "OCRResult",
    "OCRTextBlock",
    "MockOCRService",
    "RealOCRService",
    "get_ocr_service",
]
