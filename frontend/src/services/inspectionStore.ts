// Global Active Inspection Store
// Keeps the currently inspected product in sync across all 8 pipeline steps

export interface ActiveInspection {
  id: string;
  product_name: string;
  brand: string;
  category: string;
  subcategory: string;
  package_type: string;
  declared_net_weight: string;
  jurisdiction: string;
  image_url: string;
  annotated_image?: string;
  original_image?: string;
  inspection_date: string;
  inspector_name: string;
  compliance_score: number;
  status: 'Compliant' | 'Warning' | 'Non-Compliant' | 'In Review';
  ocrResult?: any;
  autoDetectedInfo?: {
    brand?: string;
    productTitle?: string;
    netWeight?: string;
    mrp?: string;
    fssai?: string;
    date?: string;
  };
}

const DEFAULT_INSPECTION: ActiveInspection = {
  id: "INSP-2026-9042",
  product_name: "Packaged Product Artwork",
  brand: "Detected Brand",
  category: "Packaged Food & Commodity",
  subcategory: "Consumer Packaged Goods",
  package_type: "Printed Pouch / Rigid Pack",
  declared_net_weight: "Standard Unit",
  jurisdiction: "FSSAI (India) & Legal Metrology Rules 2011",
  image_url: "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=800&q=80",
  inspection_date: new Date().toLocaleString(),
  inspector_name: "Automated AI Compliance Engine",
  compliance_score: 78,
  status: "Warning",
};

const STORAGE_KEY = "regucheck_active_inspection";

export function getActiveInspection(): ActiveInspection {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_INSPECTION, ...JSON.parse(raw) };
    }
  } catch (_) {}
  return DEFAULT_INSPECTION;
}

export function setActiveInspection(data: Partial<ActiveInspection>): ActiveInspection {
  const current = getActiveInspection();
  const updated = { ...current, ...data };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (_) {}
  return updated;
}
