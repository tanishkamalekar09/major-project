"""
Real OCR Service implementation for ReguCheck AI Backend.

Integrates the EasyOCR (CRAFT + CRNN) pipeline developed in ai/ocr.
"""

import sys
import os
import base64
import time
from pathlib import Path
from typing import Optional, List, Dict
import cv2
import numpy as np

# Ensure project root is in sys.path so ai.ocr can be imported
REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from .base import BaseOCRService, OCRResult, OCRTextBlock
from ai.ocr.preprocessing import ImagePreprocessor
from ai.ocr.ocr_engine import OCREngine
from ai.ocr.visualization import OCRVisualizer


class RealOCRService(BaseOCRService):
    """
    Production OCR service using EasyOCR and modular image preprocessing.
    """

    def __init__(self):
        print("[Backend OCR Service] Initializing Real OCR Engine (EasyOCR)...")
        self.ocr_engine = OCREngine(languages=["en"])
        self.preprocessor = ImagePreprocessor()
        self.visualizer = OCRVisualizer()
        print("[Backend OCR Service] Real OCR Engine ready.")

    def process_image(self, image_bytes: bytes) -> OCRResult:
        """
        Process binary image data, run preprocessing, detect/recognize text,
        generate annotated image overlay, and return standardized OCRResult.
        """
        start_time = time.perf_counter()

        if not image_bytes or len(image_bytes) == 0:
            raise ValueError("Empty image data received.")

        # Decode image from memory
        nparr = np.frombuffer(image_bytes, np.uint8)
        img_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img_bgr is None or img_bgr.size == 0:
            raise ValueError("Could not decode valid image from provided file bytes.")

        h, w = img_bgr.shape[:2]

        # 1. Modular Preprocessing
        prep_data = self.preprocessor.process(img_bgr)
        scale_factor = prep_data["scale_factor"]
        preprocessed_img = prep_data["preprocessed_image"]

        # 2. OCR Text Detection & Recognition
        ocr_response = self.ocr_engine.detect_and_recognize(
            preprocessed_img,
            min_confidence=0.20,
            scale_factor=scale_factor,
        )
        detected_items = ocr_response.get("results", [])

        # 3. Generate Annotated Image
        annotated_bgr = self.visualizer.draw_annotations(
            img_bgr,
            detected_items,
            show_confidence=True
        )

        # Convert annotated and original images to base64 data URLs for seamless web display
        _, buffer_ann = cv2.imencode(".jpg", annotated_bgr, [cv2.IMWRITE_JPEG_QUALITY, 88])
        annotated_b64 = f"data:image/jpeg;base64,{base64.b64encode(buffer_ann).decode('utf-8')}"

        _, buffer_orig = cv2.imencode(".jpg", img_bgr, [cv2.IMWRITE_JPEG_QUALITY, 85])
        orig_b64 = f"data:image/jpeg;base64,{base64.b64encode(buffer_orig).decode('utf-8')}"

        # 4. Format Blocks
        blocks: List[OCRTextBlock] = []
        raw_lines: List[str] = []

        for idx, item in enumerate(detected_items, 1):
            text = item["text"]
            conf = item["confidence"]
            bbox = item["bbox"]  # [xmin, ymin, xmax, ymax]
            raw_lines.append(text)

            xmin, ymin, xmax, ymax = bbox
            box_percent = {
                "x": round(max(0.0, float(xmin) / w * 100), 2),
                "y": round(max(0.0, float(ymin) / h * 100), 2),
                "w": round(min(100.0, float(xmax - xmin) / w * 100), 2),
                "h": round(min(100.0, float(ymax - ymin) / h * 100), 2),
            }

            blocks.append(OCRTextBlock(
                id=f"ocr-block-{idx}",
                text=text,
                confidence=conf,
                bounding_box=[float(c) for c in bbox],
                box=box_percent,
            ))

        total_elapsed_ms = (time.perf_counter() - start_time) * 1000.0

        return OCRResult(
            raw_text="\n".join(raw_lines),
            blocks=blocks,
            engine_name="EasyOCR (PyTorch CRAFT + CRNN)",
            annotated_image=annotated_b64,
            original_image=orig_b64,
            processing_time_ms=round(total_elapsed_ms, 1),
        )
