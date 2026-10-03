import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft,
  Copy, 
  Check, 
  Eye, 
  Layers, 
  Sparkles, 
  Cpu, 
  Image as ImageIcon,
  FileCode,
  Tag,
  Hash,
  Calendar,
  Building2,
  Package,
  Info
} from 'lucide-react';
import { InspectionStepper } from '../components/common/InspectionStepper';
import { OCRResult } from '../types';
import { getActiveInspection } from '../services/inspectionStore';

interface FieldDefinition {
  key: string;
  label: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const STATUTORY_FIELDS: FieldDefinition[] = [
  { key: 'product_name', label: 'Product Name', category: 'General Identity', icon: Tag, description: 'Commercial product designation' },
  { key: 'brand_name', label: 'Brand', category: 'General Identity', icon: Building2, description: 'Brand trademark or trade name' },
  { key: 'mrp', label: 'MRP', category: 'Legal Metrology', icon: Tag, description: 'Maximum Retail Price (incl. of all taxes)' },
  { key: 'net_quantity', label: 'Net Quantity', category: 'Legal Metrology', icon: Package, description: 'Declared weight, volume, or count' },
  { key: 'manufacturer', label: 'Manufacturer / Packer', category: 'General Identity', icon: Building2, description: 'Name of manufacturing or packing corporate entity' },
  { key: 'manufacturing_date', label: 'Manufacturing Date', category: 'Dates & Traceability', icon: Calendar, description: 'Date of manufacturing / packing' },
  { key: 'best_before', label: 'Best Before', category: 'Dates & Traceability', icon: Calendar, description: 'Best before duration / expiry statement' },
  { key: 'expiry_date', label: 'Expiry Date', category: 'Dates & Traceability', icon: Calendar, description: 'Statutory expiration or use-by date' },
  { key: 'batch_number', label: 'Batch / Lot Number', category: 'Dates & Traceability', icon: Hash, description: 'Production lot identification code' },
  { key: 'fssai_license_number', label: 'FSSAI License', category: 'Regulatory Identity', icon: CheckCircle2, description: '14-digit FSSAI food safety license number' },
  { key: 'ingredients', label: 'Ingredients', category: 'Mandatory Declarations', icon: Layers, description: 'List of ingredients in descending order' },
  { key: 'consumer_care', label: 'Consumer Care', category: 'Consumer Protection', icon: Info, description: 'Customer care helpline, email or address' },
  { key: 'country_of_origin', label: 'Country of Origin', category: 'Legal Metrology', icon: Building2, description: 'Country of product manufacturing/assembly' },
  { key: 'product_category', label: 'Product Category', category: 'Classification', icon: Sparkles, description: 'Identified packaged food category' },
];

export const DetectedInfoPage: React.FC = () => {
  const location = useLocation();
  const navState = (location.state as any) || {};
  const activeInspection = getActiveInspection();

  const ocrResult = (navState.ocrResult as OCRResult | undefined) || activeInspection.ocrResult;
  const imagePreview = navState.imagePreview || activeInspection.annotated_image || activeInspection.image_url;
  const originalImage = navState.originalImage || activeInspection.original_image || imagePreview;

  const productInfo = ocrResult?.product_information;

  const [activeTab, setActiveTab] = useState<'table' | 'cards'>('table');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [imageMode, setImageMode] = useState<'annotated' | 'original'>(
    ocrResult?.annotated_image ? 'annotated' : 'original'
  );

  // Compute stats
  const detectedCount = STATUTORY_FIELDS.filter(f => {
    const item = productInfo ? (productInfo as any)[f.key] : null;
    return item && item.value !== null && item.value !== undefined && item.value !== '';
  }).length;

  const avgConfidence = ocrResult?.blocks && ocrResult.blocks.length > 0
    ? Math.round(
        (ocrResult.blocks.reduce((acc: number, b: any) => acc + (b.confidence || 0), 0) / ocrResult.blocks.length) * 100
      )
    : null;

  const handleCopyValue = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleCopyRawText = () => {
    if (ocrResult?.raw_text) {
      navigator.clipboard.writeText(ocrResult.raw_text);
      setCopiedRaw(true);
      setTimeout(() => setCopiedRaw(false), 1800);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <InspectionStepper />

      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
              STEP 4
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Extracted Product Information
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Structured information extracted directly from raw OCR output using keyword matching, regex patterns, and text normalization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/inspect/ocr"
            state={{ ocrResult, imagePreview, originalImage }}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-subtle flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Step 3: OCR</span>
          </Link>

          <Link
            to="/inspect/classification"
            state={{ ocrResult, imagePreview, originalImage }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition"
          >
            <span>Step 5: Classification</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Fields Detected</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {detectedCount} <span className="text-xs font-normal text-slate-400">/ {STATUTORY_FIELDS.length}</span>
          </p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${(detectedCount / STATUTORY_FIELDS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Avg OCR Confidence</span>
            <Cpu className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {avgConfidence !== null ? `${avgConfidence}%` : '—'}
          </p>
          <span className="text-[10px] text-slate-400">EasyOCR CRAFT + CRNN</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Text Elements</span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {ocrResult?.blocks?.length || 0}
          </p>
          <span className="text-[10px] text-slate-400">Detected bounding boxes</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Extraction Mode</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-sm font-bold text-slate-900 mt-1 truncate">
            Deterministic Heuristic
          </p>
          <span className="text-[10px] text-emerald-600 font-medium">No hallucination / Real OCR</span>
        </div>
      </div>

      {/* Missing Text or OCR Error Alert if applicable */}
      {(!ocrResult || !ocrResult.blocks || ocrResult.blocks.length === 0) && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">No OCR text detected for this image</p>
            <p className="text-amber-800 mt-0.5">
              The OCR service could not extract readable characters from this image. Fields that cannot be detected will return <code>null</code> ("Not detected").
            </p>
          </div>
        </div>
      )}

      {/* Main Section: Extracted Product Information */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        {/* Table/Card Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Extracted Product Information
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                {STATUTORY_FIELDS.length} Statutory Declarations
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Normalized extracted values, confidence scores, and source OCR text snippets. Undetected fields are strictly marked "Not detected".
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                activeTab === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setActiveTab('cards')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                activeTab === 'cards' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Card View
            </button>
          </div>
        </div>

        {/* View Mode 1: Detailed Table */}
        {activeTab === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-5">#</th>
                  <th className="py-3 px-4">Field</th>
                  <th className="py-3 px-4">Extracted Value</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-5">Source OCR Text</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {STATUTORY_FIELDS.map((fieldDef, idx) => {
                  const item = productInfo ? (productInfo as any)[fieldDef.key] : null;
                  const isDetected = item && item.value !== null && item.value !== undefined && item.value !== '';
                  const value = isDetected ? item.value : null;
                  const conf = isDetected && item.confidence !== null && item.confidence !== undefined 
                    ? Math.round(item.confidence * 100) 
                    : null;
                  const sourceText = isDetected ? (item.source_text || null) : null;
                  const Icon = fieldDef.icon;

                  return (
                    <tr 
                      key={fieldDef.key} 
                      className={`transition ${isDetected ? 'hover:bg-slate-50/80' : 'bg-slate-50/30 text-slate-400'}`}
                    >
                      <td className="py-3.5 px-5 font-mono text-[11px] text-slate-400">
                        {idx + 1}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg shrink-0 ${isDetected ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 block">{fieldDef.label}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{fieldDef.key}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        {isDetected ? (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 text-xs break-words">
                              {value}
                            </span>
                            <button
                              onClick={() => handleCopyValue(fieldDef.key, value)}
                              className="text-slate-400 hover:text-blue-600 transition shrink-0"
                              title="Copy extracted value"
                            >
                              {copiedKey === fieldDef.key ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-500 italic">
                            Not detected
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {isDetected ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Detected</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                            <span>Not detected</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {conf !== null ? (
                          <span className="font-mono text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            {conf}%
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono text-xs">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-5 max-w-sm">
                        {sourceText ? (
                          <code className="text-[11px] bg-slate-100/90 text-slate-800 px-2 py-1 rounded font-mono block truncate max-w-xs" title={sourceText}>
                            {sourceText}
                          </code>
                        ) : (
                          <span className="text-slate-400 text-xs italic">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* View Mode 2: Card Grid */
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {STATUTORY_FIELDS.map((fieldDef) => {
              const item = productInfo ? (productInfo as any)[fieldDef.key] : null;
              const isDetected = item && item.value !== null && item.value !== undefined && item.value !== '';
              const value = isDetected ? item.value : null;
              const conf = isDetected && item.confidence !== null && item.confidence !== undefined 
                ? Math.round(item.confidence * 100) 
                : null;
              const sourceText = isDetected ? (item.source_text || null) : null;
              const Icon = fieldDef.icon;

              return (
                <div
                  key={fieldDef.key}
                  className={`p-4 rounded-xl border transition flex flex-col justify-between ${
                    isDetected 
                      ? 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-subtle' 
                      : 'border-slate-100 bg-slate-50/60 opacity-80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${isDetected ? 'bg-blue-50 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-xs text-slate-900">{fieldDef.label}</span>
                      </div>

                      {isDetected ? (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {conf}%
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                          Not detected
                        </span>
                      )}
                    </div>

                    <div className="my-2">
                      {isDetected ? (
                        <p className="text-sm font-bold text-slate-900 leading-snug break-words">
                          {value}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400 italic">
                          Not detected
                        </p>
                      )}
                    </div>
                  </div>

                  {sourceText && (
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <p className="text-[10px] text-slate-400 uppercase font-mono">Source OCR:</p>
                      <code className="text-[10px] text-slate-700 font-mono block truncate" title={sourceText}>
                        {sourceText}
                      </code>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Note */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            Showing 14 standardized statutory attributes compliant with Legal Metrology and FSSAI frameworks.
          </span>
          <Link
            to="/inspect/classification"
            state={{ ocrResult, imagePreview, originalImage }}
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 self-end sm:self-auto"
          >
            <span>Proceed to Step 5: Classification</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* STEP 5: Product Classification Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Product Classification
              </h2>
              <p className="text-xs text-slate-500">
                Automated rule-based categorization based on OCR text, product title, and packaging indicators.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Step 5 Classifier
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Category */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
            <span className="text-slate-400 text-xs font-medium block mb-1">Category</span>
            <p className="text-base font-bold text-slate-900 break-words">
              {ocrResult?.classification?.category || (activeInspection?.category && activeInspection.category !== 'Packaged Food & Commodity' ? activeInspection.category : 'Unknown')}
            </p>
          </div>

          {/* Subcategory */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
            <span className="text-slate-400 text-xs font-medium block mb-1">Subcategory</span>
            <p className="text-base font-bold text-slate-900 break-words">
              {ocrResult?.classification && ocrResult.classification.category !== 'Unknown' && ocrResult.classification.subcategory
                ? ocrResult.classification.subcategory
                : 'Not detected'}
            </p>
          </div>

          {/* Confidence */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
            <span className="text-slate-400 text-xs font-medium block mb-1">Confidence</span>
            <p className="text-base font-bold text-slate-900">
              {ocrResult?.classification && ocrResult.classification.category !== 'Unknown' && ocrResult.classification.confidence !== null && ocrResult.classification.confidence !== undefined
                ? `${Math.round(ocrResult.classification.confidence * 100)}%`
                : 'Not available'}
            </p>
          </div>

          {/* Classification Method */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
            <span className="text-slate-400 text-xs font-medium block mb-1">Classification Method</span>
            <p className="text-base font-bold text-slate-900">
              {ocrResult?.classification && ocrResult.classification.category !== 'Unknown'
                ? (ocrResult.classification.method === 'rule_based' ? 'Rule Based' : ocrResult.classification.method)
                : (ocrResult?.classification?.method === 'insufficient_information' ? 'Insufficient Information' : 'Not available')}
            </p>
          </div>
        </div>
      </div>

      {/* Visual Context & OCR Artifacts (Original Image, Annotated Image, Raw OCR Text) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Original Image & Annotated OCR Image Display (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <span>Product Image & OCR Annotation</span>
              </h3>

              {ocrResult?.annotated_image && (
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[10px] font-semibold">
                  <button
                    onClick={() => setImageMode('annotated')}
                    className={`px-2 py-1 rounded transition ${
                      imageMode === 'annotated' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    Annotated
                  </button>
                  <button
                    onClick={() => setImageMode('original')}
                    className={`px-2 py-1 rounded transition ${
                      imageMode === 'original' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    Original
                  </button>
                </div>
              )}
            </div>

            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-950 aspect-[3/4] flex items-center justify-center">
              {imageMode === 'annotated' && ocrResult?.annotated_image ? (
                <img 
                  src={ocrResult.annotated_image} 
                  alt="Annotated OCR Product Scan" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <img 
                  src={originalImage || imagePreview} 
                  alt="Original Product Scan" 
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Mode: <strong className="text-slate-800 capitalize">{imageMode} View</strong></span>
            <span>{ocrResult?.blocks?.length || 0} regions mapped</span>
          </div>
        </div>

        {/* Right: Raw OCR Stream & Confidence Distribution (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-subtle flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Raw OCR Text Stream & Confidence
                </h3>
              </div>

              <button
                onClick={handleCopyRawText}
                disabled={!ocrResult?.raw_text}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition"
                title="Copy raw OCR text"
              >
                {copiedRaw ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRaw ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>

            {/* Raw OCR Text Box */}
            <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs leading-relaxed max-h-[360px] overflow-y-auto border border-slate-800">
              {ocrResult?.raw_text ? (
                <pre className="whitespace-pre-wrap font-mono">{ocrResult.raw_text}</pre>
              ) : (
                <p className="text-slate-500 italic">No OCR text available for display.</p>
              )}
            </div>
          </div>

          {/* OCR Blocks Breakdown summary */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-slate-800">OCR Engine: </span>
              <span className="text-slate-600">{ocrResult?.engine_name || 'EasyOCR CRAFT + CRNN'}</span>
            </div>
            {ocrResult?.processing_time_ms && (
              <div>
                <span className="font-semibold text-slate-800">Latency: </span>
                <span className="text-emerald-700 font-mono font-bold">{ocrResult.processing_time_ms} ms</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
