"""
Modular Image Preprocessing Pipeline for Packaged Product OCR.

Provides configurable operations:
- Safe image loading & format validation
- Resizing with aspect-ratio preservation
- Grayscale conversion
- Contrast enhancement (CLAHE)
- Denoising (Bilateral filtering to preserve character edges)
- Sharpening (Unsharp masking)
- Adaptive/Otsu binarization
- Deskewing / Rotation correction

Supports enabling/disabling individual operations to evaluate their impact on OCR accuracy.
"""

import os
import time
from typing import Dict, Any, List, Optional, Tuple
import cv2
import numpy as np


class ImagePreprocessor:
    """
    Configurable image preprocessor tailored for packaged product labels.
    """

    SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".webp", ".tiff"}

    def __init__(
        self,
        max_dimension: int = 1800,
        min_dimension: int = 600,
        use_clahe: bool = True,
        clahe_clip_limit: float = 2.0,
        clahe_tile_grid: Tuple[int, int] = (8, 8),
        denoise_method: str = "bilateral",  # 'bilateral', 'gaussian', or 'none'
        use_sharpening: bool = False,
        use_binarization: bool = False,
        use_deskew: bool = False,
    ):
        self.max_dimension = max_dimension
        self.min_dimension = min_dimension
        self.use_clahe = use_clahe
        self.clahe_clip_limit = clahe_clip_limit
        self.clahe_tile_grid = clahe_tile_grid
        self.denoise_method = denoise_method
        self.use_sharpening = use_sharpening
        self.use_binarization = use_binarization
        self.use_deskew = use_deskew

    @staticmethod
    def validate_and_load(image_path: str) -> np.ndarray:
        """
        Validate path and load image safely handling Unicode, Windows path syntax,
        empty files, and corrupted data.
        """
        if not image_path or not isinstance(image_path, str):
            raise ValueError(f"Invalid image path argument: {image_path}")

        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image file does not exist: {image_path}")

        ext = os.path.splitext(image_path)[1].lower()
        if ext not in ImagePreprocessor.SUPPORTED_EXTENSIONS:
            raise ValueError(f"Unsupported image format '{ext}'. Supported: {ImagePreprocessor.SUPPORTED_EXTENSIONS}")

        if os.path.getsize(image_path) == 0:
            raise ValueError(f"Image file is empty (0 bytes): {image_path}")

        try:
            # Safe read using np.fromfile to handle Windows non-ASCII paths
            with open(image_path, "rb") as f:
                file_bytes = np.frombuffer(f.read(), dtype=np.uint8)
                img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        except Exception as e:
            raise ValueError(f"Failed to read image file {image_path}: {e}")

        if img is None or img.size == 0:
            raise ValueError(f"Failed to decode valid image data from {image_path}. File may be corrupted.")

        return img

    def resize(self, image: np.ndarray) -> Tuple[np.ndarray, float]:
        """
        Resize image maintaining aspect ratio:
        - Downscales if max dimension exceeds max_dimension
        - Upscales small images (< min_dimension) to enhance small text OCR
        """
        h, w = image.shape[:2]
        scale = 1.0

        if max(h, w) > self.max_dimension:
            scale = self.max_dimension / float(max(h, w))
            new_w, new_h = int(w * scale), int(h * scale)
            resized = cv2.resize(image, (new_w, new_h), interpolation=cv2.INTER_AREA)
            return resized, scale
        elif max(h, w) < self.min_dimension:
            scale = 1200.0 / float(max(h, w))
            new_w, new_h = int(w * scale), int(h * scale)
            resized = cv2.resize(image, (new_w, new_h), interpolation=cv2.INTER_CUBIC)
            return resized, scale

        return image, scale

    @staticmethod
    def to_grayscale(image: np.ndarray) -> np.ndarray:
        """Convert BGR image to grayscale if not already single-channel."""
        if len(image.shape) == 2 or (len(image.shape) == 3 and image.shape[2] == 1):
            return image
        return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    def enhance_contrast(self, gray: np.ndarray) -> np.ndarray:
        """Apply CLAHE to compensate for shadows and packaging glare."""
        clahe = cv2.createCLAHE(
            clipLimit=self.clahe_clip_limit,
            tileGridSize=self.clahe_tile_grid
        )
        return clahe.apply(gray)

    def denoise(self, gray: np.ndarray) -> np.ndarray:
        """Apply edge-preserving bilateral filter or Gaussian blur."""
        if self.denoise_method == "bilateral":
            return cv2.bilateralFilter(gray, d=7, sigmaColor=50, sigmaSpace=50)
        elif self.denoise_method == "gaussian":
            return cv2.GaussianBlur(gray, (3, 3), 0)
        return gray

    @staticmethod
    def sharpen(gray: np.ndarray) -> np.ndarray:
        """Sharpen image using unsharp masking to enhance fine text strokes."""
        blurred = cv2.GaussianBlur(gray, (0, 0), 2.0)
        sharpened = cv2.addWeighted(gray, 1.5, blurred, -0.5, 0)
        return np.clip(sharpened, 0, 255).astype(np.uint8)

    @staticmethod
    def binarize(gray: np.ndarray) -> np.ndarray:
        """Otsu thresholding to separate text foreground from packaging background."""
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        return thresh

    @staticmethod
    def deskew(gray: np.ndarray, max_angle: float = 45.0) -> Tuple[np.ndarray, float]:
        """
        Detect dominant text orientation angle using minAreaRect and rotate image.
        """
        coords = np.column_stack(np.where(gray < 128))
        if coords.shape[0] < 50:
            return gray, 0.0

        angle = cv2.minAreaRect(coords)[-1]
        if angle < -45:
            angle = -(90 + angle)
        elif angle > 45:
            angle = 90 - angle

        if abs(angle) > max_angle or abs(angle) < 0.5:
            return gray, 0.0

        h, w = gray.shape[:2]
        center = (w // 2, h // 2)
        m = cv2.getRotationMatrix2D(center, angle, 1.0)
        rotated = cv2.warpAffine(gray, m, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
        return rotated, float(angle)

    def process(
        self,
        image_input: Any,
        enabled_ops: Optional[List[str]] = None,
        save_debug_path: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Run the preprocessing pipeline.

        :param image_input: File path (str) or loaded BGR numpy array.
        :param enabled_ops: Optional list of ops to run:
               ['resize', 'grayscale', 'clahe', 'denoise', 'sharpen', 'binarize', 'deskew']
               If None, uses class defaults.
        :param save_debug_path: Optional path to save intermediate output image.
        :return: Dict containing original image, preprocessed image, scale factor, and metadata.
        """
        start_time = time.perf_counter()

        # 1. Load Image
        if isinstance(image_input, str):
            orig_bgr = self.validate_and_load(image_input)
        elif isinstance(image_input, np.ndarray):
            orig_bgr = image_input.copy()
        else:
            raise TypeError(f"Expected str or np.ndarray for image_input, got {type(image_input)}")

        orig_h, orig_w = orig_bgr.shape[:2]
        current_img = orig_bgr
        scale_factor = 1.0
        applied_ops: List[str] = []

        ops = enabled_ops if enabled_ops is not None else [
            "resize",
            "grayscale",
            "clahe" if self.use_clahe else None,
            "denoise" if self.denoise_method != "none" else None,
            "sharpen" if self.use_sharpening else None,
            "binarize" if self.use_binarization else None,
            "deskew" if self.use_deskew else None,
        ]
        ops = [op for op in ops if op]

        # 2. Resize
        if "resize" in ops:
            current_img, scale_factor = self.resize(current_img)
            applied_ops.append(f"resize(scale={scale_factor:.2f})")

        # 3. Grayscale
        if "grayscale" in ops:
            current_img = self.to_grayscale(current_img)
            applied_ops.append("grayscale")

        # 4. Contrast enhancement (CLAHE)
        if "clahe" in ops and len(current_img.shape) == 2:
            current_img = self.enhance_contrast(current_img)
            applied_ops.append("clahe")

        # 5. Denoise
        if "denoise" in ops and len(current_img.shape) == 2:
            current_img = self.denoise(current_img)
            applied_ops.append(f"denoise({self.denoise_method})")

        # 6. Sharpen
        if "sharpen" in ops and len(current_img.shape) == 2:
            current_img = self.sharpen(current_img)
            applied_ops.append("sharpen")

        # 7. Binarize
        if "binarize" in ops and len(current_img.shape) == 2:
            current_img = self.binarize(current_img)
            applied_ops.append("binarize")

        # 8. Deskew
        if "deskew" in ops and len(current_img.shape) == 2:
            current_img, rot_angle = self.deskew(current_img)
            if rot_angle != 0.0:
                applied_ops.append(f"deskew({rot_angle:.1f}deg)")

        elapsed_ms = (time.perf_counter() - start_time) * 1000.0

        if save_debug_path:
            os.makedirs(os.path.dirname(os.path.abspath(save_debug_path)), exist_ok=True)
            cv2.imwrite(save_debug_path, current_img)

        return {
            "original_image": orig_bgr,
            "preprocessed_image": current_img,
            "scale_factor": scale_factor,
            "original_shape": (orig_h, orig_w),
            "processed_shape": current_img.shape[:2],
            "applied_ops": applied_ops,
            "processing_time_ms": elapsed_ms
        }
