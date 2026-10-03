import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  CheckCircle2, 
  Download, 
  Share2, 
  Layers, 
  Sliders, 
  CornerDownRight,
  ShieldAlert
} from 'lucide-react';
import { InspectionStepper } from '../components/common/InspectionStepper';
import { getActiveInspection } from '../services/inspectionStore';
import { getDynamicComplianceRules } from '../services/genericExtractor';

export const IssueDetailsPage: React.FC = () => {
  const activeInspection = getActiveInspection();
  const complianceRules = getDynamicComplianceRules(activeInspection);
  const issues = complianceRules.filter(r => r.status === 'failed' || r.status === 'warning');
  const [activeIssueId, setActiveIssueId] = useState<string>(issues[0]?.rule_id || '');

  const activeIssue = issues.find(i => i.rule_id === activeIssueId) || issues[0] || complianceRules[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <InspectionStepper />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Step 7: Issue Details & Packaging Remediation</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Granular breakdown of detected regulatory violations with actionable instructions for packaging designers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/inspect/report"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition"
          >
            <span>Step 8: Final Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Issues Selector List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Flagged Packaging Issues ({issues.length})
          </h3>

          <div className="space-y-2">
            {issues.map((issue) => {
              const isActive = activeIssue.rule_id === issue.rule_id;
              return (
                <div
                  key={issue.rule_id}
                  onClick={() => setActiveIssueId(issue.rule_id)}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition ${
                    isActive
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-subtle'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[10px] text-slate-400 font-semibold">{issue.rule_id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      issue.severity === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {issue.severity}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{issue.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 truncate">{issue.regulation_source}</p>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600">
            <span className="font-semibold block mb-1">Pre-Print Quality Check:</span>
            Fixing these artwork issues prior to printing avoids packaging stock write-offs and statutory trade penalties.
          </div>
        </div>

        {/* Right: Detailed Remediation Specification (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle space-y-6">
          {/* Header of Active Issue */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  activeIssue.status === 'failed' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {activeIssue.severity} Violation
                </span>
                <span className="text-xs text-slate-400 font-mono">{activeIssue.rule_id}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">{activeIssue.title}</h2>
              <p className="text-xs text-blue-600 font-mono mt-0.5">{activeIssue.regulation_source}</p>
            </div>

            <button
              onClick={() => alert(`Issue ticket ${activeIssue.rule_id} exported to packaging design queue!`)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition self-start"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Fix Ticket</span>
            </button>
          </div>

          {/* Finding vs Requirement Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 text-xs">
              <span className="font-bold text-rose-900 block mb-1 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                Detected on Current Artwork:
              </span>
              <p className="font-mono text-slate-800 bg-white p-2.5 rounded border border-rose-100 mt-1.5 leading-relaxed">
                {activeIssue.found_text}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs">
              <span className="font-bold text-emerald-900 block mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Statutory Legal Mandate:
              </span>
              <p className="font-medium text-slate-800 bg-white p-2.5 rounded border border-emerald-100 mt-1.5 leading-relaxed">
                {activeIssue.expected_requirement}
              </p>
            </div>
          </div>

          {/* Statutory Impact & Legal Explanation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Legal Impact & Non-Compliance Risk
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              {activeIssue.explanation}
            </div>
          </div>

          {/* Remediation Action Steps */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Actionable Designer Remediation Instruction
            </h4>
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 flex items-start gap-3">
              <CornerDownRight className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{activeIssue.remediation}</p>
                <p className="text-[11px] text-blue-700 mt-1">
                  Applies to: Adobe Illustrator, InDesign, and CorelDRAW packaging layout templates.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Action to Step 8: Final Report */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Inspection audit complete. Ready to compile report.
            </span>
            <Link
              to="/inspect/report"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition"
            >
              <span>Compile Compliance Certificate & Report</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
