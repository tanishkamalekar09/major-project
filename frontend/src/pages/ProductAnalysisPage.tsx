import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Scan, 
  CheckCircle2, 
  ArrowRight, 
  Cpu, 
  Sparkles, 
  Layers, 
  FileCode, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { InspectionStepper } from '../components/common/InspectionStepper';
import { uploadAndProcessOCR, processPresetSample } from '../services/api';
import { OCRResult } from '../types';
import { getActiveInspection, setActiveInspection } from '../services/inspectionStore';
import { extractProductInformation, ExtractedProductInfo } from '../services/genericExtractor';

export const ProductAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state as any) || {};
  const activeInspection = getActiveInspection();

  const file = navState.file as File | undefined;
  const sampleId = navState.sampleId as string | undefined;
  const imagePreview = navState.imagePreview || activeInspection.image_url;
  const productName = navState.productName || activeInspection.product_name;

  const [progress, setProgress] = useState(20);
  const [analyzing, setAnalyzing] = useState(true);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [extractedInfo, setExtractedInfo] = useState<ExtractedProductInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stageIndex, setStageIndex] = useState(1);
  const hasTriggeredRef = useRef(false);

  const runAnalysis = async () => {
    setAnalyzing(true);
    setError(null);
    setProgress(25);
    setStageIndex(1);

    const stageTimer = setInterval(() => {
      setProgress((prev) => (prev < 85 ? prev + 15 : prev));
      setStageIndex((prev) => (prev < 4 ? prev + 1 : prev));
    }, 600);

    try {
      let result: OCRResult;
      if (file) {
        result = await uploadAndProcessOCR(file);
      } else if (sampleId) {
        result = await processPresetSample(sampleId);
      } else {
        result = await processPresetSample('product_01');
      }

      clearInterval(stageTimer);
      setOcrResult(result);

      // Perform generic AI packaging entity extraction for ANY uploaded product
      const extracted = extractProductInformation(result, file?.name || sampleId || navState.fileName);
      setExtractedInfo(extracted);

      // Immediately synchronize active inspection store
      setActiveInspection({
        product_name: extracted.productTitle,
        brand: extracted.brand,
        category: extracted.category,
        subcategory: extracted.subcategory,
        declared_net_weight: extracted.netWeight,
        image_url: result.annotated_image || imagePreview,
        annotated_image: result.annotated_image,
        original_image: result.original_image || imagePreview,
        ocrResult: result,
        autoDetectedInfo: extracted,
      });

      setProgress(100);
      setStageIndex(5);
      setAnalyzing(false);
    } catch (err: any) {
      clearInterval(stageTimer);
      setAnalyzing(false);
      setError(err.message || 'OCR processing failed on backend.');
    }
  };

  useEffect(() => {
    if (!hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      runAnalysis();
    }
  }, []);

  const pipelineStages = [
    { 
      name: "Image Preprocessing & Auto-Deskew", 
      status: stageIndex >= 2 ? "Completed" : analyzing ? "Running" : "Pending", 
      time: ocrResult ? "0.12s" : "0.24s" 
    },
    { 
      name: `Text Region Localization (${ocrResult ? ocrResult.blocks.length : '...'} Bounding Boxes)`, 
      status: stageIndex >= 3 ? "Completed" : analyzing ? "Running" : "Pending", 
      time: ocrResult ? `${((ocrResult.processing_time_ms || 1000) * 0.4 / 1000).toFixed(2)}s` : "0.41s" 
    },
    { 
      name: `Character Recognition (${ocrResult ? ocrResult.engine_name : 'EasyOCR CRAFT + CRNN'})`, 
      status: stageIndex >= 4 ? "Completed" : analyzing ? "Running" : "Pending", 
      time: ocrResult ? `${((ocrResult.processing_time_ms || 1000) * 0.6 / 1000).toFixed(2)}s` : "0.58s" 
    },
    { 
      name: "Bounding Box & Confidence Scoring", 
      status: stageIndex >= 5 ? "Completed" : analyzing ? "Running" : "Pending", 
      time: "0.08s" 
    },
  ];

  const handleProceed = () => {
    const extracted = extractedInfo || extractProductInformation(ocrResult || undefined, file?.name || sampleId || navState.fileName);

    setActiveInspection({
      product_name: extracted.productTitle,
      brand: extracted.brand,
      category: extracted.category,
      subcategory: extracted.subcategory,
      declared_net_weight: extracted.netWeight,
      image_url: ocrResult?.annotated_image || imagePreview,
      annotated_image: ocrResult?.annotated_image,
      original_image: ocrResult?.original_image || imagePreview,
      ocrResult: ocrResult || undefined,
      autoDetectedInfo: extracted,
    });

    navigate('/inspect/ocr', {
      state: {
        ocrResult,
        autoDetectedInfo: extracted,
        imagePreview: ocrResult?.annotated_image || imagePreview,
        originalImage: ocrResult?.original_image || imagePreview,
        productName: extracted.productTitle,
      },
    });
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
            onClick={runAnalysis}
            disabled={analyzing}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-subtle flex items-center gap-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
            <span>Re-analyze</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={runAnalysis}
            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs transition"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Visual Scanning Simulation (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Scan className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900">Computer Vision Scanning Preview</h3>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100 truncate max-w-[200px]">
              Target: {productName}
            </span>
          </div>

          {/* Scanner Container with animated laser bar */}
          <div className="relative mt-4 rounded-xl overflow-hidden border border-slate-300 bg-slate-950 flex items-center justify-center max-h-[380px]">
            <img 
              src={ocrResult?.annotated_image || imagePreview} 
              alt="Scan Target" 
              className="w-full h-full object-contain max-h-[380px]"
            />

            {/* Glowing laser scanning bar during analysis */}
            {analyzing && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-pulse top-1/2"></div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>OCR Status: {analyzing ? 'Extracting Text...' : ocrResult ? 'Extraction Complete' : 'Ready'}</span>
            <span className={`font-semibold flex items-center gap-1 ${ocrResult ? 'text-emerald-600' : 'text-slate-500'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" /> {analyzing ? 'Processing CRAFT + CRNN' : 'Pipeline Ready'}
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
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${stage.status === 'Completed' ? 'text-emerald-600' : stage.status === 'Running' ? 'text-blue-600 animate-spin' : 'text-slate-300'}`} />
                    <div>
                      <p className="font-semibold text-xs text-slate-900">{stage.name}</p>
                      <p className="text-[10px] text-slate-400">Execution latency: {stage.time}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${stage.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : stage.status === 'Running' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                    {stage.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Summary Stat Box */}
            <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-100 text-blue-900 text-xs space-y-1">
              <div className="flex items-center justify-between font-semibold">
                <span>Text Blocks Detected:</span>
                <span>{ocrResult ? `${ocrResult.blocks.length} Regions` : analyzing ? 'Detecting...' : 'Pending'}</span>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <span>OCR Engine:</span>
                <span>{ocrResult ? ocrResult.engine_name : 'EasyOCR (PyTorch CRAFT + CRNN)'}</span>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <span>Processing Latency:</span>
                <span className="text-emerald-700 font-bold">{ocrResult?.processing_time_ms ? `${ocrResult.processing_time_ms} ms` : analyzing ? 'Running...' : '—'}</span>
              </div>
            </div>

            {/* Action to proceed to Step 3 */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleProceed}
                disabled={analyzing || !ocrResult}
                className={`w-full py-2.5 px-4 font-semibold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition ${
                  analyzing || !ocrResult
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                }`}
              >
                <span>{analyzing ? 'Processing Image...' : 'Proceed to OCR Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
