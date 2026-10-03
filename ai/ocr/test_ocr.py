"""
Test and Runner CLI for Packaged Product OCR Module.

Usage:
  # Test a single image:
  python -m ai.ocr.test_ocr --image data/ocr_test/raw/product_01.jpg

  # Compare Original vs Preprocessed OCR:
  python -m ai.ocr.test_ocr --image data/ocr_test/raw/product_01.jpg --compare-preprocessing

  # Run full benchmark across all 10 test dataset images:
  python -m ai.ocr.test_ocr --benchmark-all

  # Run error-handling edge case tests:
  python -m ai.ocr.test_ocr --test-edge-cases
"""

import os
import sys
import json
import argparse
import time
from pathlib import Path
from typing import Dict, Any, List

# Ensure repository root is on sys.path
REPO_ROOT = Path(__file__).resolve().parent.parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

import cv2
from ai.ocr.preprocessing import ImagePreprocessor
from ai.ocr.ocr_engine import OCREngine
from ai.ocr.visualization import OCRVisualizer
from ai.ocr.evaluation import evaluate_sample


def parse_arguments():
    parser = argparse.ArgumentParser(
        description="Packaged Product OCR Module Test & Benchmark Suite"
    )
    parser.add_argument(
        "--image",
        type=str,
        default=str(REPO_ROOT / "data" / "ocr_test" / "raw" / "product_01.jpg"),
        help="Path to input packaged product image",
    )
    parser.add_argument(
        "--output-dir",
        type=str,
        default=str(REPO_ROOT / "outputs" / "ocr"),
        help="Directory to save annotated images and results",
    )
    parser.add_argument(
        "--min-confidence",
        type=float,
        default=0.20,
        help="Minimum confidence threshold (0.0 - 1.0)",
    )
    parser.add_argument(
        "--no-preprocess",
        action="store_true",
        help="Bypass preprocessing and run OCR directly on raw image",
    )
    parser.add_argument(
        "--compare-preprocessing",
        action="store_true",
        help="Run both Raw vs Preprocessed OCR and compare results",
    )
    parser.add_argument(
        "--benchmark-all",
        action="store_true",
        help="Run comprehensive benchmark over all 10 dataset images with ground-truth evaluation",
    )
    parser.add_argument(
        "--test-edge-cases",
        action="store_true",
        help="Run error handling validation (blank, corrupted, missing files)",
    )
    return parser.parse_args()


def process_single_image(
    image_path: str,
    output_dir: str,
    ocr_engine: OCREngine,
    preprocessor: ImagePreprocessor,
    visualizer: OCRVisualizer,
    min_confidence: float = 0.20,
    use_preprocessing: bool = True,
    save_outputs: bool = True,
) -> Dict[str, Any]:
    """Process a single product image through preprocessing and OCR."""
    print("=" * 55)
    print("OCR PIPELINE EXECUTION")
    print("=" * 55)
    print(f"[*] Input Image     : {image_path}")
    print(f"[*] Preprocessing   : {'Enabled' if use_preprocessing else 'Disabled (Raw)'}")
    print(f"[*] Min Confidence  : {min_confidence}")
    print("-" * 55)

    # 1. Validation & Loading
    try:
        raw_bgr = preprocessor.validate_and_load(image_path)
    except Exception as e:
        print(f"[ERROR] Failed to load image: {e}")
        return {"error": str(e), "results": []}

    orig_h, orig_w = raw_bgr.shape[:2]
    print(f"[1/4] Loaded image ({orig_w}x{orig_h} px)")

    # 2. Preprocessing
    prep_time = 0.0
    scale_factor = 1.0
    if use_preprocessing:
        base_name = Path(image_path).stem
        debug_prep_path = os.path.join(output_dir, f"{base_name}_preprocessed.jpg") if save_outputs else None
        prep_data = preprocessor.process(raw_bgr, save_debug_path=debug_prep_path)
        ocr_input = prep_data["preprocessed_image"]
        scale_factor = prep_data["scale_factor"]
        prep_time = prep_data["processing_time_ms"]
        print(f"[2/4] Preprocessing finished in {prep_time:.1f}ms (Applied: {', '.join(prep_data['applied_ops'])})")
    else:
        ocr_input = raw_bgr
        print("[2/4] Preprocessing bypassed (Using raw BGR image)")

    # 3. OCR Detection & Recognition
    ocr_res = ocr_engine.detect_and_recognize(
        ocr_input,
        min_confidence=min_confidence,
        scale_factor=scale_factor,
    )
    results = ocr_res.get("results", [])
    ocr_time = ocr_res.get("ocr_time_ms", 0.0)
    print(f"[3/4] OCR completed in {ocr_time:.1f}ms ({len(results)} text regions detected)")

    # 4. Print Results in the required format
    print("\n====================================")
    print("OCR RESULTS")
    print("====================================")
    if not results:
        print("(No text regions detected above confidence threshold)")
    else:
        for item in results:
            print(f"\nText: {item['text']}")
            print(f"Confidence: {item['confidence']:.2f}")
            print(f"Bounding Box: {item['bbox']}")
    print("====================================\n")

    # 5. Visualization and Saving
    annotated_path = None
    json_path = None
    if save_outputs:
        os.makedirs(output_dir, exist_ok=True)
        base_name = Path(image_path).stem
        annotated_path = os.path.join(output_dir, f"{base_name}_annotated.jpg")
        visualizer.draw_annotations(raw_bgr, results, show_confidence=True, output_path=annotated_path)

        # Standard JSON export matching requirement format
        json_export = [
            {
                "text": r["text"],
                "confidence": r["confidence"],
                "bbox": r["bbox"]
            }
            for r in results
        ]
        json_path = os.path.join(output_dir, f"{base_name}_ocr_results.json")
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(json_export, f, indent=2, ensure_ascii=False)

        print(f"[4/4] Output files saved:")
        print(f"      - Annotated Image : {annotated_path}")
        print(f"      - Structured JSON : {json_path}")

    return {
        "image_path": image_path,
        "results": results,
        "preprocessing_time_ms": prep_time,
        "ocr_time_ms": ocr_time,
        "total_time_ms": prep_time + ocr_time,
        "annotated_path": annotated_path,
        "json_path": json_path,
    }


def compare_preprocessing_experiment(
    image_path: str,
    output_dir: str,
    ocr_engine: OCREngine,
    preprocessor: ImagePreprocessor,
    visualizer: OCRVisualizer,
):
    """Run Experiment A (Raw -> OCR) vs Experiment B (Preprocessed -> OCR)."""
    print("=" * 70)
    print("EXPERIMENT: RAW VS PREPROCESSED OCR COMPARISON")
    print(f"Target: {image_path}")
    print("=" * 70)

    # Exp A: Raw -> OCR
    print("\n--- Running Experiment A: Original Image -> OCR ---")
    res_a = process_single_image(
        image_path,
        output_dir=os.path.join(output_dir, "exp_a_raw"),
        ocr_engine=ocr_engine,
        preprocessor=preprocessor,
        visualizer=visualizer,
        use_preprocessing=False,
    )

    # Exp B: Preprocessed -> OCR
    print("\n--- Running Experiment B: Preprocessed Image -> OCR ---")
    res_b = process_single_image(
        image_path,
        output_dir=os.path.join(output_dir, "exp_b_preprocessed"),
        ocr_engine=ocr_engine,
        preprocessor=preprocessor,
        visualizer=visualizer,
        use_preprocessing=True,
    )

    # Summary Comparison
    count_a = len(res_a.get("results", []))
    count_b = len(res_b.get("results", []))
    avg_conf_a = sum(r["confidence"] for r in res_a["results"]) / max(count_a, 1)
    avg_conf_b = sum(r["confidence"] for r in res_b["results"]) / max(count_b, 1)

    b_prep_ms = f"{res_b.get('preprocessing_time_ms', 0):.1f} ms"
    a_ocr_ms = f"{res_a.get('ocr_time_ms', 0):.1f} ms"
    b_ocr_ms = f"{res_b.get('ocr_time_ms', 0):.1f} ms"
    a_tot_ms = f"{res_a.get('total_time_ms', 0):.1f} ms"
    b_tot_ms = f"{res_b.get('total_time_ms', 0):.1f} ms"
    a_conf_str = f"{avg_conf_a * 100:.1f}%"
    b_conf_str = f"{avg_conf_b * 100:.1f}%"

    print("\n" + "=" * 70)
    print("PREPROCESSING COMPARISON SUMMARY")
    print("=" * 70)
    print(f"{'Metric':<30} | {'Exp A: Raw':<18} | {'Exp B: Preprocessed':<18}")
    print("-" * 70)
    print(f"{'Preprocessing Time (ms)':<30} | {'0.0 ms':<18} | {b_prep_ms:<18}")
    print(f"{'OCR Time (ms)':<30} | {a_ocr_ms:<18} | {b_ocr_ms:<18}")
    print(f"{'Total Time (ms)':<30} | {a_tot_ms:<18} | {b_tot_ms:<18}")
    print(f"{'Detections Count':<30} | {count_a:<18} | {count_b:<18}")
    print(f"{'Average Confidence':<30} | {a_conf_str:<18} | {b_conf_str:<18}")
    print("=" * 70)


def run_benchmark_suite(
    dataset_dir: str,
    ground_truth_path: str,
    output_dir: str,
    ocr_engine: OCREngine,
    preprocessor: ImagePreprocessor,
    visualizer: OCRVisualizer,
):
    """Run full evaluation across the 10 packaged product test images."""
    print("=" * 75)
    print("RUNNING OCR BENCHMARK ON 10 PACKAGED PRODUCT IMAGES")
    print(f"Dataset Dir   : {dataset_dir}")
    print(f"Ground Truth  : {ground_truth_path}")
    print(f"Outputs Dir   : {output_dir}")
    print("=" * 75)

    if not os.path.exists(ground_truth_path):
        print(f"[ERROR] Ground truth file not found: {ground_truth_path}")
        return

    with open(ground_truth_path, "r", encoding="utf-8") as f:
        ground_truth = json.load(f)

    benchmark_records = []
    total_samples = 0
    sum_cer = 0.0
    sum_wer = 0.0
    sum_recall = 0.0
    sum_conf = 0.0
    sum_ocr_time = 0.0

    print(f"{'Image':<18} | {'GT':<4} | {'Det':<4} | {'Recall':<8} | {'AvgConf':<8} | {'CER':<7} | {'Time':<8}")
    print("-" * 75)

    for i in range(1, 11):
        filename = f"product_{i:02d}.jpg"
        img_path = os.path.join(dataset_dir, filename)
        if not os.path.exists(img_path):
            continue

        gt_items = ground_truth.get(filename, [])

        # Run pipeline
        start = time.perf_counter()
        raw_bgr = preprocessor.validate_and_load(img_path)
        prep_data = preprocessor.process(raw_bgr)
        ocr_res = ocr_engine.detect_and_recognize(
            prep_data["preprocessed_image"],
            scale_factor=prep_data["scale_factor"]
        )
        results = ocr_res.get("results", [])
        total_time = (time.perf_counter() - start) * 1000.0

        # Save annotated image
        annotated_path = os.path.join(output_dir, f"{Path(filename).stem}_annotated.jpg")
        visualizer.draw_annotations(raw_bgr, results, show_confidence=True, output_path=annotated_path)

        # Evaluate against ground truth
        eval_metrics = evaluate_sample(results, gt_items)

        total_samples += 1
        sum_cer += eval_metrics["character_error_rate"]
        sum_wer += eval_metrics["word_error_rate"]
        sum_recall += eval_metrics["key_entity_recall"]
        sum_conf += eval_metrics["average_confidence"]
        sum_ocr_time += ocr_res["ocr_time_ms"]

        rec_str = f"{eval_metrics['key_entity_recall'] * 100:.1f}%"
        conf_str = f"{eval_metrics['average_confidence'] * 100:.1f}%"
        cer_str = f"{eval_metrics['character_error_rate'] * 100:.1f}%"
        time_str = f"{ocr_res['ocr_time_ms']:.0f}ms"

        print(
            f"{filename:<18} | {len(gt_items):<4} | {len(results):<4} | "
            f"{rec_str:<8} | {conf_str:<8} | {cer_str:<7} | {time_str:<8}"
        )

        benchmark_records.append({
            "image": filename,
            "ground_truth_count": len(gt_items),
            "detected_count": len(results),
            "key_entity_recall": eval_metrics["key_entity_recall"],
            "average_confidence": eval_metrics["average_confidence"],
            "character_error_rate": eval_metrics["character_error_rate"],
            "word_error_rate": eval_metrics["word_error_rate"],
            "ocr_time_ms": ocr_res["ocr_time_ms"],
            "field_matches": eval_metrics["field_details"]
        })

    print("-" * 75)
    avg_cer = sum_cer / max(total_samples, 1)
    avg_wer = sum_wer / max(total_samples, 1)
    avg_rec = sum_recall / max(total_samples, 1)
    avg_conf = sum_conf / max(total_samples, 1)
    avg_time = sum_ocr_time / max(total_samples, 1)

    print(f"{'OVERALL AVERAGE':<18} | {'-':<4} | {'-':<4} | "
          f"{f'{avg_rec * 100:.1f}%':<8} | {f'{avg_conf * 100:.1f}%':<8} | "
          f"{f'{avg_cer * 100:.1f}%':<7} | {f'{avg_time:.0f}ms':<8}")
    print("=" * 75)

    report_path = os.path.join(output_dir, "benchmark_report.json")
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump({
            "total_images_evaluated": total_samples,
            "average_key_entity_recall": round(avg_rec, 4),
            "average_confidence": round(avg_conf, 4),
            "average_character_error_rate": round(avg_cer, 4),
            "average_word_error_rate": round(avg_wer, 4),
            "average_ocr_time_ms": round(avg_time, 2),
            "image_details": benchmark_records
        }, f, indent=2, ensure_ascii=False)
    print(f"\n[Benchmark] Complete report exported to: {report_path}")


def test_edge_cases(
    raw_dir: str,
    ocr_engine: OCREngine,
    preprocessor: ImagePreprocessor,
):
    """Test error handling with non-existent, corrupted, and blank images."""
    print("=" * 65)
    print("RUNNING ERROR HANDLING & EDGE CASE TESTS")
    print("=" * 65)

    # 1. Non-existent file
    print("[Test 1/3] Non-existent file path...")
    try:
        preprocessor.validate_and_load(os.path.join(raw_dir, "non_existent_file.jpg"))
        print("  [FAIL]: Did not raise expected FileNotFoundError")
    except FileNotFoundError as e:
        print(f"  [PASS]: Handled gracefully -> {type(e).__name__}: {e}")

    # 2. Corrupted image
    print("\n[Test 2/3] Corrupted image file...")
    try:
        preprocessor.validate_and_load(os.path.join(raw_dir, "corrupted_image.jpg"))
        print("  [FAIL]: Did not catch corrupted image")
    except ValueError as e:
        print(f"  [PASS]: Handled gracefully -> {type(e).__name__}: {e}")

    # 3. Blank image (zero text)
    print("\n[Test 3/3] Blank image (empty text)...")
    try:
        raw_bgr = preprocessor.validate_and_load(os.path.join(raw_dir, "blank_image.jpg"))
        prep_data = preprocessor.process(raw_bgr)
        ocr_res = ocr_engine.detect_and_recognize(prep_data["preprocessed_image"])
        print(f"  [PASS]: Handled gracefully -> Returned {len(ocr_res['results'])} detections (No crash)")
    except Exception as e:
        print(f"  [FAIL]: Crashed on blank image -> {e}")

    print("\n" + "=" * 65)
    print("Edge case tests completed.")
    print("=" * 65)


def main():
    args = parse_arguments()

    print("[Init] Initializing OCR Engine and Preprocessor...")
    ocr_engine = OCREngine(languages=["en"])
    preprocessor = ImagePreprocessor()
    visualizer = OCRVisualizer()

    if args.test_edge_cases:
        raw_dir = str(REPO_ROOT / "data" / "ocr_test" / "raw")
        test_edge_cases(raw_dir, ocr_engine, preprocessor)
        return

    if args.benchmark_all:
        raw_dir = str(REPO_ROOT / "data" / "ocr_test" / "raw")
        gt_file = str(REPO_ROOT / "data" / "ocr_test" / "ground_truth" / "ground_truth.json")
        run_benchmark_suite(
            dataset_dir=raw_dir,
            ground_truth_path=gt_file,
            output_dir=args.output_dir,
            ocr_engine=ocr_engine,
            preprocessor=preprocessor,
            visualizer=visualizer,
        )
        return

    if args.compare_preprocessing:
        compare_preprocessing_experiment(
            image_path=args.image,
            output_dir=args.output_dir,
            ocr_engine=ocr_engine,
            preprocessor=preprocessor,
            visualizer=visualizer,
        )
        return

    # Single Image Run
    process_single_image(
        image_path=args.image,
        output_dir=args.output_dir,
        ocr_engine=ocr_engine,
        preprocessor=preprocessor,
        visualizer=visualizer,
        min_confidence=args.min_confidence,
        use_preprocessing=not args.no_preprocess,
    )


if __name__ == "__main__":
    main()
