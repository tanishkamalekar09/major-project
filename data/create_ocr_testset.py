"""
Generate OCR Test Dataset for Packaged Product Compliance Testing.

Creates 10 diverse packaged product images covering:
- Categories: Bakery, Snacks, Personal Care, Condiments, Commodity, Hygiene, Dairy, Instant Food, Beverages, Cosmetics.
- Packaging styles: Box/Carton, Flexible Pouch, Cylindrical Bottle, Jar, Tetra Pak, Tube.
- Fonts & text sizes: Bold display fonts, small declaration text, mixed symbols (Rs, ₹, %, /, :).
- Ground truth JSON with expected key regulatory fields.
- Edge case test images: blank image and corrupted file.
"""

import os
import json
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RAW_DIR = os.path.join(BASE_DIR, "ocr_test", "raw")
GT_DIR = os.path.join(BASE_DIR, "ocr_test", "ground_truth")

os.makedirs(RAW_DIR, exist_ok=True)
os.makedirs(GT_DIR, exist_ok=True)


def get_fonts():
    try:
        f_title = ImageFont.truetype("arialbd.ttf", 44)
        f_sub = ImageFont.truetype("arialbd.ttf", 30)
        f_body_bold = ImageFont.truetype("arialbd.ttf", 24)
        f_body = ImageFont.truetype("arial.ttf", 23)
        f_small = ImageFont.truetype("arial.ttf", 19)
    except Exception:
        f_title = f_sub = f_body_bold = f_body = f_small = ImageFont.load_default()
    return f_title, f_sub, f_body_bold, f_body, f_small


def draw_label(
    filename: str,
    bg_color: tuple,
    banner_color: tuple,
    brand_text: str,
    product_name: str,
    fields: list,
    footer_text: list,
    border_color: tuple = (180, 180, 180),
    width: int = 850,
    height: int = 1050
):
    f_title, f_sub, f_body_bold, f_body, f_small = get_fonts()
    img = Image.new("RGB", (width, height), color=bg_color)
    draw = ImageDraw.Draw(img)

    # Outer border
    draw.rectangle([15, 15, width - 15, height - 15], outline=border_color, width=3)

    # Top Brand Banner
    draw.rectangle([18, 18, width - 18, 155], fill=banner_color)
    draw.text((width // 2, 55), brand_text, fill=(255, 255, 255), font=f_title, anchor="mm")
    draw.text((width // 2, 115), product_name, fill=(255, 245, 200), font=f_sub, anchor="mm")

    # Fields list (Left label, Right value)
    y = 190
    for label, val in fields:
        draw.text((45, y), f"{label}:", fill=(45, 45, 45), font=f_body_bold)
        draw.text((380, y), val, fill=(15, 15, 15), font=f_body)
        y += 54

    draw.line([(40, y + 10), (width - 40, y + 10)], fill=(200, 200, 200), width=2)
    y += 28

    # Footer / Manufacturer / Contact section
    for line in footer_text:
        draw.text((45, y), line, fill=(35, 35, 35), font=f_small)
        y += 36

    out_path = os.path.join(RAW_DIR, filename)
    img.save(out_path, quality=95)
    print(f"[Dataset] Generated: {filename}")


def generate_all_samples():
    dataset_metadata = {}

    # 1. Product 01: Britannia Good Day Butter Cookies (Bakery / Carton)
    p01_fields = [
        ("Net Weight", "200 g"),
        ("MRP (incl. of all taxes)", "Rs. 50.00"),
        ("Unit Sale Price", "Rs. 0.25 / g"),
        ("Batch No.", "B240912A"),
        ("Date of Manufacture", "12/09/2026"),
        ("Best Before", "6 Months from packaging"),
        ("FSSAI Lic. No.", "10015042001850"),
    ]
    p01_footer = [
        "Manufactured by: Britannia Industries Ltd., Plot 12, Industrial Area, Haridwar",
        "Consumer Care: 1800 425 4449 | feedback@britindia.com",
        "100% VEGETARIAN | Store in cool, dry place"
    ]
    draw_label(
        "product_01.jpg", (250, 246, 238), (170, 25, 30),
        "BRITANNIA", "GOOD DAY BUTTER COOKIES",
        p01_fields, p01_footer, border_color=(200, 160, 90)
    )
    dataset_metadata["product_01.jpg"] = [
        "BRITANNIA", "GOOD DAY BUTTER COOKIES", "Net Weight: 200 g", "MRP (incl. of all taxes): Rs. 50.00",
        "Unit Sale Price: Rs. 0.25 / g", "Batch No.: B240912A", "Date of Manufacture: 12/09/2026",
        "Best Before: 6 Months from packaging", "FSSAI Lic. No.: 10015042001850",
        "Britannia Industries Ltd.", "1800 425 4449", "feedback@britindia.com"
    ]

    # 2. Product 02: Haldiram's Aloo Bhujia (Snacks / Pouch)
    p02_fields = [
        ("Net Quantity", "150 g"),
        ("MRP (Inclusive of all taxes)", "Rs. 40.00"),
        ("Batch / Lot No.", "LOT-9921D"),
        ("Mfg Date", "01/10/2026"),
        ("Use By", "01/04/2027"),
        ("FSSAI Lic. No.", "10012011000167"),
    ]
    p02_footer = [
        "Manufactured by: Haldiram Snacks Pvt. Ltd., Sector 62, Noida, U.P.",
        "Customer Care: customercare@haldirams.com | 0120-2400123",
        "Ingredients: Potatoes, Gram Pulse Flour, Edible Vegetable Oil, Spices"
    ]
    draw_label(
        "product_02.jpg", (255, 255, 255), (220, 100, 10),
        "HALDIRAM'S", "ALOO BHUJIA SPICY POTATO NOODLES",
        p02_fields, p02_footer, border_color=(220, 120, 20)
    )
    dataset_metadata["product_02.jpg"] = [
        "HALDIRAM'S", "ALOO BHUJIA SPICY POTATO NOODLES", "Net Quantity: 150 g", "MRP (Inclusive of all taxes): Rs. 40.00",
        "Batch / Lot No.: LOT-9921D", "Mfg Date: 01/10/2026", "Use By: 01/04/2027",
        "FSSAI Lic. No.: 10012011000167", "Haldiram Snacks Pvt. Ltd.", "customercare@haldirams.com", "0120-2400123"
    ]

    # 3. Product 03: Parachute Pure Coconut Oil (Personal Care / Plastic Bottle)
    p03_fields = [
        ("Net Volume", "250 ml"),
        ("Maximum Retail Price", "Rs. 115.00"),
        ("Batch Number", "PC-8841"),
        ("Date of Packaging", "15/08/2026"),
        ("Expiry Date", "24 Months from Packaging"),
        ("FSSAI Lic. No.", "10014022002611"),
    ]
    p03_footer = [
        "Manufactured by: Marico Limited, Grande Palladium, 175 CST Road, Mumbai",
        "Consumer Care Cell: 1800 22 2248 | ccc@marico.com",
        "100% PURE COCONUT OIL | Non-hydrogenated, no additives"
    ]
    draw_label(
        "product_03.jpg", (242, 248, 255), (10, 80, 160),
        "PARACHUTE", "100% PURE COCONUT OIL",
        p03_fields, p03_footer, border_color=(10, 80, 160)
    )
    dataset_metadata["product_03.jpg"] = [
        "PARACHUTE", "100% PURE COCONUT OIL", "Net Volume: 250 ml", "Maximum Retail Price: Rs. 115.00",
        "Batch Number: PC-8841", "Date of Packaging: 15/08/2026", "Expiry Date: 24 Months from Packaging",
        "FSSAI Lic. No.: 10014022002611", "Marico Limited", "1800 22 2248", "ccc@marico.com"
    ]

    # 4. Product 04: Dabur 100% Pure Honey (Food / Jar Label)
    p04_fields = [
        ("Net Weight", "500 g"),
        ("MRP (incl. of all taxes)", "Rs. 240.00"),
        ("Batch No.", "DH-7721"),
        ("Pkd Date", "05/07/2026"),
        ("Best Before", "18 Months from packaging"),
        ("FSSAI Lic. No.", "10013013000552"),
    ]
    p04_footer = [
        "Manufactured by: Dabur India Limited, 8/3 Asaf Ali Road, New Delhi 110002",
        "Customer Feedback: 1800-103-1644 | daburcares@dabur.com",
        "100% PURE AND INDIGENOUS HONEY | No Added Sugar"
    ]
    draw_label(
        "product_04.jpg", (255, 252, 235), (200, 140, 20),
        "DABUR", "100% PURE NATURAL HONEY",
        p04_fields, p04_footer, border_color=(200, 140, 20)
    )
    dataset_metadata["product_04.jpg"] = [
        "DABUR", "100% PURE NATURAL HONEY", "Net Weight: 500 g", "MRP (incl. of all taxes): Rs. 240.00",
        "Batch No.: DH-7721", "Pkd Date: 05/07/2026", "Best Before: 18 Months from packaging",
        "FSSAI Lic. No.: 10013013000552", "Dabur India Limited", "1800-103-1644", "daburcares@dabur.com"
    ]

    # 5. Product 05: Tata Salt (Commodity Food / Pouch)
    p05_fields = [
        ("Net Weight", "1 kg"),
        ("MRP (incl. of taxes)", "Rs. 28.00"),
        ("Batch Identification", "TS-4419"),
        ("Date of Manufacture", "20/09/2026"),
        ("Best Before", "24 Months from MFD"),
        ("FSSAI Lic. No.", "10014022002778"),
    ]
    p05_footer = [
        "Manufactured by: Tata Consumer Products Ltd., 1 Bishop Lefroy Road, Kolkata",
        "Consumer Care: care@tataconsumer.com | Toll-Free: 1800-108-4488",
        "VACUUM EVAPORATED IODIZED SALT | Desh Ka Namak"
    ]
    draw_label(
        "product_05.jpg", (248, 250, 254), (20, 50, 120),
        "TATA SALT", "VACUUM EVAPORATED IODIZED SALT",
        p05_fields, p05_footer, border_color=(20, 50, 120)
    )
    dataset_metadata["product_05.jpg"] = [
        "TATA SALT", "VACUUM EVAPORATED IODIZED SALT", "Net Weight: 1 kg", "MRP (incl. of taxes): Rs. 28.00",
        "Batch Identification: TS-4419", "Date of Manufacture: 20/09/2026", "Best Before: 24 Months from MFD",
        "FSSAI Lic. No.: 10014022002778", "Tata Consumer Products Ltd.", "care@tataconsumer.com", "1800-108-4488"
    ]

    # 6. Product 06: Dettol Original Liquid Handwash (Personal Hygiene / Pump)
    p06_fields = [
        ("Net Quantity", "200 ml"),
        ("MRP (inclusive of taxes)", "Rs. 99.00"),
        ("Batch / Lot", "DT-9811"),
        ("Mfg Date", "10/06/2026"),
        ("Expiry Date", "09/06/2028"),
        ("Drug Mfg Lic. No.", "DL-8891-M"),
    ]
    p06_footer = [
        "Manufactured by: Reckitt Benckiser India Pvt. Ltd., DLF Cyber City, Gurugram",
        "Consumer Relations: 1800 102 2727 | consumercare_in@reckitt.com",
        "10X BETTER GERM PROTECTION | Dermatologically Tested"
    ]
    draw_label(
        "product_06.jpg", (244, 252, 246), (15, 130, 65),
        "DETTOL", "ORIGINAL LIQUID HANDWASH",
        p06_fields, p06_footer, border_color=(15, 130, 65)
    )
    dataset_metadata["product_06.jpg"] = [
        "DETTOL", "ORIGINAL LIQUID HANDWASH", "Net Quantity: 200 ml", "MRP (inclusive of taxes): Rs. 99.00",
        "Batch / Lot: DT-9811", "Mfg Date: 10/06/2026", "Expiry Date: 09/06/2028",
        "Drug Mfg Lic. No.: DL-8891-M", "Reckitt Benckiser India Pvt. Ltd.", "1800 102 2727"
    ]

    # 7. Product 07: Amul Taaza Toned Milk (Dairy / Tetra Pak)
    p07_fields = [
        ("Net Volume", "1 L"),
        ("MRP (incl. of all taxes)", "Rs. 72.00"),
        ("Batch Number", "AT-202609"),
        ("Packing Date", "25/09/2026"),
        ("Use By Date", "24/03/2027"),
        ("FSSAI Lic. No.", "10012021000071"),
    ]
    p07_footer = [
        "Marketed by: Gujarat Co-operative Milk Marketing Federation Ltd., Anand, Gujarat",
        "Customer Support: 1800 258 3333 | customercare@amul.coop",
        "HOMOGENISED TONED MILK | No Preservatives | Needs No Boiling"
    ]
    draw_label(
        "product_07.jpg", (245, 250, 255), (0, 110, 180),
        "AMUL TAAZA", "HOMOGENISED TONED MILK",
        p07_fields, p07_footer, border_color=(0, 110, 180)
    )
    dataset_metadata["product_07.jpg"] = [
        "AMUL TAAZA", "HOMOGENISED TONED MILK", "Net Volume: 1 L", "MRP (incl. of all taxes): Rs. 72.00",
        "Batch Number: AT-202609", "Packing Date: 25/09/2026", "Use By Date: 24/03/2027",
        "FSSAI Lic. No.: 10012021000071", "Gujarat Co-operative Milk Marketing Federation Ltd.", "1800 258 3333"
    ]

    # 8. Product 08: Maggi 2-Minute Noodles (Instant Food / Yellow Pouch)
    p08_fields = [
        ("Net Weight", "70 g"),
        ("MRP (incl. of taxes)", "Rs. 14.00"),
        ("Unit Sale Price", "Rs. 0.20 / g"),
        ("Batch Code", "M-30198"),
        ("Date of Mfg", "02/09/2026"),
        ("Best Before", "9 Months from Manufacture"),
        ("FSSAI Lic. No.", "10012011000168"),
    ]
    p08_footer = [
        "Manufactured by: Nestle India Limited, 100/101 World Trade Centre, New Delhi",
        "Consumer Services: wecare@in.nestle.com | Toll Free: 1800 103 1947",
        "TASTE BHI HEALTH BHI | Good Food, Good Life"
    ]
    draw_label(
        "product_08.jpg", (255, 252, 220), (220, 30, 30),
        "MAGGI", "2-MINUTE NOODLES MASALA",
        p08_fields, p08_footer, border_color=(220, 180, 20)
    )
    dataset_metadata["product_08.jpg"] = [
        "MAGGI", "2-MINUTE NOODLES MASALA", "Net Weight: 70 g", "MRP (incl. of taxes): Rs. 14.00",
        "Unit Sale Price: Rs. 0.20 / g", "Batch Code: M-30198", "Date of Mfg: 02/09/2026",
        "Best Before: 9 Months from Manufacture", "FSSAI Lic. No.: 10012011000168", "Nestle India Limited", "1800 103 1947"
    ]

    # 9. Product 09: Himalayan Natural Mineral Water (Beverage / Can)
    p09_fields = [
        ("Net Quantity", "750 ml"),
        ("MRP (Inclusive of taxes)", "Rs. 65.00"),
        ("Lot Number", "HNW-551"),
        ("Date of Bottling", "14/09/2026"),
        ("Best Before", "12 Months from bottling"),
        ("FSSAI Lic. No.", "10016011003451"),
    ]
    p09_footer = [
        "Bottled at Source: Tata Consumer Products Ltd., Dhaula Kuan, Paonta Sahib, H.P.",
        "Consumer Care: feedback@himalayanwater.com | 1800-425-6677",
        "NATURAL MINERAL WATER | Filtered through Himalayan Rocks"
    ]
    draw_label(
        "product_09.jpg", (245, 248, 252), (50, 90, 130),
        "HIMALAYAN", "NATURAL MINERAL WATER",
        p09_fields, p09_footer, border_color=(120, 150, 180)
    )
    dataset_metadata["product_09.jpg"] = [
        "HIMALAYAN", "NATURAL MINERAL WATER", "Net Quantity: 750 ml", "MRP (Inclusive of taxes): Rs. 65.00",
        "Lot Number: HNW-551", "Date of Bottling: 14/09/2026", "Best Before: 12 Months from bottling",
        "FSSAI Lic. No.: 10016011003451", "Tata Consumer Products Ltd.", "1800-425-6677"
    ]

    # 10. Product 10: Himalaya Purifying Neem Face Wash (Cosmetic / Tube)
    p10_fields = [
        ("Net Volume", "100 ml"),
        ("MRP (inclusive of all taxes)", "Rs. 165.00"),
        ("Batch / Lot No.", "HFW-409B"),
        ("Date of Mfg", "25/08/2026"),
        ("Use Before", "36 Months from MFD"),
        ("Ayurvedic Lic. No.", "AUS-520"),
    ]
    p10_footer = [
        "Manufactured by: The Himalaya Drug Company, Makali, Bengaluru, Karnataka 562162",
        "Customer Service: contactus@himalayawellness.com | 1-800-208-1930",
        "HERBAL FORMULATION | Prevents Pimples | Soap-Free"
    ]
    draw_label(
        "product_10.jpg", (240, 250, 242), (25, 115, 60),
        "HIMALAYA SINCE 1930", "PURIFYING NEEM FACE WASH",
        p10_fields, p10_footer, border_color=(25, 115, 60)
    )
    dataset_metadata["product_10.jpg"] = [
        "HIMALAYA SINCE 1930", "PURIFYING NEEM FACE WASH", "Net Volume: 100 ml", "MRP (inclusive of all taxes): Rs. 165.00",
        "Batch / Lot No.: HFW-409B", "Date of Mfg: 25/08/2026", "Use Before: 36 Months from MFD",
        "Ayurvedic Lic. No.: AUS-520", "The Himalaya Drug Company", "1-800-208-1930"
    ]

    # Edge cases:
    # A) Blank image (contains zero text)
    blank_img = Image.new("RGB", (600, 600), color=(255, 255, 255))
    blank_path = os.path.join(RAW_DIR, "blank_image.jpg")
    blank_img.save(blank_path)
    dataset_metadata["blank_image.jpg"] = []
    print(f"[Dataset] Generated edge case: blank_image.jpg")

    # B) Corrupted image (malformed bytes)
    corrupted_path = os.path.join(RAW_DIR, "corrupted_image.jpg")
    with open(corrupted_path, "wb") as f:
        f.write(b"NOT_A_VALID_JPEG_HEADER_CORRUPTED_STREAM_DATA_ABCXYZ")
    print(f"[Dataset] Generated edge case: corrupted_image.jpg")

    # Save ground truth JSON
    gt_file = os.path.join(GT_DIR, "ground_truth.json")
    with open(gt_file, "w", encoding="utf-8") as f:
        json.dump(dataset_metadata, f, indent=2, ensure_ascii=False)
    print(f"[Dataset] Ground truth written to: {gt_file}")


if __name__ == "__main__":
    generate_all_samples()
