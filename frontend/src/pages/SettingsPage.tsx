import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Cpu, 
  ShieldCheck, 
  Bell, 
  Save, 
  CheckCircle2, 
  User, 
  Layers, 
  Building 
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [analystName, setAnalystName] = useState('Tanishka M.');
  const [labName, setLabName] = useState('Central Food Quality & Packaging Assurance Lab');
  const [fssaiEnabled, setFssaiEnabled] = useState(true);
  const [metrologyEnabled, setMetrologyEnabled] = useState(true);
  const [fdaEnabled, setFdaEnabled] = useState(false);
  const [euEnabled, setEuEnabled] = useState(false);
  const [ocrEngine, setOcrEngine] = useState('mock');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System & Compliance Settings</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Configure quality parameters, regulatory jurisdictions, and OCR service provider preferences.
          </p>
        </div>

        {saved && (
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 animate-scale-up">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Settings saved successfully!</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: OCR Service Abstraction Configuration */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">OCR Service Architecture Configuration</h3>
              <p className="text-xs text-slate-400">Pluggable backend optical character recognition layer</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 leading-relaxed space-y-2">
            <p className="font-semibold text-amber-950">Team OCR Integration Note:</p>
            <p>
              Your backend contains an abstract base class in{' '}
              <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">
                backend/app/services/ocr/base.py
              </code>
              . The system is designed so that when your team member finishes developing the OCR model, 
              they can drop their code in and toggle the factory in{' '}
              <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">
                backend/app/services/ocr/__init__.py
              </code>
              . The frontend requires zero changes!
            </p>
          </div>

          <div className="space-y-3 pt-1">
            <label className="block text-xs font-semibold text-slate-700">
              Active OCR Provider:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setOcrEngine('mock')}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition ${
                  ocrEngine === 'mock'
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">Mock OCR Service (Active)</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Simulates realistic packaged label text, coordinates, and confidence scores for rapid UI and rule engine testing.
                </p>
              </div>

              <div
                onClick={() => setOcrEngine('team')}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition ${
                  ocrEngine === 'team'
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">Teammate Custom OCR Service</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-600 font-medium">Slot Ready</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Ready to invoke custom computer vision models (EasyOCR / PaddleOCR / Custom PyTorch model) via the Python backend interface.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Quality Specialist Profile */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Quality Inspector Profile</h3>
              <p className="text-xs text-slate-400">Details printed on official compliance certificates</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Auditor Name</label>
              <input
                type="text"
                value={analystName}
                onChange={(e) => setAnalystName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assurance Facility / Lab</label>
              <input
                type="text"
                value={labName}
                onChange={(e) => setLabName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Regulatory Standard Toggles */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Enabled Regulatory Rulepacks</h3>
              <p className="text-xs text-slate-400">Select which statutory rulebooks to evaluate during packaging audits</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer">
              <div>
                <p className="font-bold text-slate-900">FSSAI (Packaging & Labelling) Regulations, 2020</p>
                <p className="text-slate-500 text-[11px]">Mandatory declarations, veg/non-veg emblem, nutritional facts, allergen typography</p>
              </div>
              <input
                type="checkbox"
                checked={fssaiEnabled}
                onChange={(e) => setFssaiEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer">
              <div>
                <p className="font-bold text-slate-900">Legal Metrology (Packaged Commodities) Rules, 2011</p>
                <p className="text-slate-500 text-[11px]">Net quantity font height table, Unit Sale Price (USP), MRP format</p>
              </div>
              <input
                type="checkbox"
                checked={metrologyEnabled}
                onChange={(e) => setMetrologyEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer">
              <div>
                <p className="font-bold text-slate-900">US FDA 21 CFR Part 101 (US Export Standards)</p>
                <p className="text-slate-500 text-[11px]">Dual-column nutrition facts, dual-unit net wt (oz & grams), FALCPA allergens</p>
              </div>
              <input
                type="checkbox"
                checked={fdaEnabled}
                onChange={(e) => setFdaEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
