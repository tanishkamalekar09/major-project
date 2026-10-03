"""
AI OCR Module for Packaged Product Compliance & Verification System.
"""

from .preprocessing import ImagePreprocessor
from .ocr_engine import OCREngine
from .visualization import OCRVisualizer
from .evaluation import evaluate_sample, calculate_cer, calculate_wer

__all__ = [
    "ImagePreprocessor",
    "OCREngine",
    "OCRVisualizer",
    "evaluate_sample",
    "calculate_cer",
    "calculate_wer",
]
