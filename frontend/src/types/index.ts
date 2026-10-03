// TypeScript definitions for ReguCheck AI

export interface OCRTextBlock {
  text: string;
  confidence: number;
  bounding_box?: number[];
}

export interface OCRResult {
  raw_text: string;
  blocks: OCRTextBlock[];
  engine_name: string;
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
