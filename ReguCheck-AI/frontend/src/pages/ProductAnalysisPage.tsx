import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Scan, 
  CheckCircle2, 
  ArrowRight, 
  Cpu, 
  Sparkles, 
  Layers, 
  FileCode, 
  RefreshCw 
} from 'lucide-react';
import { InspectionStepper } from '../components/common/InspectionStepper';
import { CURRENT_INSPECTION } from '../data/mockData';

export const ProductAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(100); // 100% loaded simulation
  const [analyzing, setAnalyzing] = useState(false);

  const pipelineStages = [
    { name: "Image Preprocessing & Auto-Deskew", status: "Completed", time: "0.24s" },
    { name: "Text Region Localization (14 Bounding Boxes)", status: "Completed", time: "0.41s" },
    { name: "Character Recognition (Mock OCR Service)", status: "Completed", time: "0.58s" },
    { name: "NLP Key-Value Entity Extraction", status: "Completed", time: "0.32s" },
    { name: "FSSAI & Legal Metrology Rule Matching", status: "Completed", time: "0.19s" },
  ];

  const handleReRun = () => {
    setAnalyzing(true);
    setProgress(15);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setAnalyzing(false);
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <InspectionStepper />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Step 2: Product Image Analysis</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Automated image processing and multi-stage computer vision scanning pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReRun}
            disabled={analyzing}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-subtle flex items-center gap-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
            <span>Re-analyze</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Visual Scanning Simulation (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Scan className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900">Computer Vision Scanning Preview</h3>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100">
              Target: {CURRENT_INSPECTION.product_name}
            </span>
          </div>

          {/* Scanner Container with animated laser bar */}
          <div className="relative mt-4 rounded-xl overflow-hidden border border-slate-300 bg-slate-950 flex items-center justify-center max-h-[380px]">
            <img 
              src={CURRENT_INSPECTION.image_url} 
              alt="Scan Target" 
              className="w-full h-full object-cover opacity-80"
            />

            {/* Bounding boxes overlays */}
            <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
              {/* Highlight Box 1 (Brand) */}
              <div className="w-3/4 mx-auto h-10 border-2 border-emerald-400 bg-emerald-400/10 rounded flex items-center px-2">
                <span className="text-[9px] bg-emerald-600 text-white font-mono px-1 rounded">BRAND_TITLE (99%)</span>
              </div>
              {/* Highlight Box 2 (Net Wt) */}
              <div className="w-1/2 ml-auto h-8 border-2 border-rose-400 bg-rose-400/20 rounded flex items-center px-2">
                <span className="text-[9px] bg-rose-600 text-white font-mono px-1 rounded">NET_QUANTITY (UNDERTALL)</span>
              </div>
              {/* Highlight Box 3 (FSSAI) */}
              <div className="w-2/3 h-8 border-2 border-blue-400 bg-blue-400/10 rounded flex items-center px-2">
                <span className="text-[9px] bg-blue-600 text-white font-mono px-1 rounded">FSSAI_LIC (VERIFIED)</span>
              </div>
            </div>

            {/* Glowing laser scanning bar */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-pulse top-1/2"></div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Dimensions: 2400 x 1800 px</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Pipeline Ready
            </span>
          </div>
        </div>

        {/* Right: Pipeline Execution Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
            <h3 className="font-bold text-sm text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-600" />
                <span>Detection Pipeline Progress</span>
              </span>
              <span className="text-xs font-bold text-blue-600">{progress}%</span>
            </h3>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-500" 
                style={{ width: `${progress}%` }} 
              />
            </div>

            {/* Stages List */}
            <div className="space-y-3 pt-2">
              {pipelineStages.map((stage, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-xs text-slate-900">{stage.name}</p>
                      <p className="text-[10px] text-slate-400">Execution latency: {stage.time}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                    Done
                  </span>
                </div>
              ))}
            </div>

            {/* Summary Stat Box */}
            <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-100 text-blue-900 text-xs space-y-1">
              <div className="flex items-center justify-between font-semibold">
                <span>Text Blocks Detected:</span>
                <span>14 Regions</span>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <span>OCR Engine:</span>
                <span>Mock OCR Service (v1.0)</span>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <span>Rule Violations Flagged:</span>
                <span className="text-rose-600 font-bold">2 Issues Found</span>
              </div>
            </div>

            {/* Action to proceed to Step 3 */}
            <div className="pt-2">
              <Link
                to="/inspect/ocr"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition"
              >
                <span>Proceed to OCR Results</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
