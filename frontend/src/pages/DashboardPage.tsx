import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  PlusCircle, 
  ArrowUpRight, 
  Search, 
  Filter, 
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  MOCK_RECENT_INSPECTIONS, 
  MOCK_MONTHLY_TRENDS, 
  MOCK_CATEGORY_DISTRIBUTION 
} from '../data/mockData';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Compliance Screening Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time overview of packaged product label audits, compliance rates, and statutory rule checks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/inspect/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Product Inspection</span>
          </Link>
        </div>
      </div>

      {/* 4 Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Inspections */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Label Audits</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900">1,248</h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% from last month</span>
            </div>
          </div>
        </div>

        {/* Card 2: Overall Compliance Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Overall Compliance Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-emerald-600">93.4%</h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>1,165 Passed verification</span>
            </div>
          </div>
        </div>

        {/* Card 3: Active Violations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Violations</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-rose-600">42</h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-rose-600 font-medium">
              <span>Font size & allergen alerts</span>
            </div>
          </div>
        </div>

        {/* Card 4: In Review / Pending */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Manual QA Reviews</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-amber-600">7</h3>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-600 font-medium">
              <span>Awaiting specialist sign-off</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend Area Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Audit Volume & Compliance Rate (%)</h3>
              <p className="text-xs text-slate-500">Monthly inspection throughput across product lines</p>
            </div>
            <div className="text-xs px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600 font-medium">
              Last 6 Months
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_MONTHLY_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInspections" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="inspections" 
                  stroke="#2563eb" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorInspections)" 
                  name="Inspections"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Product Category Distribution</h3>
            <p className="text-xs text-slate-500 mb-4">Screening breakdown by FMCG segment</p>
            <div className="h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_CATEGORY_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {MOCK_CATEGORY_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
            {MOCK_CATEGORY_DISTRIBUTION.slice(0, 4).map((c, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }}></span>
                <span className="text-slate-600 truncate">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Inspections Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Product Inspections</h3>
            <p className="text-xs text-slate-500">Live feed of label screenings completed by quality teams</p>
          </div>
          <Link
            to="/history"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-5">Product Name & Brand</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Inspection Date</th>
                <th className="py-3 px-4">Compliance Status</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {MOCK_RECENT_INSPECTIONS.map((item) => (
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
                        <p className="text-[11px] text-slate-400 mt-0.5">{item.brand} • SKU: {item.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                    {item.date}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                      item.status === 'Compliant'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : item.status === 'Warning'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        item.status === 'Compliant'
                          ? 'bg-emerald-500'
                          : item.status === 'Warning'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
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
                      <span>Report</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
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
