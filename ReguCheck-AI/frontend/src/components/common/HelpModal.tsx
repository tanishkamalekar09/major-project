import React from 'react';
import { X, HelpCircle, BookOpen, Cpu, ShieldCheck, Mail } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 bg-navy-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base">ReguCheck AI Help & Documentation</h3>
              <p className="text-xs text-slate-300">Quick guide for quality analysts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-sm text-slate-600">
          <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl">
            <h4 className="font-semibold text-blue-900 flex items-center gap-2 mb-1">
              <Cpu className="w-4 h-4 text-blue-600" />
              OCR Service Status: Mock Engine Active
            </h4>
            <p className="text-xs text-blue-700 leading-relaxed">
              Your team is currently using the Mock OCR Service. When your team's custom OCR model is ready, 
              it can be connected to the backend abstraction without altering any frontend screens!
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-semibold text-xs shrink-0">
                1
              </div>
              <div>
                <h5 className="font-medium text-slate-900 text-xs">Upload Product Artwork</h5>
                <p className="text-xs text-slate-500">Upload high-resolution label scans (JPG, PNG, PDF) for front and back panels.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-semibold text-xs shrink-0">
                2
              </div>
              <div>
                <h5 className="font-medium text-slate-900 text-xs">Verify Detected Info</h5>
                <p className="text-xs text-slate-500">Review OCR detected fields such as Net Quantity, MRP, FSSAI License, and Allergen declarations.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-semibold text-xs shrink-0">
                3
              </div>
              <div>
                <h5 className="font-medium text-slate-900 text-xs">Audit Compliance Report</h5>
                <p className="text-xs text-slate-500">Download the compliance certificate or share highlighted issues directly with packaging designers.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              support@regucheck.ai
            </span>
            <span className="font-medium text-slate-700">v0.1.0 (Phase 1 Frontend)</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Got it, thanks
          </button>
        </div>
      </div>
    </div>
  );
};
