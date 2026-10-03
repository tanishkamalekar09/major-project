import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Upload, 
  Scan, 
  FileCode, 
  CheckSquare, 
  Tag, 
  ShieldAlert, 
  AlertTriangle, 
  FileText,
  ChevronRight
} from 'lucide-react';

export const INSPECTION_STEPS = [
  { path: '/inspect/new', label: '1. Upload Image', icon: Upload, short: 'Upload' },
  { path: '/inspect/analysis', label: '2. Image Analysis', icon: Scan, short: 'Analysis' },
  { path: '/inspect/ocr', label: '3. OCR Results', icon: FileCode, short: 'OCR' },
  { path: '/inspect/detected-info', label: '4. Detected Info', icon: CheckSquare, short: 'Extracted' },
  { path: '/inspect/classification', label: '5. Classification', icon: Tag, short: 'Ruleset' },
  { path: '/inspect/compliance', label: '6. Compliance', icon: ShieldAlert, short: 'Evaluation' },
  { path: '/inspect/issues', label: '7. Issue Details', icon: AlertTriangle, short: 'Issues' },
  { path: '/inspect/report', label: '8. Final Report', icon: FileText, short: 'Report' },
];

export const InspectionStepper: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const currentStepIndex = INSPECTION_STEPS.findIndex(s => s.path === currentPath);

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-subtle mb-6 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[760px] gap-2">
        {INSPECTION_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentPath === step.path;
          const isPassed = currentStepIndex > idx;

          return (
            <React.Fragment key={step.path}>
              <NavLink
                to={step.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-200 font-semibold'
                    : isPassed
                    ? 'bg-slate-100/90 text-slate-700 hover:bg-slate-200/70 hover:text-slate-900'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : isPassed
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  <Icon className="w-3 h-3" />
                </div>
                <span>{step.label}</span>
              </NavLink>

              {idx < INSPECTION_STEPS.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
