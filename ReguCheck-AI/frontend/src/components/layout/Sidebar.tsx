import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  BookOpen, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  LogOut,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenHelp: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpenHelp }) => {
  const navigate = useNavigate();

  const mainNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'New Inspection', path: '/inspect/new', icon: PlusCircle },
    { name: 'Inspection History', path: '/history', icon: History },
    { name: 'Regulations', path: '/regulations', icon: BookOpen },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
  ];

  const handleLogout = () => {
    navigate('/login');
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Dark Navy Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-navy-950 text-slate-300 flex flex-col justify-between border-r border-navy-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Logo & Branding */}
        <div>
          <div className="h-16 px-6 flex items-center justify-between border-b border-navy-800/80 bg-navy-900/60">
            <NavLink to="/dashboard" className="flex items-center gap-3 group" onClick={onClose}>
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-baseline">
                  <span className="font-extrabold text-white text-base tracking-tight">ReguCheck</span>
                  <span className="text-blue-400 font-bold ml-1 text-sm">AI</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">Compliance Verification</p>
              </div>
            </NavLink>

            {/* Mobile close button */}
            <button 
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-4 py-6">
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-300">
              Core Modules
            </p>
            <nav className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                          : 'text-slate-300 hover:text-white hover:bg-navy-800/70'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Section: Settings, Help, Logout */}
        <div className="p-4 border-t border-navy-800/80 bg-navy-900/30 space-y-1">
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                isActive
                  ? 'bg-navy-800 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-navy-800/50'
              }`
            }
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </NavLink>

          <button
            onClick={() => {
              onOpenHelp();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-navy-800/50 transition text-left"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help & FAQ</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>

          {/* Quick Version Tag */}
          <div className="pt-3 px-3">
            <div className="px-2.5 py-1.5 rounded-lg bg-navy-900 border border-navy-800 text-[10px] text-slate-400 flex items-center justify-between">
              <span>OCR: Mock Engine</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
