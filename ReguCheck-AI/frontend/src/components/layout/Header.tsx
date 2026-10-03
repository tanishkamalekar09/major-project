import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  Cpu, 
  CheckCircle2, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-subtle">
      {/* Left: Mobile Menu & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inspections, SKUs, or regulations (e.g. FSSAI 2020)..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 placeholder-slate-400 transition"
          />
        </div>
      </div>

      {/* Right: Status Pill & Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mock OCR status badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-[11px] font-medium text-amber-800" title="Abstracted OCR Service Layer">
          <Cpu className="w-3.5 h-3.5 text-amber-600" />
          <span>Mock OCR Engine v1.0</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5"></span>
        </div>

        {/* Quick New Inspection button */}
        <Link
          to="/inspect/new"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-200 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Inspection</span>
        </Link>

        {/* Notifications toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50 text-xs animate-scale-up">
              <div className="px-4 pb-2 border-b border-slate-100 font-semibold text-slate-800 flex items-center justify-between">
                <span>Recent System Alerts</span>
                <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-medium">3 New</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                <div className="p-3 hover:bg-slate-50 transition cursor-pointer">
                  <p className="font-medium text-slate-800">Inspection INSP-8841 Flagged</p>
                  <p className="text-slate-500 text-[11px]">Nutri-Crunch Granola has 2 critical font size issues.</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">10 mins ago</span>
                </div>
                <div className="p-3 hover:bg-slate-50 transition cursor-pointer">
                  <p className="font-medium text-slate-800">New FSSAI 2024 Rulepack Loaded</p>
                  <p className="text-slate-500 text-[11px]">Labelling and display rules updated in compliance engine.</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">2 hours ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User profile */}
        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            TM
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">Tanishka M.</p>
            <p className="text-[10px] text-slate-400">Quality Lead</p>
          </div>
        </div>
      </div>
    </header>
  );
};
