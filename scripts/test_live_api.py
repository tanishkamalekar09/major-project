import requests
import json
import sys

# Ensure UTF-8 output
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

samples = [
    ("product_01.jpg", "1. Biscuit"),
    ("product_11_chips.jpg", "2. Chips"),
    ("product_02.jpg", "3. Namkeen"),
    ("product_08.jpg", "4. Noodles"),
    ("product_09.jpg", "5. Beverage"),
    ("product_03.jpg", "6. Edible Oil"),
    ("product_07.jpg", "7. Dairy"),
    ("product_12_spice.jpg", "8. Spice"),
    ("product_13_cereal.jpg", "9. Cereal"),
    ("product_14_sauce.jpg", "10. Sauce"),
    ("product_17_poor_ocr.jpg", "Poor OCR"),
    ("product_18_missing_name.jpg", "Missing Name"),
    ("blank_image.jpg", "Empty OCR"),
    ("product_19_unknown.jpg", "Unknown Non-Food"),
]

print("=" * 95)
print(f"{'Label':<20} | {'Category':<22} | {'Subcategory':<25} | {'Conf':<6} | {'Method'}")
print("=" * 95)

for fname, label in samples:
    try:
        with open("data/ocr_test/raw/" + fname, "rb") as f:
            r = requests.post("http://127.0.0.1:8000/api/analyze", files={"file": (fname, f, "image/jpeg")}, timeout=30)
        if r.status_code != 200:
            print(f"{label:<20} | HTTP ERROR {r.status_code}: {r.text}")
            continue
        data = r.json()
        cls = data.get("classification", {})
        cat = cls.get("category", "N/A")
        subcat = str(cls.get("subcategory")) if cls.get("subcategory") is not None else "null"
        conf = f"{int(cls.get('confidence')*100)}%" if cls.get("confidence") is not None else "null"
        method = cls.get("method", "N/A")
        print(f"{label:<20} | {cat:<22} | {subcat:<25} | {conf:<6} | {method}")
    except Exception as e:
        print(f"{label:<20} | ERROR: {e}")

print("=" * 95)
