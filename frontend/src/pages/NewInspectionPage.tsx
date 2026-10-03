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
import { setActiveInspection } from '../services/inspectionStore';

export const NewInspectionPage: React.FC = () => {
  const navigate = useNavigate();

  const [productName, setProductName] = useState('Product Label Artwork');
  const [brand, setBrand] = useState('Packaging Brand');
  const [category, setCategory] = useState('Packaged Food & Commodity');
  const [jurisdiction, setJurisdiction] = useState('FSSAI (India) + Legal Metrology 2011');
  const [netWeight, setNetWeight] = useState('Auto-detecting...');
  const [packageType, setPackageType] = useState('Stand-up Zipper Pouch');
  
  // Image upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sampleId, setSampleId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=800&q=80'
  );
  const [fileName, setFileName] = useState('product_label_artwork.jpg');
  const [fileSize, setFileSize] = useState<string>('1.8 MB');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [autoDetect, setAutoDetect] = useState(true);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const samplePresets = [
    {
      id: 'product_01',
      name: 'Britannia Good Day Butter Cookies',
      brand: 'Britannia',
      category: 'Cereals & Breakfast',
      weight: '100 g',
      image: '/product_01.jpg',
      file: 'product_01.jpg',
    },
    {
      id: 'product_02',
      name: "Haldiram's Aloo Bhujia",
      brand: "Haldiram's",
      category: 'Snacks & Confectionery',
      weight: '150 g',
      image: '/product_02.jpg',
      file: 'product_02.jpg',
    },
    {
      name: 'Nutri-Crunch Granola (250g)',
      brand: 'GreenPeak Foods',
      category: 'Cereals & Breakfast',
      weight: '250 g',
      image: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=800&q=80',
      file: 'granola_pouch_artwork.jpg',
    },
  ];

  const handleApplyPreset = (preset: typeof samplePresets[0]) => {
    setProductName(preset.name);
    setBrand(preset.brand);
    setCategory(preset.category);
    setNetWeight(preset.weight);
    setImagePreview(preset.image);
    setFileName(preset.file);
    setFileSize('120 KB');
    setSampleId(preset.id || null);
    setSelectedFile(null);
    setUploadError(null);

    setActiveInspection({
      product_name: preset.name,
      brand: preset.brand,
      category: preset.category,
      declared_net_weight: preset.weight,
      image_url: preset.image,
    });
  };

  const handleProcessSelectedFile = (file: File) => {
    setUploadError(null);
    const validExtensions = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'];
    if (!validExtensions.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|bmp)$/i)) {
      setUploadError(`Unsupported file format. Please upload JPG, PNG, WebP or BMP.`);
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setUploadError('File exceeds 25MB maximum size limit.');
      return;
    }

    const rawBaseName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())
      .trim();
    const detectedTitle = rawBaseName || 'Packaged Product Artwork';
    const detectedBrand = rawBaseName.split(' ')[0] || 'Detected Brand';

    setSelectedFile(file);
    setSampleId(null);
    setFileName(file.name);
    setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    setProductName(detectedTitle);
    setBrand(detectedBrand);

    setActiveInspection({
      product_name: detectedTitle,
      brand: detectedBrand,
      category: 'Auto-detecting from label...',
      image_url: objectUrl,
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessSelectedFile(e.target.files[0]);
    }
  };

  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveInspection({
      product_name: productName,
      brand,
      category,
      declared_net_weight: netWeight,
      jurisdiction,
      package_type: packageType,
      image_url: imagePreview,
    });

    navigate('/inspect/analysis', {
      state: {
        file: selectedFile,
        sampleId,
        fileName,
        fileSize,
        imagePreview,
        productName,
        brand,
        category,
        netWeight,
        jurisdiction,
        packageType,
      },
    });
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
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>AI Auto-Detection</span>
              </h3>
              <label className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded-lg cursor-pointer border border-blue-200 hover:bg-blue-100 transition">
                <input 
                  type="checkbox" 
                  checked={autoDetect} 
                  onChange={(e) => setAutoDetect(e.target.checked)} 
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <span className="font-semibold">Auto-Detect Mode</span>
              </label>
            </div>

            {autoDetect ? (
              <div className="p-3.5 bg-gradient-to-br from-blue-50/90 to-indigo-50/80 border border-blue-200 rounded-xl text-xs text-blue-950 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Zero Manual Entry Active</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  You do not need to type anything. Upload your product label photo and the AI pipeline will <strong>automatically detect and extract</strong> the product commercial title, brand name, declared net quantity, and packaging format.
                </p>
                <div className="pt-1 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-blue-100/80 text-blue-800 font-mono text-[10px] font-semibold">✨ Auto Brand</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100/80 text-blue-800 font-mono text-[10px] font-semibold">✨ Auto Net Wt</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100/80 text-blue-800 font-mono text-[10px] font-semibold">✨ Auto Title</span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                <span className="font-semibold">Manual Overrides Enabled:</span> You can customize the reference specifications below.
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Product Commercial Title
                </label>
                {autoDetect && (
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-medium">Auto-Extracted</span>
                )}
              </div>
              <input
                type="text"
                disabled={autoDetect}
                placeholder={autoDetect ? "Will be automatically detected from packaging image..." : "Enter product title"}
                value={autoDetect ? (productName || "Auto-detected from image...") : productName}
                onChange={(e) => setProductName(e.target.value)}
                className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none transition ${
                  autoDetect
                    ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed italic'
                    : 'bg-slate-50 text-slate-800 border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Brand Name</label>
                  {autoDetect && <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-medium">Auto</span>}
                </div>
                <input
                  type="text"
                  disabled={autoDetect}
                  placeholder={autoDetect ? "Auto-detecting..." : "Enter brand"}
                  value={autoDetect ? (brand || "Auto-detected by AI") : brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none transition ${
                    autoDetect
                      ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed italic'
                      : 'bg-slate-50 text-slate-800 border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600'
                  }`}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Declared Net Wt</label>
                  {autoDetect && <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-medium">Auto</span>}
                </div>
                <input
                  type="text"
                  disabled={autoDetect}
                  placeholder={autoDetect ? "Auto-detecting..." : "e.g. 250 g"}
                  value={autoDetect ? (netWeight || "Auto-detected by AI") : netWeight}
                  onChange={(e) => setNetWeight(e.target.value)}
                  className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none transition ${
                    autoDetect
                      ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed italic'
                      : 'bg-slate-50 text-slate-800 border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Product Category</label>
                <select
                  disabled={autoDetect}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none transition ${
                    autoDetect
                      ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'
                      : 'bg-slate-50 text-slate-800 border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600'
                  }`}
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
                  disabled={autoDetect}
                  value={packageType}
                  onChange={(e) => setPackageType(e.target.value)}
                  className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none transition ${
                    autoDetect
                      ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'
                      : 'bg-slate-50 text-slate-800 border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600'
                  }`}
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
              <span className="text-[11px] font-normal text-slate-500">JPG, PNG, WebP, BMP up to 25MB</span>
            </h3>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept="image/jpeg,image/png,image/webp,image/bmp"
              className="hidden"
            />

            {/* Error Message */}
            {uploadError && (
              <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleProcessSelectedFile(e.dataTransfer.files[0]);
                }
              }}
              className={`mt-4 border-2 border-dashed rounded-2xl p-6 text-center transition cursor-pointer flex flex-col items-center justify-center ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/50'
                  : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50/20'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-slate-800">
                Drag and drop your label scan here, or <span className="text-blue-600 hover:underline">browse files</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Supports real packaged product photos (JPG, PNG, WebP)
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
                      <CheckCircle2 className="w-3 h-3" /> {selectedFile ? 'Ready to Upload' : 'Preset Ready'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Size: {fileSize} • EasyOCR Ready</p>
                  <p className="text-[11px] text-blue-600 font-medium mt-1">
                    {selectedFile ? 'Custom uploaded image will be analyzed by EasyOCR backend' : 'Preset image ready for OCR'}
                  </p>
                </div>
              </div>
            )}

            {/* Submit / Proceed Action */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {selectedFile ? 'Custom product image loaded' : 'Preset product image loaded'}
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
