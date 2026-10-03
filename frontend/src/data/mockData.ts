// Mock Data for ReguCheck AI

export interface MockOCRBlock {
  id: string;
  text: string;
  confidence: number;
  box: { x: number; y: number; width: number; height: number }; // Percentage coords
  category?: 'brand' | 'legal' | 'ingredient' | 'nutrition' | 'date' | 'general';
}

export interface DetectedField {
  id: string;
  field_name: string;
  standard_key: string;
  detected_value: string;
  confidence: number;
  status: 'verified' | 'warning' | 'missing' | 'compliant';
  category: string;
  regulation_ref?: string;
  notes?: string;
}

export interface ComplianceRuleResult {
  rule_id: string;
  title: string;
  category: string;
  regulation_source: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'passed' | 'warning' | 'failed';
  found_text?: string;
  expected_requirement: string;
  explanation: string;
  remediation: string;
}

export interface InspectionRecord {
  id: string;
  product_name: string;
  brand: string;
  category: string;
  sku: string;
  batch_no: string;
  inspector: string;
  date: string;
  score: number;
  status: 'Compliant' | 'Warning' | 'Non-Compliant' | 'In Review';
  critical_issues: number;
  warnings: number;
  passed_rules: number;
  sample_image: string;
}

export const CURRENT_INSPECTION = {
  id: "INSP-2026-8841",
  product_name: "Nutri-Crunch Almond & Honey Granola",
  brand: "GreenPeak Foods",
  category: "Ready-to-Eat Cereals / Packaged Breakfast",
  subcategory: "Grain-based snacks & cereals",
  jurisdiction: "FSSAI (India) & Legal Metrology Rules 2011",
  package_type: "Printed Pouch (Stand-up Zipper)",
  declared_net_weight: "250 g",
  inspector_name: "Tanishka M. (Senior QA Specialist)",
  inspection_date: "2026-09-28 14:32 IST",
  compliance_score: 74,
  status: "Warning" as const,
  image_url: "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=800&q=80",
};

export const MOCK_OCR_BLOCKS: MockOCRBlock[] = [
  { id: "b1", text: "NUTRI-CRUNCH ALMOND GRANOLA", confidence: 0.99, box: { x: 18, y: 12, width: 64, height: 6 }, category: "brand" },
  { id: "b2", text: "100% Whole Grain Rolled Oats & California Almonds", confidence: 0.96, box: { x: 18, y: 19, width: 64, height: 4 }, category: "general" },
  { id: "b3", text: "Net Quantity: 250 g", confidence: 0.98, box: { x: 60, y: 26, width: 26, height: 4 }, category: "legal" },
  { id: "b4", text: "MRP: Rs. 199.00 (Incl. of all taxes)", confidence: 0.97, box: { x: 60, y: 31, width: 30, height: 4 }, category: "legal" },
  { id: "b5", text: "Unit Sale Price: Rs. 0.796 / g", confidence: 0.95, box: { x: 60, y: 36, width: 28, height: 3 }, category: "legal" },
  { id: "b6", text: "Ingredients: Rolled Oats (52%), California Almonds (15%), Wild Honey, Chia Seeds, Palm Oil, Cocoa Butter, Natural Antioxidant (INS 307b).", confidence: 0.94, box: { x: 15, y: 44, width: 70, height: 8 }, category: "ingredient" },
  { id: "b7", text: "Allergen Advice: Contains Tree Nuts (Almonds). Produced in a facility that also processes Wheat, Milk and Soy.", confidence: 0.92, box: { x: 15, y: 53, width: 70, height: 5 }, category: "ingredient" },
  { id: "b8", text: "Nutritional Information (Per 100g): Energy 442 kcal, Protein 11.8g, Carbohydrates 62.4g, Added Sugars 12.5g, Total Fat 16.8g, Saturated Fat 3.2g, Trans Fat 0g, Sodium 95mg.", confidence: 0.93, box: { x: 15, y: 60, width: 70, height: 12 }, category: "nutrition" },
  { id: "b9", text: "Batch No: NC-26-09A", confidence: 0.98, box: { x: 15, y: 74, width: 32, height: 3 }, category: "date" },
  { id: "b10", text: "Date of Mfg: 12/08/2026", confidence: 0.99, box: { x: 15, y: 78, width: 32, height: 3 }, category: "date" },
  { id: "b11", text: "Best Before: 9 Months from Manufacture", confidence: 0.96, box: { x: 15, y: 82, width: 40, height: 3 }, category: "date" },
  { id: "b12", text: "fssai Lic. No. 10019022009876", confidence: 0.97, box: { x: 55, y: 74, width: 36, height: 4 }, category: "legal" },
  { id: "b13", text: "Manufactured & Marketed by: GreenPeak Foods Pvt. Ltd., Plot 42, Hadapsar Industrial Estate, Pune, Maharashtra - 411028.", confidence: 0.91, box: { x: 15, y: 88, width: 70, height: 5 }, category: "legal" },
  { id: "b14", text: "Consumer Care: help@greenpeakfoods.com | Toll-Free: 1800-209-4455", confidence: 0.94, box: { x: 15, y: 94, width: 70, height: 4 }, category: "legal" },
];

export const MOCK_DETECTED_FIELDS: DetectedField[] = [
  {
    id: "f1",
    field_name: "Brand & Product Name",
    standard_key: "product_identity",
    detected_value: "NUTRI-CRUNCH ALMOND GRANOLA",
    confidence: 0.99,
    status: "compliant",
    category: "General Identity",
    regulation_ref: "FSSAI (Labelling & Display) Reg 5(1)",
    notes: "Clearly displayed on principal display panel.",
  },
  {
    id: "f2",
    field_name: "Net Quantity Declaration",
    standard_key: "net_quantity",
    detected_value: "250 g",
    confidence: 0.98,
    status: "warning",
    category: "Legal Metrology",
    regulation_ref: "Legal Metrology (Packaged Commodities) Rule 9(1)",
    notes: "Font height detected at 2.2mm. Statutory minimum for 200g-500g package is 4.0mm.",
  },
  {
    id: "f3",
    field_name: "FSSAI License & Logo",
    standard_key: "fssai_license",
    detected_value: "Lic. No. 10019022009876",
    confidence: 0.97,
    status: "compliant",
    category: "Regulatory Identity",
    regulation_ref: "FSSAI Reg 5(4) - Display of License Number",
    notes: "14-digit format verified and valid structure.",
  },
  {
    id: "f4",
    field_name: "Allergen Warning Statement",
    standard_key: "allergen_declaration",
    detected_value: "Contains Tree Nuts (Almonds). Produced in facility with Wheat/Soy.",
    confidence: 0.92,
    status: "warning",
    category: "Health & Safety",
    regulation_ref: "FSSAI (Labelling & Display) Reg 5(2)",
    notes: "Allergen font weight matches surrounding body text. Regulation requires bold or distinct contrasting typography.",
  },
  {
    id: "f5",
    field_name: "Vegetarian / Non-Veg Emblem",
    standard_key: "veg_nonveg_logo",
    detected_value: "Missing or Indistinct Symbol",
    confidence: 0.68,
    status: "missing",
    category: "Mandatory Declarations",
    regulation_ref: "FSSAI Reg 5(5) - Green Dot in Green Square Emblem",
    notes: "No compliant green filled circle inside square frame detected on principal panel.",
  },
  {
    id: "f6",
    field_name: "Nutritional Information Panel",
    standard_key: "nutrition_facts",
    detected_value: "Energy, Protein, Carbs, Added Sugars, Total Fat, Trans Fat, Sodium",
    confidence: 0.93,
    status: "compliant",
    category: "Nutritional Declarations",
    regulation_ref: "FSSAI Reg 5(3) - Nutritional facts per 100g/serving",
    notes: "All 7 mandatory macronutrient parameters declared per 100g.",
  },
  {
    id: "f7",
    field_name: "Unit Sale Price (USP)",
    standard_key: "unit_sale_price",
    detected_value: "Rs. 0.796 / g",
    confidence: 0.95,
    status: "compliant",
    category: "Legal Metrology",
    regulation_ref: "Legal Metrology Amendment Rule 6(11)",
    notes: "Mandatory for packages > 100g. Correctly declared with round-off to 2 decimals.",
  },
  {
    id: "f8",
    field_name: "Manufacturer Full Address & Care",
    standard_key: "mfg_address",
    detected_value: "GreenPeak Foods Pvt. Ltd., Plot 42, Hadapsar, Pune - 411028",
    confidence: 0.91,
    status: "compliant",
    category: "Manufacturer Info",
    regulation_ref: "Legal Metrology Rule 6(1)(a)",
    notes: "Complete postal address with PIN code and registered entity name.",
  },
  {
    id: "f9",
    field_name: "Manufacturing Date & Shelf Life",
    standard_key: "mfg_expiry_dates",
    detected_value: "Mfg: 12/08/2026 | Best Before: 9 Months",
    confidence: 0.97,
    status: "compliant",
    category: "Dates & Traceability",
    regulation_ref: "FSSAI Reg 5(7) & Legal Metrology Rule 6(1)(d)",
    notes: "Both manufacture month/year and best before durability statement present.",
  },
];

export const MOCK_COMPLIANCE_RULES: ComplianceRuleResult[] = [
  {
    rule_id: "RULE-LM-009",
    title: "Net Quantity Font Height Compliance",
    category: "Legal Metrology",
    regulation_source: "Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 9, Table 1",
    severity: "critical",
    status: "failed",
    found_text: "Net Quantity: 250 g (font height 2.2 mm)",
    expected_requirement: "Minimum font height of numerals must be ≥ 4.0 mm for packages with net quantity between 200 g and 500 g.",
    explanation: "The font size used for '250 g' is undersized by 1.8 mm. This violates statutory legal metrology requirements and invites consumer inspection penalties.",
    remediation: "Increase typeface height of '250 g' to at least 4.0 mm on the front packaging artwork.",
  },
  {
    rule_id: "RULE-FS-055",
    title: "Vegetarian / Non-Vegetarian Logo Presence",
    category: "Food Safety Standards",
    regulation_source: "FSSAI (Packaging and Labelling) Regulations - Clause 5(5)",
    severity: "critical",
    status: "failed",
    found_text: "Emblem symbol not identified on primary label scan",
    expected_requirement: "A green filled circle inside a green outlined square (min diameter 3mm for < 500g) must appear on the principal display panel.",
    explanation: "Every packaged food product containing only vegetarian ingredients must prominently display the green vegetarian symbol.",
    remediation: "Add the official FSSAI green vegetarian emblem in high-contrast print near the brand title.",
  },
  {
    rule_id: "RULE-FS-052",
    title: "Allergen Typography Contrast & Emphasis",
    category: "Allergen Labeling",
    regulation_source: "FSSAI (Labelling and Display) Regulations, 2020 - Clause 5(2)",
    severity: "high",
    status: "warning",
    found_text: "Allergen Advice: Contains Tree Nuts (Almonds)...",
    expected_requirement: "Allergenic ingredients must be declared in bold uppercase or distinct contrasting typography from standard ingredient list.",
    explanation: "The allergen statement appears in identical regular weight and color font as ordinary ingredients, reducing consumer visibility.",
    remediation: "Change 'Contains Tree Nuts (Almonds)' to bold black font with a subtle border box.",
  },
  {
    rule_id: "RULE-LM-011",
    title: "Unit Sale Price (USP) Declaration",
    category: "Pricing & Legal Metrology",
    regulation_source: "Legal Metrology Rules - Notification GSR 779(E)",
    severity: "medium",
    status: "passed",
    found_text: "Unit Sale Price: Rs. 0.796 / g",
    expected_requirement: "Mandatory declaration of Unit Sale Price in Rs per gram or per 100g.",
    explanation: "Declared clearly and matches calculated price per net weight accurately.",
    remediation: "No remediation required. Compliant.",
  },
  {
    rule_id: "RULE-FS-054",
    title: "FSSAI 14-Digit License Display & Logo",
    category: "Regulatory Identification",
    regulation_source: "Food Safety and Standards (Packaging and Labelling) Regulations",
    severity: "high",
    status: "passed",
    found_text: "fssai Lic. No. 10019022009876",
    expected_requirement: "14-digit alphanumeric code prefixed by valid FSSAI logo on package.",
    explanation: "Valid 14-digit format and matching manufacturing location jurisdiction.",
    remediation: "Compliant.",
  },
  {
    rule_id: "RULE-FS-053",
    title: "Nutritional Information 7 Mandatory Parameters",
    category: "Nutritional Panel",
    regulation_source: "FSSAI 2020 Labelling & Display - Clause 5(3)",
    severity: "high",
    status: "passed",
    found_text: "Energy, Protein, Carbs, Added Sugar, Total Fat, Saturated Fat, Trans Fat, Sodium",
    expected_requirement: "All 7 core nutritional values must be stated per 100g or per single serving.",
    explanation: "Fully compliant table breakdown present.",
    remediation: "Compliant.",
  },
  {
    rule_id: "RULE-LM-006",
    title: "Consumer Grievance Helpline & Address",
    category: "Consumer Protection",
    regulation_source: "Legal Metrology Rule 6(1)(g)",
    severity: "medium",
    status: "passed",
    found_text: "help@greenpeakfoods.com | Toll-Free: 1800-209-4455",
    expected_requirement: "Name, postal address, telephone number and email address of consumer care executive.",
    explanation: "Complete contact details provided.",
    remediation: "Compliant.",
  }
];

export const MOCK_RECENT_INSPECTIONS: InspectionRecord[] = [
  {
    id: "INSP-2026-8841",
    product_name: "Nutri-Crunch Almond & Honey Granola",
    brand: "GreenPeak Foods",
    category: "Cereals & Breakfast",
    sku: "GP-GRN-250",
    batch_no: "NC-26-09A",
    inspector: "Tanishka M.",
    date: "2026-09-28",
    score: 74,
    status: "Warning",
    critical_issues: 2,
    warnings: 1,
    passed_rules: 14,
    sample_image: "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "INSP-2026-8840",
    product_name: "PureDrop Cold Pressed Mustard Oil 1L",
    brand: "PureDrop Agri",
    category: "Edible Oils",
    sku: "PD-OIL-1000",
    batch_no: "MO-8812",
    inspector: "Rahul K.",
    date: "2026-09-27",
    score: 96,
    status: "Compliant",
    critical_issues: 0,
    warnings: 1,
    passed_rules: 18,
    sample_image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "INSP-2026-8839",
    product_name: "ZestyBite Peri Peri Tortilla Chips",
    brand: "ZestyBite Snacks",
    category: "Packaged Snacks",
    sku: "ZB-CHIP-120",
    batch_no: "ZB-0044",
    inspector: "Tanishka M.",
    date: "2026-09-26",
    score: 58,
    status: "Non-Compliant",
    critical_issues: 4,
    warnings: 2,
    passed_rules: 11,
    sample_image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "INSP-2026-8838",
    product_name: "ProActive Whey Isolate Belgian Choc",
    brand: "ProActive Nutrition",
    category: "Nutraceuticals",
    sku: "PA-WHEY-1KG",
    batch_no: "PW-9901",
    inspector: "Vikram S.",
    date: "2026-09-25",
    score: 89,
    status: "Compliant",
    critical_issues: 0,
    warnings: 2,
    passed_rules: 16,
    sample_image: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "INSP-2026-8837",
    product_name: "DairyFresh Greek Blueberry Yogurt 150g",
    brand: "DairyFresh Farms",
    category: "Dairy Products",
    sku: "DF-YOG-150B",
    batch_no: "DF-2026B",
    inspector: "Ananya P.",
    date: "2026-09-24",
    score: 92,
    status: "Compliant",
    critical_issues: 0,
    warnings: 1,
    passed_rules: 17,
    sample_image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "INSP-2026-8836",
    product_name: "HerbalGlow Hydrating Rose Water Mist",
    brand: "HerbalGlow Botanicals",
    category: "Cosmetics & Personal Care",
    sku: "HG-MIST-100",
    batch_no: "HG-0918",
    inspector: "Rahul K.",
    date: "2026-09-23",
    score: 81,
    status: "Warning",
    critical_issues: 1,
    warnings: 3,
    passed_rules: 13,
    sample_image: "https://images.unsplash.com/photo-1608248597359-2a910ec33f8d?auto=format&fit=crop&w=300&q=80",
  },
];

export const MOCK_MONTHLY_TRENDS = [
  { month: "Apr", inspections: 84, compliance_rate: 88 },
  { month: "May", inspections: 112, compliance_rate: 90 },
  { month: "Jun", inspections: 145, compliance_rate: 89 },
  { month: "Jul", inspections: 178, compliance_rate: 92 },
  { month: "Aug", inspections: 210, compliance_rate: 94 },
  { month: "Sep", inspections: 246, compliance_rate: 93 },
];

export const MOCK_CATEGORY_DISTRIBUTION = [
  { name: "Cereals & Grains", count: 320, color: "#2563eb" },
  { name: "Snacks & Confectionery", count: 280, color: "#0ea5e9" },
  { name: "Edible Oils & Sauces", count: 210, color: "#10b981" },
  { name: "Nutraceuticals", count: 185, color: "#f59e0b" },
  { name: "Dairy & Beverages", count: 165, color: "#8b5cf6" },
  { name: "Personal Care", count: 88, color: "#ec4899" },
];

export const MOCK_REGULATIONS = [
  {
    id: "REG-FSSAI-2020",
    name: "FSSAI (Labelling and Display) Regulations, 2020",
    authority: "Food Safety and Standards Authority of India (FSSAI)",
    jurisdiction: "India",
    category: "Food & Dietary Products",
    last_updated: "January 2024",
    rules_count: 48,
    description: "Specifies mandatory labelling parameters including nutritional information, veg/non-veg logo, allergen warnings, date marking, and font height requirements.",
  },
  {
    id: "REG-LM-2011",
    name: "Legal Metrology (Packaged Commodities) Rules, 2011",
    authority: "Department of Consumer Affairs, Govt. of India",
    jurisdiction: "India",
    category: "All Packaged Commodities",
    last_updated: "October 2023",
    rules_count: 36,
    description: "Governs mandatory declarations of Net Quantity, Maximum Retail Price (MRP), Unit Sale Price (USP), manufacturer/importer address, and minimum numeral font heights.",
  },
  {
    id: "REG-FDA-21CFR",
    name: "US FDA 21 CFR Part 101 - Food Labeling",
    authority: "United States Food and Drug Administration (FDA)",
    jurisdiction: "United States / Export",
    category: "Food & Supplements",
    last_updated: "2023",
    rules_count: 62,
    description: "Governs Statement of Identity, Nutrition Facts panel (2016 revised format), Net Quantity in US Customary & Metric units, and Major Food Allergen Labeling (FALCPA).",
  },
  {
    id: "REG-EU-1169",
    name: "EU Regulation (EU) No 1169/2011 on Food Information to Consumers (FIC)",
    authority: "European Food Safety Authority (EFSA) / EU Commission",
    jurisdiction: "European Union / Export",
    category: "Food & Beverage",
    last_updated: "2023",
    rules_count: 54,
    description: "Mandates 14 specified allergens highlighting in ingredients list, mandatory nutrition declaration (Big 7 per 100g/ml), min 1.2mm x-height typography.",
  },
];
