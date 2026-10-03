"""
STEP 4: Information Extraction Engine for ReguCheck AI.

Converts raw OCR output and text blocks into structured, normalized
product packaging information using:
- Regular expressions
- Keyword-based matching
- Multi-line & context-based pairing
- Text normalization
- Spatial / layout heuristics from OCR bounding boxes

Strictly returns null for any field that cannot be detected from OCR.
"""

import re
from typing import List, Optional, Tuple, Dict, Any
from ...schemas.extraction import ExtractedField, ProductInformation


class InformationExtractor:
    """
    Extracts 13 statutory packaged food parameters from OCR blocks and text.
    """

    # Comprehensive FMCG brand vocabulary for priority matching
    KNOWN_BRANDS = [
        "BRITANNIA", "HALDIRAM'S", "HALDIRAM", "PARACHUTE", "DABUR", "TATA SALT", "TATA",
        "DETTOL", "AMUL TAAZA", "AMUL", "MAGGI", "HIMALAYAN", "HIMALAYA", "MDH", "EVEREST",
        "AASHIRVAAD", "FORTUNE", "CADBURY", "NESTLE", "LAYS", "KURKURE", "SAFFOLA", "COLGATE",
        "PARLE", "SURF EXCEL", "MARICO", "PATANJALI", "BIKANO", "BALAJI", "CATCH", "BADSHAH",
        "MTR", "MOTHER DAIRY", "NANDINI", "SUNFEAST", "REAL", "TROPICANA", "FROOTI", "MAAZA",
        "HORLICKS", "BOURNVITA", "KNORR", "KISSAN", "CHING'S", "PRIYA", "EPIGAMIA", "PAPER BOAT", "BIKAJI"
    ]

    CATEGORY_KEYWORDS = {
        "Bakery & Confectionery": [
            r"\bcookies?\b", r"\bbiscuits?\b", r"\brusk\b", r"\bcake\b", r"\bcracker\b", r"\btoast\b", r"\bbakery\b"
        ],
        "Snacks & Savouries": [
            r"\bbhujia\b", r"\bnamkeen\b", r"\bchips\b", r"\bsev\b", r"\bpotato noodles\b", r"\bsnacks?\b",
            r"\bchana\b", r"\bpeanut\b", r"\bkurkure\b", r"\blays\b", r"\bmixture\b"
        ],
        "Edible Oils & Fats": [
            r"\bcoconut oil\b", r"\bmustard oil\b", r"\bedible oil\b", r"\bcooking oil\b", r"\bsunflower oil\b",
            r"\brefined oil\b", r"\bgroundnut oil\b", r"\bolive oil\b"
        ],
        "Sweeteners & Honey": [
            r"\bhoney\b", r"\bapiary\b", r"\bnectar\b", r"\bjaggery\b", r"\bsweetener\b"
        ],
        "Ready-to-Eat & Instant Foods": [
            r"\bnoodles?\b", r"\binstant noodles?\b", r"\bpasta\b", r"\bmacaroni\b", r"\bsoup\b", r"\bready to eat\b"
        ],
        "Spices & Condiments": [
            r"\bsalt\b", r"\bmasala\b", r"\bturmeric\b", r"\bchilli\b", r"\bspice\b", r"\bcoriander\b",
            r"\bcumin\b", r"\bpepper\b", r"\bcondiment\b", r"\bseasoning\b"
        ],
        "Dairy Products": [
            r"\bmilk\b", r"\btoned milk\b", r"\bdahi\b", r"\bcurd\b", r"\bpaneer\b",
            r"\bcheese\b", r"\bghee\b", r"\bdairy\b"
        ],
        "Beverages": [
            r"\bmineral water\b", r"\bdrinking water\b", r"\bjuice\b", r"\bbeverage\b", r"\bsquash\b", r"\bsoda\b"
        ],
        "Personal Care & Cosmetics": [
            r"\bhandwash\b", r"\bface wash\b", r"\bsoap\b", r"\bcream\b", r"\blotion\b", r"\bshampoo\b",
            r"\btoothpaste\b", r"\bneem\b"
        ]
    }

    def __init__(self):
        pass

    def extract(self, blocks: List[Any], raw_text: str = "") -> ProductInformation:
        """
        Extract all structured product information from OCR blocks and raw text.
        """
        if not raw_text and blocks:
            raw_text = "\n".join([getattr(b, "text", "") for b in blocks])

        # Normalize line-level texts and confidence
        lines_info: List[Dict[str, Any]] = []
        for b in blocks:
            text = getattr(b, "text", "").strip()
            conf = getattr(b, "confidence", 1.0)
            box = getattr(b, "box", None) or {}
            bbox = getattr(b, "bounding_box", None)
            if text:
                lines_info.append({
                    "text": text,
                    "confidence": conf,
                    "box": box,
                    "bbox": bbox
                })

        # If no blocks provided, split raw text by lines
        if not lines_info and raw_text:
            for line in raw_text.splitlines():
                if line.strip():
                    lines_info.append({
                        "text": line.strip(),
                        "confidence": 0.85,
                        "box": {},
                        "bbox": None
                    })

        # Run extractors for each required field
        brand = self._extract_brand_name(lines_info, raw_text)
        product_name = self._extract_product_name(lines_info, brand.value if brand else None)
        mrp = self._extract_mrp(lines_info, raw_text)
        net_quantity = self._extract_net_quantity(lines_info, raw_text)
        manufacturer = self._extract_manufacturer(lines_info, raw_text)
        manufacturing_date = self._extract_manufacturing_date(lines_info, raw_text)
        best_before = self._extract_best_before(lines_info, raw_text)
        expiry_date = self._extract_expiry_date(lines_info, raw_text)
        batch_number = self._extract_batch_number(lines_info, raw_text)
        fssai_license_number = self._extract_fssai_license(lines_info, raw_text)
        ingredients = self._extract_ingredients(lines_info, raw_text)
        consumer_care = self._extract_consumer_care(lines_info, raw_text)
        country_of_origin = self._extract_country_of_origin(lines_info, raw_text)
        product_category = self._extract_product_category(lines_info, raw_text, product_name.value if product_name else None)

        return ProductInformation(
            product_name=product_name,
            brand_name=brand,
            mrp=mrp,
            net_quantity=net_quantity,
            manufacturer=manufacturer,
            manufacturing_date=manufacturing_date,
            best_before=best_before,
            expiry_date=expiry_date,
            batch_number=batch_number,
            fssai_license_number=fssai_license_number,
            ingredients=ingredients,
            consumer_care=consumer_care,
            country_of_origin=country_of_origin,
            product_category=product_category,
        )

    # -------------------------------------------------------------------------
    # 1. Brand Name
    # -------------------------------------------------------------------------
    def _extract_brand_name(self, lines: List[Dict[str, Any]], raw_text: str) -> Optional[ExtractedField]:
        # Sort brands by length descending so "HIMALAYAN" matches before "TATA", "TATA SALT" before "TATA"
        sorted_brands = sorted(self.KNOWN_BRANDS, key=len, reverse=True)

        # Pass 1: Standalone or prominent brand line (not a corporate suffix line)
        for brand in sorted_brands:
            brand_re = re.compile(rf"\b{re.escape(brand)}\b", re.IGNORECASE)
            for item in lines[:6]:
                txt = item["text"]
                if brand_re.search(txt) and not re.search(r"\b(pvt|ltd|limited|industries|products|company|corp|federation)\b", txt, re.IGNORECASE):
                    return ExtractedField(
                        value=brand.upper(),
                        confidence=round(float(item["confidence"]), 2),
                        source_text=txt
                    )

        # Pass 2: Any matching line
        for brand in sorted_brands:
            brand_re = re.compile(rf"\b{re.escape(brand)}\b", re.IGNORECASE)
            for item in lines:
                if brand_re.search(item["text"]):
                    return ExtractedField(
                        value=brand.upper(),
                        confidence=round(float(item["confidence"]), 2),
                        source_text=item["text"]
                    )

        # Pass 3: Visual Prominence - Uppercase short header in top 40% of package
        for item in lines[:6]:
            txt = item["text"].strip()
            # Ignore standard regulatory / operational words
            if re.match(r"^(net|mrp|mfg|exp|batch|use|fssai|lic|ingredients|nutrition|table|packed|consumer)", txt, re.IGNORECASE):
                continue
            if txt.isupper() and 2 <= len(txt.split()) <= 3 and len(txt) <= 25:
                return ExtractedField(
                    value=txt,
                    confidence=round(float(item["confidence"]), 2),
                    source_text=txt
                )

        return None

    # -------------------------------------------------------------------------
    # 2. Product Name
    # -------------------------------------------------------------------------
    def _extract_product_name(self, lines: List[Dict[str, Any]], detected_brand: Optional[str]) -> Optional[ExtractedField]:
        if not lines:
            return None

        # Look at lines right after the brand or in the first 5 lines
        brand_idx = -1
        if detected_brand:
            for idx, item in enumerate(lines):
                if detected_brand.lower() in item["text"].lower():
                    brand_idx = idx
                    break

        candidates = []
        if brand_idx != -1 and brand_idx + 1 < len(lines):
            # The line right after the brand is almost always the product title
            candidate_item = lines[brand_idx + 1]
            txt = candidate_item["text"].strip()
            if not re.match(r"^(net|mrp|mfg|exp|batch|fssai|lic|rs|₹)", txt, re.IGNORECASE) and len(txt) >= 3:
                return ExtractedField(
                    value=txt,
                    confidence=round(float(candidate_item["confidence"]), 2),
                    source_text=txt
                )

        # Search top lines for common packaged food identifiers
        food_indicators = re.compile(
            r"(cookies|biscuits|noodles|oil|honey|salt|handwash|milk|water|face wash|chips|bhujia|masala|powder|flakes|oats|tea|coffee)",
            re.IGNORECASE
        )
        for item in lines[:8]:
            txt = item["text"].strip()
            if detected_brand and txt.lower() == detected_brand.lower():
                continue
            if food_indicators.search(txt) and not re.match(r"^(net|mrp|ingredients|nutrition)", txt, re.IGNORECASE):
                return ExtractedField(
                    value=txt,
                    confidence=round(float(item["confidence"]), 2),
                    source_text=txt
                )

        # If brand was found at index 0 and index 1 exists
        if len(lines) > 1 and brand_idx == 0:
            next_txt = lines[1]["text"].strip()
            if len(next_txt) >= 4 and not re.match(r"^(net|mrp|mfg|exp|batch|fssai)", next_txt, re.IGNORECASE):
                return ExtractedField(
                    value=next_txt,
                    confidence=round(float(lines[1]["confidence"]), 2),
                    source_text=next_txt
                )

        return None

    # -------------------------------------------------------------------------
    # 3. Maximum Retail Price (MRP)
    # -------------------------------------------------------------------------
    def _extract_mrp(self, lines: List[Dict[str, Any]], raw_text: str) -> Optional[ExtractedField]:
        # Filter out lines that represent Unit Sale Price (USP) rather than MRP
        filtered_lines = [
            item for item in lines 
            if not re.search(r"\b(unit\s*sale\s*price|usp)\b|/\s*(?:g|gm|kg|ml|l|unit)\b", item["text"], re.IGNORECASE)
        ]

        mrp_pattern = re.compile(
            r"(?:MRP|M\.?R\.?P\.?|Maximum\s*Retail\s*Price|Price)[:.\s-]*"
            r"(?:(?:incl\.?|inclusive)\s*(?:of\s*)?(?:all\s*)?taxes)?[:.\s]*"
            r"(?:Rs\.?|₹|_)?\s*([0-9]+(?:\.[0-9]{1,2})?)\s*(?:/-)?",
            re.IGNORECASE
        )

        for i, item in enumerate(filtered_lines):
            txt = item["text"]
            match = mrp_pattern.search(txt)
            if match:
                raw_num = match.group(1)
                normalized_val = self._normalize_currency(raw_num)
                return ExtractedField(
                    value=normalized_val,
                    confidence=round(float(item["confidence"]), 2),
                    source_text=txt
                )

            # Check multi-line split: e.g. Line i: "MRP (incl: of taxes):", Line i+1: "Rs. 28.00" or "14.00"
            if re.search(r"\b(MRP|Maximum\s*Retail\s*Price)\b", txt, re.IGNORECASE) and not re.search(r"\d", txt):
                if i + 1 < len(filtered_lines):
                    next_txt = filtered_lines[i + 1]["text"]
                    num_match = re.search(r"(?:Rs\.?|₹|_)?\s*([0-9]+(?:\.[0-9]{1,2})?)\s*(?:/-)?", next_txt, re.IGNORECASE)
                    if num_match and num_match.group(1):
                        raw_num = num_match.group(1)
                        normalized_val = self._normalize_currency(raw_num)
                        combined_src = f"{txt} {next_txt}"
                        avg_conf = (item["confidence"] + filtered_lines[i + 1]["confidence"]) / 2.0
                        return ExtractedField(
                            value=normalized_val,
                            confidence=round(float(avg_conf), 2),
                            source_text=combined_src
                        )

        # Fallback: Standalone price indicator with ₹ or Rs. (excluding USP)
        for item in filtered_lines:
            txt = item["text"]
            match = re.search(r"(?:₹|Rs\.?)\s*([0-9]+(?:\.[0-9]{1,2})?)\s*(?:/-)?", txt, re.IGNORECASE)
            if match:
                raw_num = match.group(1)
                return ExtractedField(
                    value=self._normalize_currency(raw_num),
                    confidence=round(float(item["confidence"]) * 0.9, 2),
                    source_text=txt
                )

        return None

    def _normalize_currency(self, amount_str: str) -> str:
        """
        Normalizes currency amounts into clean '₹50' or '₹50.50' format.
        """
        try:
            val = float(amount_str)
            if val.is_integer():
                return f"₹{int(val)}"
            return f"₹{val:.2f}"
        except ValueError:
            return f"₹{amount_str}"

    # -------------------------------------------------------------------------
    # 4. Net Quantity / Weight
    # -------------------------------------------------------------------------
    def _extract_net_quantity(self, lines: List[Dict[str, Any]], raw_text: str) -> Optional[ExtractedField]:
        qty_pattern = re.compile(
            r"(?:Net\s*(?:Quantity|Qty|Weight|Wt|Volume|Vol)?[:.\s]*)?"
            r"(\b\d+(?:\.\d+)?)\s*(g|kg|ml|l|gm|gms|grams|litres?|kilograms?|millilitres?|N|units?)\b",
            re.IGNORECASE
        )

        for i, item in enumerate(lines):
            txt = item["text"]
            # Prioritize lines explicitly with 'Net' or metric unit
            if re.search(r"(net|weight|quantity|volume|wt|qty|vol)", txt, re.IGNORECASE):
                match = qty_pattern.search(txt)
                if match:
                    num, unit = match.group(1), match.group(2)
                    norm_unit = self._normalize_unit(unit)
                    return ExtractedField(
                        value=f"{num} {norm_unit}",
                        confidence=round(float(item["confidence"]), 2),
                        source_text=txt
                    )
                # Check next line: e.g. Line i: "Net Weight:", Line i+1: "200 g" or "1 kg"
                if i + 1 < len(lines):
                    next_txt = lines[i + 1]["text"]
                    match2 = qty_pattern.search(next_txt)
                    if match2:
                        num, unit = match2.group(1), match2.group(2)
                        norm_unit = self._normalize_unit(unit)
                        avg_conf = (item["confidence"] + lines[i + 1]["confidence"]) / 2.0
                        return ExtractedField(
                            value=f"{num} {norm_unit}",
                            confidence=round(float(avg_conf), 2),
                            source_text=f"{txt} {next_txt}"
                        )
                    # Special case: line i+1 is just "kg" or "1 L"
                    if re.match(r"^(1\s*)?kg$", next_txt.strip(), re.IGNORECASE):
                        return ExtractedField(
                            value="1 kg",
                            confidence=round(float(item["confidence"]), 2),
                            source_text=f"{txt} {next_txt}"
                        )

        # Fallback: scan any line for standalone weight/volume
        for item in lines:
            txt = item["text"]
            # Exclude nutritional lines (e.g. Protein: 12g, Sodium: 110mg)
            if re.search(r"(per|serving|protein|fat|carbs|sugar|sodium|energy)", txt, re.IGNORECASE):
                continue
            match = re.search(r"\b(\d+(?:\.\d+)?)\s*(g|kg|ml|l|gm|gms)\b", txt, re.IGNORECASE)
            if match:
                num, unit = match.group(1), match.group(2)
                return ExtractedField(
                    value=f"{num} {self._normalize_unit(unit)}",
                    confidence=round(float(item["confidence"]) * 0.9, 2),
                    source_text=txt
                )

        return None

    def _normalize_unit(self, unit_str: str) -> str:
        u = unit_str.lower().strip()
        if u in ["g", "gm", "gms", "grams", "gram"]:
            return "g"
        if u in ["kg", "kgs", "kilogram", "kilograms"]:
            return "kg"
        if u in ["ml", "mls", "millilitre", "millilitres"]:
            return "ml"
        if u in ["l", "ltr", "litre", "litres", "liter"]:
            return "L"
        return u

    # -------------------------------------------------------------------------
    # 5. Manufacturer / Packer / Importer
    # -------------------------------------------------------------------------
    def _extract_manufacturer(self, lines: List[Dict[str, Any]], raw_text: str) -> Optional[ExtractedField]:
        # Priority 1: Corporate entity patterns (e.g. "Britannia Industries Ltd.", "Haldiram Snacks Pvt. Ltd.")
        company_re = re.compile(
            r"([A-Za-z0-9\s&.',-]+?\b(?:Pvt\.?\s*Ltd\.?|Private\s*Limited|Limited|Ltd\.?|Industries|Company|Federation))",
            re.IGNORECASE
        )
        for item in lines:
            txt = item["text"]
            # Skip consumer care mentions and date lines
            if re.search(r"(consumer\s*care|customer\s*care|feedback|helpline|toll[- ]?free|mfg\s*date|pkd\s*date|use\s*by|exp)", txt, re.IGNORECASE) and not re.search(r"\b(ltd|limited|industries)\b", txt, re.IGNORECASE):
                continue
            match = company_re.search(txt)
            if match:
                val = match.group(1).strip()
                val = re.sub(r"^(Manufactured|Packed|Pkd|Marketed|Bottled|Produced|by|at|for)[:.\s]*", "", val, flags=re.IGNORECASE).strip()
                if len(val) >= 5 and not re.search(r"\bdate\b", val, re.IGNORECASE):
                    return ExtractedField(
                        value=val,
                        confidence=round(float(item["confidence"]), 2),
                        source_text=txt
                    )

        # Priority 2: Explicit prefix 'Manufactured by' / 'Packed by' (ignoring date lines)
        mfg_re = re.compile(
            r"(?:Manufactured|Packed|Pkd|Marketed|Imported|Bottled|Produced)\s*(?:by|at|for)?[:.\s]*([^\n\r]+)",
            re.IGNORECASE
        )

        for i, item in enumerate(lines):
            txt = item["text"]
            if re.search(r"\b(date|mfd|pkd\s*date|mfg\s*date|exp)\b", txt, re.IGNORECASE):
                continue

            match = mfg_re.search(txt)
            if match:
                val = match.group(1).strip()
                if len(val) < 4 and i + 1 < len(lines):
                    next_l = lines[i + 1]["text"].strip()
                    if not re.search(r"\bdate\b", next_l, re.IGNORECASE):
                        val = next_l
                        src = f"{txt} {lines[i + 1]['text']}"
                        conf = (item["confidence"] + lines[i + 1]["confidence"]) / 2.0
                    else:
                        continue
                else:
                    src = txt
                    conf = item["confidence"]

                val = re.sub(r"^(by|at|for)[:.\s]*", "", val, flags=re.IGNORECASE).strip()
                if len(val) >= 4 and not re.search(r"\bdate\b", val, re.IGNORECASE):
                    return ExtractedField(
                        value=val,
                        confidence=round(float(conf), 2),
                        source_text=src
                    )

        return None

    # -------------------------------------------------------------------------
    # 6. Manufacturing Date / Packed Date
    # -------------------------------------------------------------------------
    def _extract_manufacturing_date(self, lines: List[Dict[str, Any]], raw_text: str) -> Optional[ExtractedField]:
        date_re = re.compile(
            r"(?:Date\s*of\s*Manufacture|Mfg\s*Date|Date\s*of\s*Packaging|Packing\s*Date|Pkd\s*Date|Date\s*of\s*Mfg|Date\s*of\s*Pkg|Date\s*of\s*Bottling|MFD|MFG|PKD|PACKED)[:.\s]*"
            r"([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{2,4}|[0-9]{1,2}[/-][0-9]{2,4}|[A-Za-z]{3}[.\s]+[0-9]{2,4})",
            re.IGNORECASE
        )

        for i, item in enumerate(lines):
            txt = item["text"]
            match = date_re.search(txt)
            if match:
                date_str = match.group(1).strip()
                return ExtractedField(
                    value=date_str,
                    confidence=round(float(item["confidence"]), 2),
                    source_text=txt
                )
            # Check multi-line: Line i: "Date of Manufacture:", Line i+1: "12/09/2026"
            if re.search(r"\b(Date\s*of\s*Manufacture|Mfg\s*Date|Packing\s*Date|Pkd\s*Date|Date\s*of\s*Mfg|Date\s*of\s*Packaging)\b", txt, re.IGNORECASE):
                if i + 1 < len(lines):
                    next_txt = lines[i + 1]["text"]
                    num_match = re.search(r"([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{2,4}|[0-9]{1,2}[/-][0-9]{2,4})", next_txt)
                    if num_match:
                        return ExtractedField(
                            value=num_match.group(1).strip(),
                            confidence=round(float((item["confidence"] + lines[i + 1]["confidence"]) / 2.0), 2),
                            source_text=f"{txt} {next_txt}"
                        )

        return None

    # -------------------------------------------------------------------------
    # 7. Best Before
    # -------------------------------------------------------------------------
    def _extract_best_before(self, lines: List[Dict[str, Any]], raw_text: str) -> Optional[ExtractedField]:
        bb_re = re.compile(r"(?:Best\s*Before|Best\s*By|BB)[:.\s]*([^\n\r,;]+)", re.IGNORECASE)

        for i, item in enumerate(lines):
            txt = item["text"]
            match = bb_re.search(txt)
            if match:
                val = match.group(1).strip()
                # Check multi-line: e.g. Line i: "Best Before:", Line i+1: "6 Months from packaging"
                if len(val) < 3 and i + 1 < len(lines):
                    val = lines[i + 1]["text"].strip()
                    src = f"{txt} {lines[i + 1]['text']}"
                    conf = (item["confidence"] + lines[i + 1]["confidence"]) / 2.0
                else:
                    src = txt
                    conf = item["confidence"]

                if len(val) >= 3:
                    return ExtractedField(
                        value=val,
                        confidence=round(float(conf), 2),
                        source_text=src
                    )

        return None

    # -------------------------------------------------------------------------
    # 8. Expiry Date / Use By
    # -------------------------------------------------------------------------
    def _extract_expiry_date(self, lines: List[Dict[str, Any]], raw_text: str) -> Optional[ExtractedField]:
        exp_re = re.compile(
            r"(?:Expiry\s*Date|Exp\s*Date|EXP|Use\s*By\s*Date|Use\s*By|Use\s*Before)[:.\s]*([^\n\r,;]+)",
            re.IGNORECASE
        )

        for i, item in enumerate(lines):
            txt = item["text"]
            match = exp_re.search(txt)
            if match:
                val = match.group(1).strip()
                if len(val) < 3 and i + 1 < len(lines):
                    val = lines[i + 1]["text"].strip()
                    src = f"{txt} {lines[i + 1]['text']}"
                    conf = (item["confidence"] + lines[i + 1]["confidence"]) / 2.0
                else:
                    src = txt
                    conf = item["confidence"]

                if len(val) >= 3:
                    return ExtractedField(
                        value=val,
                        confidence=round(float(conf), 2),
                        source_text=src
                    )

        return None

    # -------------------------------------------------------------------------
    # 9. Batch / Lot Number
    # -------------------------------------------------------------------------
    def _extract_batch_number(self, lines: List[Dict[str, Any]], raw_text: str) -> Optional[ExtractedField]:
        batch_re = re.compile(
            r"(?:Batch\s*(?:No\.?|Number|Code|Identification)|Lot\s*(?:No\.?|Number|Code)|Batch\s*/\s*Lot(?:\s*No\.?)?|Batch|Lot)[:.\s-]*"
            r"([A-Za-z0-9\-_/]+)",
            re.IGNORECASE
        )

        reserved_words = {"no", "lot", "code", "number", "identification", "batch"}

        for i, item in enumerate(lines):
            txt = item["text"]
            match = batch_re.search(txt)
            if match:
                val = match.group(1).strip()
                # Exclude label words
                if len(val) >= 2 and val.lower() not in reserved_words:
                    return ExtractedField(
                        value=val,
                        confidence=round(float(item["confidence"]), 2),
                        source_text=txt
                    )

            # Check multi-line: Line i: "Batch Identification:", Line i+1: "B-200926"
            if re.search(r"\b(Batch\s*(?:No|Number|Code|Identification)|Lot\s*(?:Number|No|Code)|Batch\s*/\s*Lot)\b", txt, re.IGNORECASE):
                if i + 1 < len(lines):
                    next_txt = lines[i + 1]["text"].strip()
                    val = next_txt.replace(":", "").strip()
                    if 2 <= len(val) <= 20 and val.lower() not in reserved_words:
                        return ExtractedField(
                            value=val,
                            confidence=round(float((item["confidence"] + lines[i + 1]["confidence"]) / 2.0), 2),
                            source_text=f"{txt} {next_txt}"
                        )

        return None

    # -------------------------------------------------------------------------
    # 10. FSSAI License Number
    # -------------------------------------------------------------------------
    def _extract_fssai_license(self, lines: List[Dict[str, Any]], raw_text: str) -> Optional[ExtractedField]:
        # FSSAI 14-digit pattern
        fssai_re = re.compile(
            r"(?:FSSAI\s*(?:Lic\.?\s*No\.?|License\s*No\.?|Licence|No\.?)?[:.\s]*|\bLic\.?\s*No\.?[:.\s]*)?([12]\d{13})\b",
            re.IGNORECASE
        )

        for item in lines:
            txt = item["text"]
            match = fssai_re.search(txt)
            if match:
                lic_no = match.group(1)
                return ExtractedField(
                    value=lic_no,
                    confidence=round(float(item["confidence"]), 2),
                    source_text=txt
                )

        # Alternative Non-Food License (e.g. Drug Mfg Lic. No. / Ayurvedic Lic. No.)
        alt_lic_re = re.compile(r"(?:Drug\s*Mfg\s*Lic|Ayurvedic\s*Lic)[^:]*[:.\s]*([A-Za-z0-9\-]+)", re.IGNORECASE)
        for item in lines:
            txt = item["text"]
            match = alt_lic_re.search(txt)
            if match:
                return ExtractedField(
                    value=match.group(1).strip(),
                    confidence=round(float(item["confidence"]), 2),
                    source_text=txt
                )

        return None

    # -------------------------------------------------------------------------
    # 11. Ingredients
    # -------------------------------------------------------------------------
    def _extract_ingredients(self, lines: List[Dict[str, Any]], raw_text: str) -> Optional[ExtractedField]:
        ing_re = re.compile(r"(?:Ingredients?|Contents?|Composition)[:.\s]*([^\n\r]+)", re.IGNORECASE)

        for i, item in enumerate(lines):
            txt = item["text"]
            match = ing_re.search(txt)
            if match:
                val = match.group(1).strip()
                # If ingredients continue on following lines
                combined_val = val
                src_lines = [txt]
                conf_sum = item["confidence"]
                count = 1

                curr = i + 1
                while curr < len(lines) and count < 4:
                    next_line = lines[curr]["text"].strip()
                    # Stop if next line is another section header
                    if re.match(r"^(Allergen|Nutritional|Mfg|Best|Exp|Batch|FSSAI|Customer|MRP)", next_line, re.IGNORECASE):
                        break
                    combined_val += " " + next_line
                    src_lines.append(next_line)
                    conf_sum += lines[curr]["confidence"]
                    count += 1
                    curr += 1

                if len(combined_val) >= 5:
                    return ExtractedField(
                        value=combined_val.strip(),
                        confidence=round(float(conf_sum / count), 2),
                        source_text=" ".join(src_lines)
                    )

        return None

    # -------------------------------------------------------------------------
    # 12. Consumer Care Information
    # -------------------------------------------------------------------------
    def _extract_consumer_care(self, lines: List[Dict[str, Any]], raw_text: str) -> Optional[ExtractedField]:
        toll_free_re = re.compile(r"\b(1[- ]?800[- ]?\d{3}[- ]?\d{4}|1800[- ]?\d{2}[- ]?\d{4})\b")
        std_phone_re = re.compile(r"\b(0\d{2,4}[- ]?\d{6,8})\b")
        email_re = re.compile(r"\b([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})\b")

        detected_contacts = []
        source_snippets = []
        confidences = []

        for item in lines:
            txt = item["text"]
            # Look for explicit contact lines or patterns
            has_care_kw = re.search(r"(consumer|customer|care|helpline|feedback|toll|reach us)", txt, re.IGNORECASE)
            
            emails = email_re.findall(txt)
            tolls = toll_free_re.findall(txt)
            stds = std_phone_re.findall(txt)

            if emails or tolls or stds or has_care_kw:
                for e in emails:
                    if e not in detected_contacts:
                        detected_contacts.append(e)
                for t in tolls:
                    if t not in detected_contacts:
                        detected_contacts.append(t)
                for s in stds:
                    if s not in detected_contacts:
                        detected_contacts.append(s)

                if has_care_kw and not (emails or tolls or stds):
                    # Clean the line
                    clean_line = re.sub(r"^(Consumer|Customer)\s*(?:Care|Feedback|Helpline)[:.\s]*", "", txt, flags=re.IGNORECASE).strip()
                    if len(clean_line) >= 6 and clean_line not in detected_contacts:
                        detected_contacts.append(clean_line)

                source_snippets.append(txt)
                confidences.append(item["confidence"])

        if detected_contacts:
            avg_conf = sum(confidences) / len(confidences) if confidences else 0.90
            return ExtractedField(
                value=", ".join(detected_contacts),
                confidence=round(float(avg_conf), 2),
                source_text=" | ".join(source_snippets)
            )

        return None

    # -------------------------------------------------------------------------
    # 13. Country of Origin
    # -------------------------------------------------------------------------
    def _extract_country_of_origin(self, lines: List[Dict[str, Any]], raw_text: str) -> Optional[ExtractedField]:
        origin_re = re.compile(r"(?:Country\s*of\s*Origin|Made\s*in|Product\s*of)[:.\s]*([A-Za-z\s]+)", re.IGNORECASE)

        for item in lines:
            txt = item["text"]
            match = origin_re.search(txt)
            if match:
                country = match.group(1).strip()
                if len(country) >= 2:
                    return ExtractedField(
                        value=country,
                        confidence=round(float(item["confidence"]), 2),
                        source_text=txt
                    )

        # Do NOT invent or assume a value if not found
        return None

    # -------------------------------------------------------------------------
    # 14. Product Category
    # -------------------------------------------------------------------------
    def _extract_product_category(
        self,
        lines: List[Dict[str, Any]],
        raw_text: str,
        detected_product_name: Optional[str]
    ) -> Optional[ExtractedField]:
        combined_text = (raw_text + " " + (detected_product_name or "")).lower()

        for category, patterns in self.CATEGORY_KEYWORDS.items():
            for pattern in patterns:
                match = re.search(pattern, combined_text, re.IGNORECASE)
                if match:
                    return ExtractedField(
                        value=category,
                        confidence=0.92,
                        source_text=match.group(0)
                    )

        return None
