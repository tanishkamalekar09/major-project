"""
Visualization Module for Packaged Product OCR.

Renders bounding boxes and detected text with confidence badges on packaging images.
Saves annotated images to disk.
"""

import os
from typing import List, Dict, Any, Optional
import cv2
import numpy as np


class OCRVisualizer:
    """
    Renders high-visibility annotations on product images.
    """

    def __init__(
        self,
        box_color: tuple = (0, 220, 100),       # Vibrant Emerald Green / Teal
        badge_bg_color: tuple = (20, 24, 30),   # Dark charcoal
        text_color: tuple = (255, 255, 255),    # Crisp white
        badge_border_color: tuple = (0, 220, 100),
    ):
        self.box_color = box_color
        self.badge_bg_color = badge_bg_color
        self.text_color = text_color
        self.badge_border_color = badge_border_color

    def draw_annotations(
        self,
        image: np.ndarray,
        ocr_results: List[Dict[str, Any]],
        show_confidence: bool = True,
        output_path: Optional[str] = None,
    ) -> np.ndarray:
        """
        Draw bounding boxes and detected text labels onto the image.

        :param image: BGR numpy image.
        :param ocr_results: List of result dicts containing 'bbox', 'text', 'confidence', 'polygon'.
        :param show_confidence: Whether to append percentage confidence to label badge.
        :param output_path: Optional path to save the annotated image file.
        :return: Annotated BGR numpy image.
        """
        if image is None:
            raise ValueError("Cannot annotate None image.")

        annotated = image.copy()
        h, w = annotated.shape[:2]
        base_dim = max(h, w)

        # Scale line thickness and font size based on image resolution
        thickness = max(2, int(base_dim / 750))
        font_scale = max(0.40, base_dim / 1800.0)

        for item in ocr_results:
            text = item.get("text", "").strip()
            conf = item.get("confidence", 0.0)
            polygon = item.get("polygon")
            bbox = item.get("bbox", [0, 0, 0, 0])

            # Draw polygon if available, else rectangle
            if polygon and len(polygon) >= 4:
                pts = np.array(polygon, np.int32).reshape((-1, 1, 2))
                cv2.polylines(annotated, [pts], isClosed=True, color=self.box_color, thickness=thickness)
            else:
                x1, y1, x2, y2 = bbox
                cv2.rectangle(annotated, (x1, y1), (x2, y2), self.box_color, thickness=thickness)

            # Construct label
            label = f"{text} ({int(conf * 100)}%)" if show_confidence else text

            # Label dimensions
            (tw, th), baseline = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, font_scale, thickness=1)

            xmin, ymin, xmax, ymax = bbox if bbox else (0, 0, 0, 0)
            if polygon:
                xs = [p[0] for p in polygon]
                ys = [p[1] for p in polygon]
                xmin, ymin = min(xs), min(ys)

            # Position badge above text if room allows, otherwise below
            badge_y1 = max(0, ymin - th - baseline - 6)
            badge_y2 = ymin
            badge_x1 = max(0, xmin)
            badge_x2 = min(w - 1, xmin + tw + 8)

            if badge_y1 == 0:  # If close to top edge, flip badge downward
                badge_y1 = ymax
                badge_y2 = min(h - 1, ymax + th + baseline + 6)

            # Draw background pill and border
            cv2.rectangle(annotated, (badge_x1, badge_y1), (badge_x2, badge_y2), self.badge_bg_color, cv2.FILLED)
            cv2.rectangle(annotated, (badge_x1, badge_y1), (badge_x2, badge_y2), self.badge_border_color, 1)

            # Draw text inside badge
            text_y = badge_y2 - baseline - 3 if badge_y1 < ymin else badge_y1 + th + 2
            cv2.putText(
                annotated,
                label,
                (badge_x1 + 4, text_y),
                cv2.FONT_HERSHEY_SIMPLEX,
                font_scale,
                self.text_color,
                thickness=1,
                lineType=cv2.LINE_AA,
            )

        if output_path:
            os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
            with open(output_path, "wb") as f:
                success, encoded_img = cv2.imencode(".jpg", annotated)
                if success:
                    f.write(encoded_img.tobytes())

        return annotated
