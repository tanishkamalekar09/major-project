"""
Generate Step 5 Benchmark Test Packaging Images.
Adds targeted product samples for all 10 required food categories + edge cases:
- Chips (Potato Chips)
- Spice / Masala (Turmeric Powder)
- Breakfast Cereal (Corn Flakes)
- Sauce / Jam (Tomato Ketchup)
- Bakery (Whole Wheat Bread)
- Sweets (Cadbury Chocolate)
- Poor OCR (blurred / low contrast)
- Missing product name
- Unknown non-food product
"""

import os
import json
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

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
    height: int = 1050,
    apply_noise: bool = False
):
    f_title, f_sub, f_body_bold, f_body, f_small = get_fonts()
    img = Image.new("RGB", (width, height), color=bg_color)
    draw = ImageDraw.Draw(img)

    # Outer border
    draw.rectangle([15, 15, width - 15, height - 15], outline=border_color, width=3)

    # Top Brand Banner
    if brand_text or product_name:
        draw.rectangle([18, 18, width - 18, 155], fill=banner_color)
        if brand_text:
            draw.text((width // 2, 55), brand_text, fill=(255, 255, 255), font=f_title, anchor="mm")
        if product_name:
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

    if apply_noise:
        # Simulate poor OCR / degraded camera capture
        img = img.filter(ImageFilter.GaussianBlur(radius=2.0))

    out_path = os.path.join(RAW_DIR, filename)
    img.save(out_path, quality=90)
    print(f"[Step 5 Dataset] Generated: {filename}")


def create_step5_samples():
    # 1. Chips (Packaged Snacks -> Potato Chips)
    draw_label(
        "product_11_chips.jpg", (255, 250, 235), (20, 70, 180),
        "LAY'S", "MAGIC MASALA POTATO CHIPS",
        [
            ("Net Weight", "90 g"),
            ("MRP (incl. of all taxes)", "Rs. 30.00"),
            ("Unit Sale Price", "Rs. 0.33 / g"),
            ("Batch No.", "L26M098"),
            ("Date of Mfg", "15/09/2026"),
            ("Best Before", "4 Months from Manufacture"),
            ("FSSAI Lic. No.", "10014044000876"),
        ],
        [
            "Manufactured by: PepsiCo India Holdings Pvt. Ltd., Channo, Sangrur",
            "Customer Care: feedback@pepsico.com | 1800 22 4020",
            "Ingredients: Potato, Edible Vegetable Oil (Palmolein), Spices and Condiments (Chilli, Onion, Garlic)"
        ],
        border_color=(30, 90, 200)
    )

    # 2. Spice / Masala (Spices / Masala -> Turmeric)
    draw_label(
        "product_12_spice.jpg", (255, 255, 240), (180, 40, 20),
        "EVEREST", "PURE TURMERIC POWDER SPICE",
        [
            ("Net Weight", "100 g"),
            ("MRP (incl. of all taxes)", "Rs. 38.00"),
            ("Batch No.", "EV-TR881"),
            ("Date of Packaging", "20/09/2026"),
            ("Best Before", "12 Months from packaging"),
            ("FSSAI Lic. No.", "10012022000214"),
        ],
        [
            "Manufactured by: S.Everest Food Products Pvt. Ltd., Mumbai",
            "Consumer Care: customercare@everestspices.com | 022-28562300",
            "Ingredients: 100% Pure Agmark Grade Haldi Turmeric Rhizomes"
        ],
        border_color=(200, 50, 30)
    )

    # 3. Breakfast Cereal (Breakfast Cereals -> Corn Flakes)
    draw_label(
        "product_13_cereal.jpg", (255, 255, 255), (200, 20, 20),
        "KELLOGG'S", "CORN FLAKES BREAKFAST CEREAL",
        [
            ("Net Quantity", "475 g"),
            ("MRP (Inclusive of taxes)", "Rs. 195.00"),
            ("Batch Number", "KCF-9901"),
            ("Date of Manufacture", "10/09/2026"),
            ("Best Before", "9 Months from MFD"),
            ("FSSAI Lic. No.", "10013022001923"),
        ],
        [
            "Manufactured by: Kellogg India Pvt. Ltd., Taloja, MIDC, Raigad",
            "Customer Helpline: 1800 223 500 | consumerfeedback@kellogg.com",
            "Ingredients: Milled Corn, Sugar, Malt Extract, Iodized Salt, Vitamins"
        ],
        border_color=(210, 30, 30)
    )

    # 4. Sauce / Jam (Sauces / Spreads -> Tomato Ketchup / Sauce)
    draw_label(
        "product_14_sauce.jpg", (255, 250, 250), (190, 20, 30),
        "KISSAN", "FRESH TOMATO KETCHUP SAUCE",
        [
            ("Net Weight", "950 g"),
            ("MRP (incl. of taxes)", "Rs. 145.00"),
            ("Batch Code", "KS-0926B"),
            ("Date of Packaging", "18/09/2026"),
            ("Best Before", "6 Months from packaging"),
            ("FSSAI Lic. No.", "10013022001777"),
        ],
        [
            "Hindustan Unilever Limited (HUL), B.D. Sawant Marg, Chakala, Andheri East, Mumbai",
            "Consumer Care Executive: lever.care@unilever.com | 1800-10-22-221",
            "Ingredients: Tomato Paste, Water, Sugar, Salt, Acidity Regulator, Spices"
        ],
        border_color=(200, 30, 40)
    )

    # 5. Bakery Products (Bakery Products -> Bread)
    draw_label(
        "product_15_bakery.jpg", (255, 255, 255), (140, 70, 20),
        "BRITANNIA", "100% WHOLE WHEAT BREAD",
        [
            ("Net Weight", "400 g"),
            ("MRP (incl. of taxes)", "Rs. 55.00"),
            ("Batch Identification", "BR-BD44"),
            ("Date of Mfg", "02/10/2026"),
            ("Use By Date", "07/10/2026"),
            ("FSSAI Lic. No.", "10015042001850"),
        ],
        [
            "Manufactured by: Britannia Industries Ltd., Bangalore",
            "Consumer Care: feedback@britindia.com | 1800 425 4449",
            "Ingredients: Whole Wheat Flour (Atta), Water, Yeast, Salt, Sugar"
        ],
        border_color=(150, 80, 30)
    )

    # 6. Sweets (Packaged Sweets -> Chocolates)
    draw_label(
        "product_16_sweets.jpg", (250, 245, 255), (60, 20, 110),
        "CADBURY", "DAIRY MILK CHOCOLATE SWEET",
        [
            ("Net Weight", "130 g"),
            ("MRP (Inclusive of all taxes)", "Rs. 85.00"),
            ("Batch No.", "CD-5510"),
            ("Date of Mfg", "28/08/2026"),
            ("Best Before", "12 Months from MFD"),
            ("FSSAI Lic. No.", "10014022002711"),
        ],
        [
            "Mondelez India Foods Pvt. Ltd., Induri, Talegaon, Pune",
            "Consumer Care: suggestions@mdlz.com | 1800 22 7080",
            "Ingredients: Sugar, Milk Solids, Cocoa Butter, Cocoa Solids, Emulsifiers"
        ],
        border_color=(80, 30, 130)
    )

    # 7. Poor OCR (Degraded image with blur and low contrast)
    draw_label(
        "product_17_poor_ocr.jpg", (240, 240, 240), (120, 120, 120),
        "GENERIC", "POTATO CHIPS SNACK",
        [
            ("Net Wt", "50 g"),
            ("MRP", "Rs. 20.00"),
            ("Batch", "B99"),
            ("Mfg", "01/09/2026"),
            ("FSSAI", "10012011000999"),
        ],
        [
            "Consumer Care: info@snack.com",
            "Store in a dry location"
        ],
        apply_noise=True
    )

    # 8. Missing Product Name (Only statutory declarations, no product name/banner)
    draw_label(
        "product_18_missing_name.jpg", (255, 255, 255), (100, 100, 100),
        "", "",
        [
            ("Net Quantity", "250 g"),
            ("MRP", "Rs. 60.00"),
            ("Batch Identification", "LOT-0091"),
            ("Date of Packaging", "14/09/2026"),
            ("Best Before", "12 Months"),
            ("FSSAI Lic. No.", "10015022000111"),
        ],
        [
            "Manufactured by: Packaging Unit 3, Industrial Estate, Hubli",
            "Customer Care: help@packagedfood.com"
        ]
    )

    # 9. Unknown Non-Food Product (Hardware / Toolset)
    draw_label(
        "product_19_unknown.jpg", (245, 245, 250), (40, 50, 60),
        "STANLEY", "PRECISION SCREWDRIVER HARDWARE SET",
        [
            ("Contents", "6 Pieces"),
            ("MRP (incl. of all taxes)", "Rs. 450.00"),
            ("Part No.", "ST-9912"),
            ("Date of Import", "01/08/2026"),
            ("Country of Origin", "India"),
        ],
        [
            "Imported & Marketed by: Stanley Black & Decker India Pvt. Ltd.",
            "Helpline: 1800 425 8888 | care@stanley.com",
            "For non-electrical repair and mechanical use only"
        ],
        border_color=(50, 60, 70)
    )

    print("[Step 5 Dataset] All supplemental test packaging images created successfully.")


if __name__ == "__main__":
    create_step5_samples()
