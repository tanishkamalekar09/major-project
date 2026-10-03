import React from 'react';
import { 
  BarChart3, 
  Download, 
  FileText, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  FileCheck,
  ArrowUpRight
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const ReportsPage: React.FC = () => {
  const complianceBySegment = [
    { segment: 'Cereals', rate: 94, audits: 320 },
    { segment: 'Edible Oils', rate: 98, audits: 210 },
    { segment: 'Snacks', rate: 86, audits: 280 },
    { segment: 'Nutraceuticals', rate: 91, audits: 185 },
    { segment: 'Dairy', rate: 96, audits: 165 },
    { segment: 'Cosmetics', rate: 89, audits: 88 },
  ];

  const generatedReports = [
    { id: "REP-2026-SEP", title: "Monthly Packaging Compliance Audit Summary (Sep 2026)", size: "2.4 MB", date: "2026-09-28", type: "Executive PDF" },
    { id: "REP-FSSAI-Q3", title: "FSSAI Mandatory Labelling Conformance Report (Q3 2026)", size: "4.1 MB", date: "2026-09-20", type: "Regulatory Audit" },
    { id: "REP-LM-RULES", title: "Legal Metrology Net Quantity & USP Conformance Log", size: "1.8 MB", date: "2026-09-15", type: "Inspection Log" },
    { id: "REP-ALLERGEN", title: "Major Allergens Formatting & Legibility Risk Matrix", size: "3.2 MB", date: "2026-09-08", type: "Safety Assessment" },
  ];

  const handleDownload = (title: string) => {
    alert(`Downloading report: ${title}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Compliance Reports & Management Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Exportable compliance dossiers, executive audits, and category benchmark statistics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownload("Full Audit Compilation")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate Executive Dossier</span>
          </button>
        </div>
      </div>

      {/* Chart: Compliance By Segment */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Compliance Rate (%) by Product Line</h3>
            <p className="text-xs text-slate-500">Percentage of packaging artworks passing statutory screening without critical defects</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600">
            Benchmark: 90% Target
          </span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={complianceBySegment} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="segment" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={[70, 100]} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                formatter={(val) => [`${val}%`, 'Compliance Rate']}
              />
              <Bar dataKey="rate" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Available Audit Reports List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle p-6 space-y-4">
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Generated Compliance Dossiers</h3>
          <span className="text-xs text-slate-400">PDF & XLSX Formats</span>
        </div>

        <div className="divide-y divide-slate-100">
          {generatedReports.map((report) => (
            <div key={report.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 px-2 rounded-xl transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">{report.title}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="font-mono text-blue-600">{report.id}</span>
                    <span>•</span>
                    <span>{report.type}</span>
                    <span>•</span>
                    <span>{report.size}</span>
                    <span>•</span>
                    <span>{report.date}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDownload(report.title)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
