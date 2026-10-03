import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Tag, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  Scale, 
  FileText, 
  ShieldCheck, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { InspectionStepper } from '../components/common/InspectionStepper';
import { CURRENT_INSPECTION } from '../data/mockData';

export const ClassificationPage: React.FC = () => {
  const mandatoryRequirements = [
    { title: "Product Commercial & Common Name", standard: "FSSAI Reg 5(1)", required: "Mandatory on Principal Display Panel" },
    { title: "Complete Ingredients List", standard: "FSSAI Reg 5(2)", required: "Descending order by in-going weight (m/m)" },
    { title: "7 Core Nutritional Parameters", standard: "FSSAI Reg 5(3)", required: "Per 100g and % RDA reference values" },
    { title: "Vegetarian / Non-Veg Emblem", standard: "FSSAI Reg 5(5)", required: "Green filled circle in green square frame" },
    { title: "Net Quantity with Statutory Font Height", standard: "Legal Metrology Rule 9", required: "≥ 4.0 mm for net weight 200g - 500g" },
    { title: "Unit Sale Price (USP)", standard: "Legal Metrology Rule 6(11)", required: "Price per gram or per 100g" },
    { title: "FSSAI 14-Digit License Display", standard: "FSSAI Reg 5(4)", required: "FSSAI logo accompanied by 14-digit license" },
    { title: "Date of Manufacture & Durability", standard: "FSSAI Reg 5(7)", required: "Clear DD/MM/YYYY or 'Best Before' statement" },
    { title: "Customer Care Helpline & Email", standard: "Legal Metrology Rule 6(1)", required: "Name, address, phone & email of care executive" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <InspectionStepper />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Step 5: Regulatory Classification</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Categorization engine mapping product attributes to statutory legal frameworks and mandatory checklists.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/inspect/compliance"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition"
          >
            <span>Step 6: Compliance Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Classification Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Determined Classification</h3>
              <p className="text-[11px] text-slate-400">AI Category Classifier (99.2% match)</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Primary Category:</span>
              <p className="font-bold text-slate-900 text-sm">{CURRENT_INSPECTION.category}</p>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Sub-Classification:</span>
              <p className="font-semibold text-slate-800">{CURRENT_INSPECTION.subcategory}</p>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Package Type:</span>
              <p className="font-semibold text-slate-800">{CURRENT_INSPECTION.package_type}</p>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Applicable Standards:</span>
              <div className="space-y-1.5 mt-1">
                <span className="inline-block px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium">
                  FSSAI (Labelling & Display) Reg, 2020
                </span>
                <span className="inline-block px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-medium">
                  Legal Metrology (Packaged Commodities) 2011
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>18 statutory rules matched to this product profile</span>
            </div>
          </div>
        </div>

        {/* Mandatory Requirement Matrix (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Mandatory Packaging Checklist Matrix</h3>
              <p className="text-xs text-slate-400">Rules applied based on 250g Ready-to-Eat Food classification</p>
            </div>
            <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2.5 py-1 rounded-lg">
              9 Mandatory Points
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto pr-1">
            {mandatoryRequirements.map((req, idx) => (
              <div key={idx} className="py-3 flex items-start justify-between gap-4 text-xs">
                <div>
                  <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    {req.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 ml-7">{req.required}</p>
                </div>
                <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600 text-[10px] font-mono shrink-0">
                  {req.standard}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Ready to evaluate rules against OCR extracted data
            </span>
            <Link
              to="/inspect/compliance"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition"
            >
              <span>Run Compliance Rule Engine</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
