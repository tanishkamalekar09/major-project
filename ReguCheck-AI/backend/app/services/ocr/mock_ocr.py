from typing import List
from .base import BaseOCRService, OCRResult, OCRTextBlock

class MockOCRService(BaseOCRService):
    """
    Mock OCR Service for development and testing.
    Simulates text extracted from a typical packaged food label
    so frontend and backend workflows can be built and tested
    without waiting for the real OCR model to be ready.
    """

    def process_image(self, image_bytes: bytes) -> OCRResult:
        # Simulated lines detected from a packaged food label
        sample_lines: List[str] = [
            "NUTRI-CRUNCH ALMOND GRANOLA",
            "Net Weight: 250 g",
            "Ingredients: Rolled Oats, Almonds (15%), Honey, Chia Seeds, Palm Oil, Cocoa Solids.",
            "Allergen Advice: Contains Tree Nuts (Almonds). Produced in a facility handling wheat and soy.",
            "Nutritional Facts per 100g:",
            "Energy: 450 kcal | Protein: 12g | Carbohydrates: 62g | Added Sugars: 14g | Total Fat: 18g | Sodium: 110mg",
            "Batch No: NC-2026-08A",
            "Mfg Date: 15/01/2026",
            "Best Before: 9 Months from Manufacture",
            "MRP: Rs. 199.00 (Incl. of all taxes)",
            "FSSAI Lic. No.: 10019022009876",
            "Manufactured by: GreenPeak Foods Pvt Ltd, Industrial Area, Pune 411028",
            "Customer Care: care@greenpeakfoods.com | 1800-200-3000"
        ]

        blocks = [
            OCRTextBlock(
                text=line,
                confidence=0.97,
                bounding_box=[10.0, float(i * 30), 400.0, float(i * 30 + 25)]
            )
            for i, line in enumerate(sample_lines)
        ]

        raw_text = "\n".join(sample_lines)

        return OCRResult(
            raw_text=raw_text,
            blocks=blocks,
            engine_name="mock-ocr-v1"
        )
