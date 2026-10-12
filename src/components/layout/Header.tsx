import React from 'react';
import { FileSpreadsheet, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Badge } from '../ui/Badge';

export interface HeaderProps {
  currentStep?: 'upload' | 'mapping' | 'calculation' | 'export';
  onDemoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentStep = 'upload', onDemoClick }) => {
  const steps = [
    { id: 'upload', label: '1. Upload & Inspect', active: currentStep === 'upload', done: false },
    { id: 'mapping', label: '2. Field Mapping', active: currentStep === 'mapping', done: false },
    { id: 'calculation', label: '3. Calculations', active: currentStep === 'calculation', done: false },
    { id: 'export', label: '4. PDF Generation', active: currentStep === 'export', done: false },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-surface-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm ring-1 ring-emerald-700/20">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold tracking-tight text-surface-900">
                  Brintly
                </span>
                <span className="text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded bg-surface-100 text-surface-600 border border-surface-200">
                  Financial PDF Engine
                </span>
              </div>
            </div>
          </div>

          {/* Workflow Step Indicator */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-surface-50 p-1 rounded-lg border border-surface-200/80">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    step.active
                      ? 'bg-white text-emerald-800 shadow-sm border border-emerald-200/60 font-semibold'
                      : 'text-surface-500 hover:text-surface-700'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      step.active ? 'bg-emerald-600 ring-2 ring-emerald-100' : 'bg-surface-300'
                    }`}
                  />
                  <span>{step.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <ArrowRight className="h-3 w-3 text-surface-300 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Actions & Status */}
          <div className="flex items-center space-x-3">
            {onDemoClick && (
              <button
                onClick={onDemoClick}
                className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 px-2.5 py-1.5 rounded-lg border border-emerald-200 transition-colors"
                title="Load sample financial model"
              >
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span>Load Sample Model</span>
              </button>
            )}

            <div className="hidden lg:flex items-center space-x-1.5 text-xs text-surface-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Client-Side Secure</span>
            </div>

            <Badge variant="neutral" size="sm" className="font-mono">
              v0.1.0
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
};
