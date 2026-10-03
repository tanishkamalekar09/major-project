import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Scale, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Globe 
} from 'lucide-react';
import { MOCK_REGULATIONS } from '../data/mockData';

export const RegulationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRegulations = MOCK_REGULATIONS.filter(reg => 
    reg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.authority.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.jurisdiction.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Regulatory Rulebooks & Standards</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Official statutory frameworks, clauses, and packaging requirements encoded into the ReguCheck AI Rule Engine.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>4 Rulebooks Active</span>
          </span>
        </div>
      </div>

      {/* Search and Jurisdiction Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search regulations (e.g. FSSAI, FDA, Metrology)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'INDIA', 'US EXPORT', 'EU EXPORT'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Regulation Rulebook Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRegulations.map((reg) => (
          <div key={reg.id} className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                  {reg.id}
                </span>
                <span className="text-xs text-slate-400">Updated: {reg.last_updated}</span>
              </div>

              <h3 className="font-bold text-base text-slate-900 leading-snug">{reg.name}</h3>
              <p className="text-xs text-blue-600 font-medium mt-1">{reg.authority}</p>

              <div className="mt-3 py-2 px-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                {reg.description}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Jurisdiction:</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    {reg.jurisdiction}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Encoded Rules:</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{reg.rules_count} Rules</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active in Engine
              </span>
              <button
                onClick={() => alert(`Viewing full statutory documentation for ${reg.name}`)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View Rulebook Clauses</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
