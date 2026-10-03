import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  Filter, 
  FileText,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { InspectionStepper } from '../components/common/InspectionStepper';
import { MOCK_COMPLIANCE_RULES, CURRENT_INSPECTION } from '../data/mockData';

export const ComplianceAnalysisPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'failed' | 'warning' | 'passed'>('all');

  const filteredRules = MOCK_COMPLIANCE_RULES.filter((rule) => {
    if (statusFilter === 'all') return true;
    return rule.status === statusFilter;
  });

  const failedCount = MOCK_COMPLIANCE_RULES.filter(r => r.status === 'failed').length;
  const warningCount = MOCK_COMPLIANCE_RULES.filter(r => r.status === 'warning').length;
  const passedCount = MOCK_COMPLIANCE_RULES.filter(r => r.status === 'passed').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <InspectionStepper />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Step 6: Compliance Analysis & Rule Engine</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Automated statutory rule cross-matching evaluating label typography, declarations, and mandatory icons.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/inspect/issues"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition"
          >
            <span>Step 7: Issue Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Score & Summary KPI Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        {/* Score Ring */}
        <div className="flex items-center gap-4 md:border-r md:border-slate-100 pr-4">
          <div className="relative w-20 h-20 rounded-full bg-amber-50 border-4 border-amber-400 flex items-center justify-center shrink-0">
            <span className="text-2xl font-black text-amber-600">74%</span>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Inspection Score</span>
            <h3 className="font-extrabold text-base text-slate-900 leading-tight">Action Required</h3>
            <p className="text-[11px] text-slate-400">Artwork has statutory issues</p>
          </div>
        </div>

        {/* Failed Count */}
        <div 
          onClick={() => setStatusFilter('failed')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            statusFilter === 'failed' ? 'border-rose-400 bg-rose-50/70 shadow-sm' : 'border-slate-200 bg-slate-50 hover:bg-rose-50/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Critical Violations</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-bold text-rose-600 mt-2">{failedCount}</p>
          <p className="text-[11px] text-rose-500 mt-0.5">High regulatory risk</p>
        </div>

        {/* Warning Count */}
        <div 
          onClick={() => setStatusFilter('warning')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            statusFilter === 'warning' ? 'border-amber-400 bg-amber-50/70 shadow-sm' : 'border-slate-200 bg-slate-50 hover:bg-amber-50/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Formatting Warnings</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2">{warningCount}</p>
          <p className="text-[11px] text-amber-500 mt-0.5">Contrast & visibility</p>
        </div>

        {/* Passed Count */}
        <div 
          onClick={() => setStatusFilter('passed')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            statusFilter === 'passed' ? 'border-emerald-400 bg-emerald-50/70 shadow-sm' : 'border-slate-200 bg-slate-50 hover:bg-emerald-50/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Passed Checks</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">{passedCount + 10}</p>
          <p className="text-[11px] text-emerald-600 mt-0.5">Fully compliant rules</p>
        </div>
      </div>

      {/* Rules List Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Evaluated Statutory Rules ({filteredRules.length})</h3>
            <p className="text-xs text-slate-400">Click on any failed rule to see statutory remediations</p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Rules
            </button>
            <button
              onClick={() => setStatusFilter('failed')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                statusFilter === 'failed' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              Violations ({failedCount})
            </button>
            <button
              onClick={() => setStatusFilter('warning')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                statusFilter === 'warning' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Warnings ({warningCount})
            </button>
          </div>
        </div>

        {/* Rule Items */}
        <div className="space-y-3">
          {filteredRules.map((rule) => (
            <div 
              key={rule.rule_id} 
              className={`p-4 rounded-xl border text-xs transition ${
                rule.status === 'failed'
                  ? 'border-rose-200 bg-rose-50/30'
                  : rule.status === 'warning'
                  ? 'border-amber-200 bg-amber-50/30'
                  : 'border-slate-200/80 bg-slate-50/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400 font-semibold">{rule.rule_id}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-[10px] text-blue-600 font-semibold">{rule.category}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{rule.title}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">{rule.regulation_source}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                    rule.status === 'failed'
                      ? 'bg-rose-100 text-rose-800'
                      : rule.status === 'warning'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {rule.status}
                  </span>
                  <Link
                    to="/inspect/issues"
                    className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-white transition"
                    title="View issue details"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 mt-2 text-[11px]">
                <div>
                  <span className="text-slate-400 font-medium">Expected Statutory Standard:</span>
                  <p className="text-slate-700 font-medium mt-0.5">{rule.expected_requirement}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Found on Label Artwork:</span>
                  <p className={`font-medium mt-0.5 ${rule.status === 'failed' ? 'text-rose-700' : 'text-slate-700'}`}>
                    {rule.found_text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Next Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            2 critical issues identified requiring label redesign
          </span>
          <Link
            to="/inspect/issues"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition"
          >
            <span>Proceed to Issue Details & Remediation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
