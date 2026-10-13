import React, { useRef } from 'react';
import { ArrowRight, Upload, Palette } from 'lucide-react';
import type { WorkflowStep } from '../../features/excel/types/excel.types';

export interface HeaderProps {
  currentStep?: WorkflowStep;
  hasWorkbook?: boolean;
  onReset?: () => void;
  onStepClick?: (step: WorkflowStep) => void;
  onFileUpload?: (file: File) => void;
  onOpenTemplateGallery?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep = 'upload',
  hasWorkbook = false,
  onReset,
  onStepClick,
  onFileUpload,
  onOpenTemplateGallery,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps: Array<{ id: WorkflowStep; label: string; active: boolean }> = [
    { id: 'upload', label: '1. Upload', active: currentStep === 'upload' },
    { id: 'inspect', label: '2. Review Data', active: currentStep === 'inspect' },
    { id: 'export', label: '3. Preview & PDF', active: currentStep === 'export' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
    // Reset input value so same file can be re-selected if needed
    e.target.value = '';
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-surface-200 shadow-2xs">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 sm:h-16">
          {/* Brand Identity: 3D Tile Logo Icon + Black Wordmark */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onReset}
              className="group flex items-center space-x-2.5 hover:opacity-90 transition-all focus:outline-none cursor-pointer select-none"
              title="Brintly — Return to Home"
            >
              <img
                src="/logo/logo.png"
                alt="Brintly Logo"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl shadow-xs object-cover group-hover:scale-105 transition-transform"
              />
              <span className="font-logo text-xl sm:text-2xl font-black tracking-[-0.03em] text-black">
                Brintly
              </span>
            </button>
          </div>

          {/* Workflow Step Indicator (Visible when workbook is loaded) */}
          {hasWorkbook && (
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 bg-surface-50 p-1 rounded-xl border border-surface-200">
              {steps.map((step, idx) => (
                <React.Fragment key={step.id}>
                  <button
                    type="button"
                    onClick={() => onStepClick && onStepClick(step.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      step.active
                        ? 'bg-white text-emerald-900 shadow-2xs border border-emerald-200/80 font-bold'
                        : 'text-surface-500 hover:text-surface-800'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        step.active ? 'bg-emerald-600 ring-2 ring-emerald-100' : 'bg-surface-300'
                      }`}
                    />
                    <span>{step.label}</span>
                  </button>
                  {idx < steps.length - 1 && (
                    <ArrowRight className="h-3 w-3 text-surface-300 flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}

          {/* Right Section: PDF Template Selector & Upload Action */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Hidden File Input for Header Upload Trigger */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* 1. Browse 5 Previews Action in Navbar (Shown whenever file is uploaded) */}
            {hasWorkbook && onOpenTemplateGallery && (
              <button
                type="button"
                onClick={onOpenTemplateGallery}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold shadow-2xs cursor-pointer transition-colors"
                title="Open visual gallery to see live previews of all 5 templates side by side"
              >
                <Palette className="w-3.5 h-3.5 text-emerald-700" />
                <span>Browse 5 Previews</span>
              </button>
            )}

            {/* 2. Upload Action in Header (Always Available) */}
            {onFileUpload && (
              <button
                type="button"
                onClick={triggerUpload}
                className="inline-flex items-center space-x-1.5 text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300 transition-colors cursor-pointer font-semibold shadow-2xs"
                title="Upload Excel Spreadsheet (.xlsx, .xls)"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline">{hasWorkbook ? 'Upload New' : 'Upload File'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
