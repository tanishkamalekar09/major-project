"""
OCR Engine Module for Packaged Product Compliance & Verification.

Encapsulates text detection (CRAFT) and recognition (CRNN) using EasyOCR.
Returns standardized structured data: text, confidence, and bounding boxes.
"""

import time
from typing import List, Dict, Any, Union, Optional
import numpy as np
import easyocr
import torch


class OCREngine:
    """
    Standardized OCR Engine wrapper.
    """

    def __init__(
        self,
        languages: Optional[List[str]] = None,
        gpu: Optional[bool] = None,
        model_storage_directory: Optional[str] = None,
    ):
        """
        Initialize the OCR engine.

        :param languages: Language list. Defaults to ['en'].
        :param gpu: Whether to use CUDA GPU. If None, auto-detected.
        :param model_storage_directory: Optional cache dir for weights.
        """
        self.languages = languages or ["en"]
        self.gpu = torch.cuda.is_available() if gpu is None else gpu

        # Initialize EasyOCR reader
        self.reader = easyocr.Reader(
            lang_list=self.languages,
            gpu=self.gpu,
            model_storage_directory=model_storage_directory,
            verbose=False,
        )

    def detect_and_recognize(
        self,
        image_input: Union[str, np.ndarray],
        min_confidence: float = 0.20,
        scale_factor: float = 1.0,
    ) -> Dict[str, Any]:
        """
        Perform text detection and recognition on the input image.

        :param image_input: File path (str) or loaded OpenCV image (np.ndarray).
        :param min_confidence: Confidence cutoff threshold [0.0, 1.0].
        :param scale_factor: Scaling applied during preprocessing to map bboxes back to original image space.
        :return: Dict containing:
                 "results": List of formatted detection dicts:
                            [
                              {
                                "text": "MRP Rs. 249",
                                "confidence": 0.94,
                                "bbox": [120, 240, 360, 290],
                                "polygon": [[x1, y1], [x2, y2], [x3, y3], [x4, y4]]
                              }
                            ],
                 "ocr_time_ms": execution time in milliseconds,
                 "total_detected": count of valid detections
        """
        start_time = time.perf_counter()

        if image_input is None:
            return {"results": [], "ocr_time_ms": 0.0, "total_detected": 0}

        if isinstance(image_input, np.ndarray) and image_input.size == 0:
            return {"results": [], "ocr_time_ms": 0.0, "total_detected": 0}

        try:
            raw_results = self.reader.readtext(image_input)
        except Exception as e:
            # Handle potential internal errors (e.g., zero-dimension boxes) gracefully
            return {
                "results": [],
                "ocr_time_ms": (time.perf_counter() - start_time) * 1000.0,
                "total_detected": 0,
                "error": str(e),
            }

        inv_scale = 1.0 / scale_factor if (scale_factor != 1.0 and scale_factor > 0) else 1.0

        formatted_results: List[Dict[str, Any]] = []

        for bbox_pts, text, confidence in raw_results:
            cleaned_text = text.strip()
            if not cleaned_text:
                continue

            conf_val = float(round(confidence, 4))
            if conf_val < min_confidence:
                continue

            # Convert bbox points to integer coordinates mapped back to original image
            scaled_poly = [
                [int(round(float(pt[0]) * inv_scale)), int(round(float(pt[1]) * inv_scale))]
                for pt in bbox_pts
            ]
            xs = [pt[0] for pt in scaled_poly]
            ys = [pt[1] for pt in scaled_poly]
            xmin, ymin, xmax, ymax = min(xs), min(ys), max(xs), max(ys)

            formatted_results.append({
                "text": cleaned_text,
                "confidence": conf_val,
                "bbox": [xmin, ymin, xmax, ymax],
                "polygon": scaled_poly,
            })

        ocr_time_ms = (time.perf_counter() - start_time) * 1000.0

        return {
            "results": formatted_results,
            "ocr_time_ms": ocr_time_ms,
            "total_detected": len(formatted_results),
        }
