"""
Step 4 Information Extraction Evaluation Script.
Evaluates structured extraction on 5+ diverse packaged food samples.
"""
import requests
import json
import sys

# Ensure UTF-8 output for currency symbols on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_URL = "http://127.0.0.1:8000/api/v1"

TEST_SAMPLES = [
    {"id": "product_01", "type": "Biscuit packet", "name": "Britannia Good Day Cookies"},
    {"id": "product_02", "type": "Chips/snacks packet", "name": "Haldiram's Aloo Bhujia"},
    {"id": "product_08", "type": "Noodles packet", "name": "Maggi 2-Minute Masala Noodles"},
    {"id": "product_09", "type": "Packaged beverage", "name": "Himalayan Natural Mineral Water"},
    {"id": "product_04", "type": "Other packaged food (Honey)", "name": "Dabur Honey"},
    {"id": "product_05", "type": "Other packaged food (Salt)", "name": "Tata Salt"}
]

CORE_FIELDS = [
    "product_name",
    "brand_name",
    "mrp",
    "net_quantity",
    "manufacturer",
    "manufacturing_date",
    "best_before",
    "expiry_date",
    "batch_number",
    "fssai_license_number",
    "ingredients",
    "consumer_care",
    "country_of_origin",
    "product_category"
]

def run_evaluation():
    print("=" * 80)
    print("STEP 4: STRUCTURED INFORMATION EXTRACTION BENCHMARK")
    print("=" * 80)
    
    results = {}
    
    for sample in TEST_SAMPLES:
        sample_id = sample["id"]
        sample_type = sample["type"]
        sample_name = sample["name"]
        
        print(f"\n--- Testing [{sample_id}] {sample_name} ({sample_type}) ---")
        url = f"{BASE_URL}/ocr/sample-preset/{sample_id}"
        
        try:
            resp = requests.post(url, timeout=30)
            if resp.status_code != 200:
                print(f"FAILED: HTTP {resp.status_code} - {resp.text}")
                continue
                
            data = resp.json()
            prod_info = data.get("product_information", {})
            ocr_info = data.get("ocr", {})
            
            print(f"Total OCR Text Blocks: {len(ocr_info.get('text', []))}")
            print(f"OCR Latency: {data.get('processing_time_ms', 'N/A')} ms")
            
            extracted_fields = {}
            for field in CORE_FIELDS:
                f_data = prod_info.get(field)
                if f_data and f_data.get("value") is not None:
                    val = f_data.get("value")
                    conf = f_data.get("confidence")
                    src = f_data.get("source_text")
                    conf_str = f"{int(conf*100)}%" if conf is not None else "N/A"
                    print(f"  [FOUND]     {field.ljust(22)}: {str(val).ljust(26)} (Conf: {conf_str}, Source: '{src}')")
                    extracted_fields[field] = f_data
                else:
                    print(f"  [NOT FOUND] {field.ljust(22)}: null")
                    extracted_fields[field] = None
                    
            results[sample_id] = {
                "sample": sample,
                "extracted": extracted_fields,
                "detected_count": sum(1 for v in extracted_fields.values() if v is not None)
            }
            
        except Exception as e:
            print(f"Error testing {sample_id}: {str(e)}")
            
    print("\n" + "=" * 80)
    print("SUMMARY RESULTS PER PACKAGING TYPE")
    print("=" * 80)
    for sid, r in results.items():
        s = r["sample"]
        print(f"{s['id']} | {s['type'].ljust(30)} | {s['name'].ljust(32)} | Detected: {r['detected_count']}/{len(CORE_FIELDS)}")

if __name__ == "__main__":
    run_evaluation()
