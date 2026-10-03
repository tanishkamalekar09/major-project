// TypeScript definitions for ReguCheck AI

export interface OCRTextBlock {
  id?: string;
  text: string;
  confidence: number;
  bounding_box?: number[];
  box?: { x: number; y: number; w?: number; h?: number; width?: number; height?: number };
}

export interface ExtractedFieldItem {
  value: string | null;
  confidence: number | null;
  source_text?: string | null;
}

export interface ProductInformationResponse {
  product_name?: ExtractedFieldItem | null;
  brand_name?: ExtractedFieldItem | null;
  mrp?: ExtractedFieldItem | null;
  net_quantity?: ExtractedFieldItem | null;
  manufacturer?: ExtractedFieldItem | null;
  manufacturing_date?: ExtractedFieldItem | null;
  best_before?: ExtractedFieldItem | null;
  expiry_date?: ExtractedFieldItem | null;
  batch_number?: ExtractedFieldItem | null;
  fssai_license_number?: ExtractedFieldItem | null;
  ingredients?: ExtractedFieldItem | null;
  consumer_care?: ExtractedFieldItem | null;
  country_of_origin?: ExtractedFieldItem | null;
  product_category?: ExtractedFieldItem | null;
}

export interface OCRResult {
  raw_text: string;
  blocks: OCRTextBlock[];
  engine_name: string;
  annotated_image?: string;
  original_image?: string;
  processing_time_ms?: number;
  ocr?: {
    text: string[];
    confidence: number[];
    bounding_boxes: any[];
  };
  product_information?: ProductInformationResponse;
}

export interface ProductInspection {
  id?: string;
  product_name: string;
  category: string;
  status: 'pending' | 'analyzing' | 'completed' | 'flagged';
  compliance_score?: number;
  created_at?: string;
}

export interface ComplianceIssue {
  rule_id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  found_text?: string;
  expected?: string;
}
