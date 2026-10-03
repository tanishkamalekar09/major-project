import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Info, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { InspectionStepper } from '../components/common/InspectionStepper';

export const NewInspectionPage: React.FC = () => {
  const navigate = useNavigate();

  const [productName, setProductName] = useState('Nutri-Crunch Almond & Honey Granola');
  const [brand, setBrand] = useState('GreenPeak Foods');
  const [category, setCategory] = useState('Cereals & Breakfast');
  const [jurisdiction, setJurisdiction] = useState('FSSAI (India) + Legal Metrology 2011');
  const [netWeight, setNetWeight] = useState('250 g');
  const [packageType, setPackageType] = useState('Stand-up Zipper Pouch');
  
  // Image preview state
  const [imagePreview, setImagePreview] = useState<string>(
    'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=800&q=80'
  );
  const [fileName, setFileName] = useState('nutri_crunch_label_artwork_v2.jpg');

  const samplePresets = [
    {
      name: 'Nutri-Crunch Granola (250g)',
      brand: 'GreenPeak Foods',
      category: 'Cereals & Breakfast',
      weight: '250 g',
      image: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=800&q=80',
      file: 'granola_pouch_artwork.jpg',
    },
    {
      name: 'PureDrop Cold Pressed Mustard Oil',
      brand: 'PureDrop Agri',
      category: 'Edible Oils',
      weight: '1000 ml',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
      file: 'mustard_oil_bottle_label.jpg',
    },
    {
      name: 'ProActive Whey Protein Isolate',
      brand: 'ProActive Nutrition',
      category: 'Nutraceuticals',
      weight: '1000 g',
      image: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&w=800&q=80',
      file: 'whey_jar_label.jpg',
    },
  ];

  const handleApplyPreset = (preset: typeof samplePresets[0]) => {
    setProductName(preset.name);
    setBrand(preset.brand);
    setCategory(preset.category);
    setNetWeight(preset.weight);
    setImagePreview(preset.image);
    setFileName(preset.file);
  };

  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/inspect/analysis');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 8-Step Stepper Navigation */}
      <InspectionStepper />

      {/* Page Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Step 1: New Product Inspection</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Upload high-resolution label scans or print-ready packaging artwork to initiate compliance verification.
          </p>
        </div>

        <div className="text-xs px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg flex items-center gap-1.5 self-start">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Stage: Artwork Ingestion</span>
        </div>
      </div>

      {/* Quick Preset Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Quick Demo Presets (Pre-loaded Label Artworks):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {samplePresets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="px-3 py-1.5 text-xs bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 hover:border-blue-300 rounded-lg transition font-medium text-slate-700"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleStartAnalysis} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Metadata Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
            <h3 className="font-bold text-sm text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Product Specifications</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Product Commercial Title *
              </label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Declared Net Wt</label>
                <input
                  type="text"
                  value={netWeight}
                  onChange={(e) => setNetWeight(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Product Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800"
                >
                  <option>Cereals & Breakfast</option>
                  <option>Snacks & Confectionery</option>
                  <option>Edible Oils & Fats</option>
                  <option>Dairy & Beverages</option>
                  <option>Nutraceuticals & Health</option>
                  <option>Personal Care & Cosmetics</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Packaging Format</label>
                <select
                  value={packageType}
                  onChange={(e) => setPackageType(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800"
                >
                  <option>Stand-up Zipper Pouch</option>
                  <option>Rigid Plastic Bottle</option>
                  <option>Glass Jar / Bottle</option>
                  <option>Carton Box</option>
                  <option>Pillow Sachet</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Compliance Rulepack
              </label>
              <select
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800"
              >
                <option>FSSAI (India) + Legal Metrology 2011</option>
                <option>US FDA 21 CFR Part 101 (US Export)</option>
                <option>EU FIC Regulation 1169/2011 (EU Export)</option>
                <option>Multi-Jurisdiction Global Screening</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p>
              The OCR service abstraction will read label elements and pass them directly to the 
              information extraction and compliance rule engine.
            </p>
          </div>
        </div>

        {/* Right Column: Image Upload Area (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle">
            <h3 className="font-bold text-sm text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <span>Upload Product Label Artwork</span>
              </span>
              <span className="text-[11px] font-normal text-slate-500">JPG, PNG, WebP up to 25MB</span>
            </h3>

            {/* Dropzone */}
            <div className="mt-4 border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-blue-500 hover:bg-blue-50/20 transition cursor-pointer flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-slate-800">
                Drag and drop your label scan here, or <span className="text-blue-600 hover:underline">browse files</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                For best results, upload flat unwarped scans with legible typography
              </p>
            </div>

            {/* Current Loaded Image Preview */}
            {imagePreview && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                <img 
                  src={imagePreview} 
                  alt="Label Artwork Preview" 
                  className="w-24 h-24 object-cover rounded-lg border border-slate-300 shadow-sm shrink-0" 
                />
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className="text-xs font-bold text-slate-900">{fileName}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Resolution: 2400 x 1800 px • Color Space: sRGB</p>
                  <p className="text-[11px] text-blue-600 font-medium mt-1">Pre-processing filters applied: Auto-deskew & High Contrast</p>
                </div>
              </div>
            )}

            {/* Submit / Proceed Action */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Ready to extract text via Mock OCR Engine
              </span>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition"
              >
                <span>Run Image Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
