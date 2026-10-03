"""
STEP 5: Product Classification Benchmark & Verification Suite.

Tests at least 10 different packaged food products:
1. Biscuit (Britannia Good Day Cookies)
2. Chips (Lay's Magic Masala Potato Chips)
3. Namkeen (Haldiram's Aloo Bhujia)
4. Noodles (Maggi 2-Minute Masala Noodles)
5. Beverage (Himalayan Natural Mineral Water)
6. Edible Oil (Parachute Pure Coconut Oil)
7. Dairy Product (Amul Taaza Toned Milk)
8. Spice/Masala (Everest Turmeric Powder Spice)
9. Breakfast Cereal (Kellogg's Corn Flakes Breakfast Cereal)
10. Sauce/Jam (Kissan Fresh Tomato Ketchup Sauce)

Also tests Edge Cases:
- Poor OCR (product_17_poor_ocr.jpg)
- Missing product name (product_18_missing_name.jpg)
- Empty OCR result (blank_image.jpg)
- Unknown / Non-food product (product_19_unknown.jpg, product_06.jpg, product_10.jpg)

Measures and records ACTUAL classification performance, accuracy, confidence, and latency.
"""

import sys
import os
import time
from pathlib import Path

# Fix Windows stdout encoding for symbols
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

REPO_ROOT = Path(__file__).resolve().parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from backend.app.services.ocr.real_ocr import RealOCRService
from backend.app.services.extraction import InformationExtractor, OCRInfo
from backend.app.services.classification import ProductClassifier

DATA_DIR = REPO_ROOT / "data" / "ocr_test" / "raw"

# Test samples covering all 10 required food categories + edge cases
BENCHMARK_CASES = [
    {
        "id": "product_01",
        "file": "product_01.jpg",
        "description": "1. Biscuit",
        "expected_category": "Biscuits",
        "expected_subcategory": "Cookies"
    },
    {
        "id": "product_11_chips",
        "file": "product_11_chips.jpg",
        "description": "2. Chips",
        "expected_category": "Packaged Snacks",
        "expected_subcategory": "Potato Chips"
    },
    {
        "id": "product_02",
        "file": "product_02.jpg",
        "description": "3. Namkeen",
        "expected_category": "Packaged Snacks",
        "expected_subcategory": "Bhujia"
    },
    {
        "id": "product_08",
        "file": "product_08.jpg",
        "description": "4. Noodles",
        "expected_category": "Noodles / Pasta",
        "expected_subcategory": "Instant Noodles"
    },
    {
        "id": "product_09",
        "file": "product_09.jpg",
        "description": "5. Beverage",
        "expected_category": "Beverages",
        "expected_subcategory": "Packaged Water"
    },
    {
        "id": "product_03",
        "file": "product_03.jpg",
        "description": "6. Edible Oil",
        "expected_category": "Edible Oils",
        "expected_subcategory": "Coconut Oil"
    },
    {
        "id": "product_07",
        "file": "product_07.jpg",
        "description": "7. Dairy Product",
        "expected_category": "Dairy Products",
        "expected_subcategory": "Milk"
    },
    {
        "id": "product_12_spice",
        "file": "product_12_spice.jpg",
        "description": "8. Spice/Masala",
        "expected_category": "Spices / Masala",
        "expected_subcategory": "Turmeric"
    },
    {
        "id": "product_13_cereal",
        "file": "product_13_cereal.jpg",
        "description": "9. Breakfast Cereal",
        "expected_category": "Breakfast Cereals",
        "expected_subcategory": "Corn Flakes"
    },
    {
        "id": "product_14_sauce",
        "file": "product_14_sauce.jpg",
        "description": "10. Sauce/Jam",
        "expected_category": "Sauces / Spreads",
        "expected_subcategory": "Tomato Ketchup / Sauce"
    },
    {
        "id": "product_15_bakery",
        "file": "product_15_bakery.jpg",
        "description": "Bakery (Bread)",
        "expected_category": "Bakery Products",
        "expected_subcategory": "Bread"
    },
    {
        "id": "product_16_sweets",
        "file": "product_16_sweets.jpg",
        "description": "Packaged Sweets (Chocolate)",
        "expected_category": "Packaged Sweets",
        "expected_subcategory": "Chocolates"
    },
    {
        "id": "product_04",
        "file": "product_04.jpg",
        "description": "Other Packaged Food (Honey)",
        "expected_category": "Other Packaged Food",
        "expected_subcategory": "Honey"
    },
    {
        "id": "product_05",
        "file": "product_05.jpg",
        "description": "Other Packaged Food (Salt)",
        "expected_category": "Other Packaged Food",
        "expected_subcategory": "Iodized Salt"
    },
    {
        "id": "product_17_poor_ocr",
        "file": "product_17_poor_ocr.jpg",
        "description": "Edge Case: Poor OCR (Blurred / Degraded)",
        "expected_category": "Packaged Snacks",
        "expected_subcategory": None
    },
    {
        "id": "product_18_missing_name",
        "file": "product_18_missing_name.jpg",
        "description": "Edge Case: Missing Product Name",
        "expected_category": "Unknown",
        "expected_subcategory": None
    },
    {
        "id": "product_19_unknown",
        "file": "product_19_unknown.jpg",
        "description": "Edge Case: Unknown (Hardware Toolset)",
        "expected_category": "Unknown",
        "expected_subcategory": None
    },
    {
        "id": "product_06",
        "file": "product_06.jpg",
        "description": "Edge Case: Unknown (Handwash / Non-food)",
        "expected_category": "Unknown",
        "expected_subcategory": None
    },
    {
        "id": "product_10",
        "file": "product_10.jpg",
        "description": "Edge Case: Unknown (Face Wash / Cosmetic)",
        "expected_category": "Unknown",
        "expected_subcategory": None
    },
    {
        "id": "blank_image",
        "file": "blank_image.jpg",
        "description": "Edge Case: Empty OCR (Blank Image)",
        "expected_category": "Unknown",
        "expected_subcategory": None
    }
]


def run_benchmark():
    print("=" * 90)
    print("STEP 5: PRODUCT CLASSIFICATION ENGINE BENCHMARK")
    print("=" * 90)
    print(f"Loading Real OCR Service (EasyOCR + CRAFT)...")
    
    ocr_service = RealOCRService()
    extractor = InformationExtractor()
    classifier = ProductClassifier()

    print(f"Evaluating {len(BENCHMARK_CASES)} diverse packaging samples...\n")

    results = []
    category_matches = 0
    total_evaluated = 0

    header = f"{'Sample ID':<18} | {'Category Expected':<20} | {'Category Detected':<20} | {'Subcategory':<22} | {'Conf':<6} | {'Method':<16} | {'Status'}"
    print(header)
    print("-" * len(header))

    for case in BENCHMARK_CASES:
        filepath = DATA_DIR / case["file"]
        if not filepath.exists():
            print(f"SKIPPING: File {case['file']} not found.")
            continue

        with open(filepath, "rb") as f:
            img_bytes = f.read()

        t0 = time.perf_counter()
        
        # 1. Real OCR
        try:
            ocr_res = ocr_service.process_image(img_bytes)
        except Exception as e:
            # Handle empty image error safely
            if "Empty" in str(e) or case["file"] == "blank_image.jpg":
                from backend.app.services.ocr.base import OCRResult
                ocr_res = OCRResult(raw_text="", blocks=[], engine_name="easyocr")
            else:
                print(f"OCR Error on {case['file']}: {e}")
                continue

        # 2. Step 4 Extraction
        prod_info = extractor.extract(ocr_res.blocks, ocr_res.raw_text)

        # 3. Step 5 Classification
        classification = classifier.classify(
            ocr_result=ocr_res,
            product_information=prod_info
        )

        elapsed_ms = (time.perf_counter() - t0) * 1000

        detected_cat = classification.category
        detected_subcat = classification.subcategory
        conf = classification.confidence
        conf_str = f"{int(conf * 100)}%" if conf is not None else "null"
        method = classification.method

        # Check accuracy
        cat_match = (detected_cat == case["expected_category"])
        if cat_match:
            category_matches += 1
            status = "PASS"
        else:
            status = f"FAIL (Exp: {case['expected_category']})"

        total_evaluated += 1

        subcat_display = str(detected_subcat) if detected_subcat else "null"
        print(f"{case['id']:<18} | {case['expected_category']:<20} | {detected_cat:<20} | {subcat_display:<22} | {conf_str:<6} | {method:<16} | {status}")

        results.append({
            "id": case["id"],
            "description": case["description"],
            "file": case["file"],
            "expected_category": case["expected_category"],
            "expected_subcategory": case["expected_subcategory"],
            "detected_category": detected_cat,
            "detected_subcategory": detected_subcat,
            "confidence": conf,
            "method": method,
            "matched_keywords": classification.matched_keywords,
            "matched_fields": classification.matched_fields,
            "classification_score": classification.classification_score,
            "status": status,
            "latency_ms": round(elapsed_ms, 1)
        })

    accuracy_pct = (category_matches / total_evaluated * 100) if total_evaluated > 0 else 0

    print("\n" + "=" * 90)
    print(f"BENCHMARK SUMMARY:")
    print(f"  Total Samples Evaluated: {total_evaluated}")
    print(f"  Category Matches Passed: {category_matches}/{total_evaluated}")
    print(f"  Measured Category Accuracy: {accuracy_pct:.1f}%")
    print("=" * 90)

    # Save benchmark report to outputs
    outputs_dir = REPO_ROOT / "outputs" / "classification"
    outputs_dir.mkdir(parents=True, exist_ok=True)
    import json
    report_file = outputs_dir / "classification_benchmark_report.json"
    with open(report_file, "w", encoding="utf-8") as f:
        json.dump({
            "total_evaluated": total_evaluated,
            "category_matches": category_matches,
            "measured_accuracy_pct": round(accuracy_pct, 2),
            "results": results
        }, f, indent=2)
    print(f"Full benchmark results recorded to: {report_file}")

    return results


if __name__ == "__main__":
    run_benchmark()
