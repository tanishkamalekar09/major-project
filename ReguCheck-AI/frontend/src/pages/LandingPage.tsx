import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Scan, 
  FileCheck2, 
  Layers, 
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const steps = [
    { title: "1. Upload Product Image", desc: "Front & back label artwork or photo" },
    { title: "2. Image Analysis", desc: "Preprocessing & bounding box isolation" },
    { title: "3. OCR Text Extraction", desc: "High-accuracy text recognition" },
    { title: "4. Information Extraction", desc: "Brand, MRP, Net Wt, FSSAI & dates" },
    { title: "5. Regulatory Classification", desc: "Categorization & standard selection" },
    { title: "6. Compliance Analysis", desc: "Rule engine checks all requirements" },
    { title: "7. Issue Details", desc: "Statutory font & format violation audit" },
    { title: "8. Compliance Report", desc: "Audit certificate & actionable fixes" },
  ];

  const regulations = [
    { name: "FSSAI (India)", badge: "Labelling & Display 2020", coverage: "Food & Supplements" },
    { name: "Legal Metrology", badge: "Packaged Commodities 2011", coverage: "Net Wt, MRP, USP" },
    { name: "US FDA 21 CFR", badge: "Part 101 Food Labeling", coverage: "Export Compliance" },
    { name: "EU Regulation", badge: "FIC No 1169/2011", coverage: "14 Allergens & Nutri-Score" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">ReguCheck</span>
              <span className="text-blue-600 font-bold ml-1">AI</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-slate-100 transition"
            >
              Log In
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-200 transition"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-6 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Powered Packaged Product Compliance Verification</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-tight max-w-4xl mx-auto mb-6">
          Zero-Defect Packaging Labels with <span className="text-blue-600">Automated AI Compliance</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Instantly screen FMCG, food, and cosmetic product labels against statutory regulations 
          (FSSAI, Legal Metrology, FDA) before print runs. Detect missing declarations, undersized text, and format non-compliances in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/inspect/new"
            className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition"
          >
            <span>Start New Inspection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-xl border border-slate-300 shadow-subtle flex items-center justify-center gap-2 transition"
          >
            <span>View QA Dashboard</span>
          </Link>
        </div>

        {/* Live Preview Card */}
        <div className="mt-14 max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-card p-6 sm:p-8 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Live Demonstration</span>
              <h3 className="text-lg font-bold text-slate-900">Nutri-Crunch Almond & Honey Granola (250g)</h3>
              <p className="text-xs text-slate-500">Standard Packaged Food Screening under FSSAI 2020 & Legal Metrology Rules</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold rounded-full flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Score: 74/100 (2 Issues Found)
              </span>
              <Link
                to="/inspect/report"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Full Audit</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700">Net Quantity</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">Violation</span>
              </div>
              <p className="text-sm font-bold text-slate-900">Detected: 250 g (2.2mm font)</p>
              <p className="text-xs text-slate-500 mt-1">Rule 9 mandates minimum 4.0mm height for packages 200g-500g.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700">FSSAI License</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">Compliant</span>
              </div>
              <p className="text-sm font-bold text-slate-900">Lic. 10019022009876</p>
              <p className="text-xs text-slate-500 mt-1">Valid 14-digit format and correct manufacturing jurisdiction.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700">Allergen Advice</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700">Warning</span>
              </div>
              <p className="text-sm font-bold text-slate-900">Regular Font Weight</p>
              <p className="text-xs text-slate-500 mt-1">Clause 5(2) requires bold or high-contrast typeface declaration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8-Step Pipeline Section */}
      <section className="py-16 bg-white border-y border-slate-200 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
              End-to-End Compliance Verification Pipeline
            </h2>
            <p className="text-sm text-slate-600">
              Every package is analyzed through a structured 8-stage verification pipeline
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((st, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition group">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition">
                  0{i + 1}
                </div>
                <h4 className="font-semibold text-sm text-slate-900 mb-1">{st.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regulatory Coverage */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
            Built for Global & Domestic Standards
          </h2>
          <p className="text-sm text-slate-600">
            Preloaded with regulatory rulebooks and statutory packaging mandates
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {regulations.map((reg, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-subtle">
              <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {reg.badge}
              </span>
              <h4 className="font-bold text-base text-slate-900 mt-3 mb-1">{reg.name}</h4>
              <p className="text-xs text-slate-500">{reg.coverage}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-navy-950 text-slate-400 py-10 px-6 border-t border-navy-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span className="text-white font-semibold">ReguCheck AI</span>
            <span>— AI-Powered Packaged Product Compliance Verification</span>
          </div>
          <div>
            <span>Phase 1 Frontend • Built for Quality Teams & FMCG Brands</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
