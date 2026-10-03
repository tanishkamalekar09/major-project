from .base import BaseOCRService, OCRResult, OCRTextBlock
from .mock_ocr import MockOCRService

# When your teammate's model is ready, import their implementation here:
# from .team_ocr import TeamOCRService

def get_ocr_service() -> BaseOCRService:
    """
    Factory function returning the active OCR service.
    Currently returns the Mock OCR Service.
    When your teammate's OCR implementation is ready,
    simply return their service instance here!
    """
    return MockOCRService()

__all__ = ["BaseOCRService", "OCRResult", "OCRTextBlock", "MockOCRService", "get_ocr_service"]
