import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  ArrowUpRight, 
  PlusCircle, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Calendar
} from 'lucide-react';
import { MOCK_RECENT_INSPECTIONS, InspectionRecord } from '../data/mockData';

export const InspectionHistoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredInspections = MOCK_RECENT_INSPECTIONS.filter((item) => {
    const matchesSearch = 
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' ? true : item.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' ? true : item.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleExportCSV = () => {
    alert("Exporting " + filteredInspections.length + " inspection records to CSV format.");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inspection History & Audit Logs</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Complete historical repository of all screened packaging labels and compliance certificates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-subtle flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <Link
            to="/inspect/new"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Inspection</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product, brand, SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </div>

          {['All', 'Compliant', 'Warning', 'Non-Compliant'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                statusFilter === status
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-5">Product Commercial Name</th>
                <th className="py-3 px-4">Brand & Category</th>
                <th className="py-3 px-4">Batch / SKU</th>
                <th className="py-3 px-4">Inspection Date</th>
                <th className="py-3 px-4">Compliance Status</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredInspections.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.sample_image} 
                        alt={item.product_name} 
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" 
                      />
                      <div>
                        <p className="font-semibold text-slate-900 leading-tight">{item.product_name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-medium text-slate-800">{item.brand}</p>
                    <span className="text-[10px] text-slate-500">{item.category}</span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                    <div>{item.batch_no}</div>
                    <span className="text-[10px] text-slate-400">{item.sku}</span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.date}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                      item.status === 'Compliant'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : item.status === 'Warning'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        item.status === 'Compliant' ? 'bg-emerald-500' : item.status === 'Warning' ? 'bg-amber-500' : 'bg-rose-500'
                      }`}></span>
                      {item.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            item.score >= 90 ? 'bg-emerald-500' : item.score >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-800 text-[11px]">{item.score}%</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-5 text-right">
                    <Link
                      to="/inspect/report"
                      className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold shadow-subtle transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Audit View</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
