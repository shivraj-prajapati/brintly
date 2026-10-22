import React from 'react';
import { X, Check, Palette, Sparkles } from 'lucide-react';
import { PDF_TEMPLATES, type PdfTemplateId } from '../types/template.types';
import { SalarySlipQuadrant } from './SalarySlipQuadrant';
import type { CalculatedEmployeeRecord, PdfLanguage } from '../../calculations/salary-engine';

export interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplate: PdfTemplateId;
  onSelectTemplate: (template: PdfTemplateId) => void;
  language?: PdfLanguage;
  sampleEmployee?: CalculatedEmployeeRecord | null;
  companyTitle?: string;
  sheetName?: string;
}

// High-fidelity fallback sample employee for template preview
const fallbackSampleEmployee: CalculatedEmployeeRecord = {
  id: 'preview-sample-emp-1',
  rowIndex: 4,
  serialNumber: 1,
  name: 'Amit Sharma',
  sectionName: '',
  dailyRate: 550,
  days: 26,
  hours: 4,
  increase: 50,
  effectiveRate: 550,
  grossAmount: 14483,
  excelGrossAmount: 14483,
  advance: 2000,
  pf: 1100,
  rawNetAmount: 11383,
  netAmount: 11383,
  hasDiscrepancy: false,
  isValid: true,
  errors: [],
  warnings: [],
  isSelected: true,
  isExcludedByRule: false,
};

export const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({
  isOpen,
  onClose,
  selectedTemplate,
  onSelectTemplate,
  language = 'en',
  sampleEmployee,
  companyTitle = 'GLOBAL ENTERPRISES',
  sheetName = 'JANUARY',
}) => {
  if (!isOpen) return null;

  const empToPreview = sampleEmployee || fallbackSampleEmployee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-surface-bg dark:bg-slate-900 rounded-3xl border border-surface-200 dark:border-slate-800 shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-surface-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between transition-colors">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-extrabold text-surface-900 dark:text-slate-100 tracking-tight">
                  Choose Salary Slip Template
                </h3>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  5 Layouts
                </span>
              </div>
              <p className="text-xs text-surface-500 dark:text-slate-400 mt-0.5">
                Optimized for Black & White printing. Pick any layout; your preference is saved in LocalStorage.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-surface-400 dark:text-slate-500 hover:text-surface-700 dark:hover:text-slate-200 hover:bg-surface-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates Grid with Live Previews */}
        <div className="p-4 sm:p-5 pb-8 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {PDF_TEMPLATES.map((tmpl) => {
              const isSelected = selectedTemplate === tmpl.id;

              return (
                <div
                  key={tmpl.id}
                  onClick={() => {
                    onSelectTemplate(tmpl.id);
                    onClose();
                  }}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border-2 transition-all flex flex-col justify-between overflow-hidden shadow-card group cursor-pointer hover:shadow-lg ${
                    isSelected
                      ? 'border-emerald-600 ring-2 ring-emerald-100 dark:ring-emerald-900/50'
                      : 'border-surface-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600'
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-3 border-b border-surface-100 dark:border-slate-800 flex items-center justify-between bg-surface-50/60 dark:bg-slate-800/60 flex-shrink-0">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs sm:text-sm font-extrabold text-surface-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                          {tmpl.name}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 bg-white dark:bg-slate-900 rounded border border-surface-200 dark:border-slate-700 font-bold text-surface-600 dark:text-slate-300">
                          {tmpl.badge}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-surface-500 dark:text-slate-400 mt-0.5 leading-tight line-clamp-1">
                        {tmpl.description}
                      </p>
                    </div>

                    {isSelected && (
                      <span className="flex items-center space-x-1 text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                        <Check className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    )}
                  </div>

                  {/* Real Live Scaled Slip Preview (Strict Light Mode Paper Preview) */}
                  <div className="p-2.5 sm:p-3 bg-slate-100/80 dark:bg-slate-950 flex items-center justify-center flex-1 transition-colors">
                    <div className="relative w-[215px] h-[278px] overflow-hidden rounded-md border border-slate-300 dark:border-slate-700 bg-white shadow-sm flex-shrink-0">
                      <div
                        style={{
                          width: '320px',
                          height: '415px',
                          transform: 'scale(0.67)',
                          transformOrigin: '0 0',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          backgroundColor: '#ffffff',
                          color: '#0f172a',
                          colorScheme: 'light',
                        }}
                        className="pointer-events-none select-none pdf-light-isolate"
                      >
                        <SalarySlipQuadrant
                          employee={empToPreview}
                          companyTitle={companyTitle}
                          sheetName={sheetName}
                          language={language}
                          template={tmpl.id}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Button (Always 100% Visible & Clickable) */}
                  <div className="p-2.5 sm:p-3 bg-white dark:bg-slate-900 border-t border-surface-100 dark:border-slate-800 flex-shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTemplate(tmpl.id);
                        onClose();
                      }}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-2xs ${
                        isSelected
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white hover:border-emerald-600'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>Currently Selected</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:text-white" />
                          <span>Use This Template</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-surface-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between text-xs text-surface-500 dark:text-slate-400 transition-colors">
          <span>Templates are fully vector & printable in Black & White</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-surface-200 dark:border-slate-700 text-surface-700 dark:text-slate-300 hover:bg-surface-100 dark:hover:bg-slate-800 font-semibold cursor-pointer transition-colors"
          >
            Close Gallery
          </button>
        </div>
      </div>
    </div>
  );
};
