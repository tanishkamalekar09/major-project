import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckSquare, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Edit3, 
  Save, 
  Search,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';
import { InspectionStepper } from '../components/common/InspectionStepper';
import { MOCK_DETECTED_FIELDS, CURRENT_INSPECTION, DetectedField } from '../data/mockData';

export const DetectedInfoPage: React.FC = () => {
  const [fields, setFields] = useState<DetectedField[]>(MOCK_DETECTED_FIELDS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', 'General Identity', 'Legal Metrology', 'Regulatory Identity', 'Health & Safety', 'Nutritional Declarations', 'Mandatory Declarations', 'Dates & Traceability'];

  const filteredFields = fields.filter(f => 
    categoryFilter === 'All' ? true : f.category === categoryFilter
  );

  const startEdit = (field: DetectedField) => {
    setEditingId(field.id);
    setEditValue(field.detected_value);
  };

  const saveEdit = (id: string) => {
    setFields(fields.map(f => f.id === id ? { ...f, detected_value: editValue, status: 'verified' } : f));
    setEditingId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <InspectionStepper />

      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Step 4: Detected Information & Entity Parsing</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Structured regulatory attributes extracted by NLP and pattern recognition algorithms from raw label text.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/inspect/classification"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition"
          >
            <span>Step 5: Classification</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" /> Filter by:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              categoryFilter === cat
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Extracted Entities Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Extracted Packaging Declarations ({filteredFields.length})</h3>
            <p className="text-xs text-slate-400">Review, verify, or correct detected field values before rule checking</p>
          </div>
          <span className="text-xs text-slate-500">
            Target Standard: <strong className="text-slate-800">{CURRENT_INSPECTION.jurisdiction}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-5">Standard Field Key</th>
                <th className="py-3 px-4">Detected Label Value</th>
                <th className="py-3 px-4">Category & Statutory Reference</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Extraction Status</th>
                <th className="py-3 px-5 text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredFields.map((field) => (
                <tr key={field.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-4 px-5">
                    <p className="font-bold text-slate-900">{field.field_name}</p>
                    <code className="text-[10px] text-slate-400 font-mono">{field.standard_key}</code>
                  </td>

                  <td className="py-4 px-4 max-w-xs">
                    {editingId === field.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="px-2 py-1 bg-white border border-blue-400 rounded text-xs w-full focus:outline-none"
                        />
                        <button
                          onClick={() => saveEdit(field.id)}
                          className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-slate-800 font-medium leading-relaxed">{field.detected_value}</p>
                        {field.notes && (
                          <p className="text-[11px] text-slate-400 mt-1 italic">{field.notes}</p>
                        )}
                      </div>
                    )}
                  </td>

                  <td className="py-4 px-4">
                    <span className="text-[11px] font-medium text-slate-700 block">{field.category}</span>
                    <span className="text-[10px] text-blue-600 font-mono">{field.regulation_ref}</span>
                  </td>

                  <td className="py-4 px-4 font-mono text-slate-600">
                    {Math.round(field.confidence * 100)}%
                  </td>

                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                      field.status === 'compliant' || field.status === 'verified'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : field.status === 'warning'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {field.status === 'compliant' || field.status === 'verified' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-3 h-3" />
                      )}
                      <span className="capitalize">{field.status}</span>
                    </span>
                  </td>

                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => startEdit(field)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition"
                      title="Edit detected value"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            All fields normalized to FSSAI & Legal Metrology canonical data schemas.
          </span>
          <Link
            to="/inspect/classification"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition"
          >
            <span>Proceed to Regulatory Classification</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
