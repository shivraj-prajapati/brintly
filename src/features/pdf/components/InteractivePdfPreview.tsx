import React, { useState, useRef, useEffect } from 'react';
import {
  Printer,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  FileText,
  Languages,
  CheckCircle2,
  Loader2,
  Palette,
} from 'lucide-react';
import type { CalculatedEmployeeRecord, PdfLanguage } from '../../calculations/salary-engine';
import { paginateEmployeesForA4, calculateA4PageCount } from '../utils/pagination';
import { A4PageSheet } from './A4PageSheet';
import { Button } from '../../../components/ui/Button';
import { downloadSalarySlipsPdf } from '../services/pdf-export';
import { PDF_TEMPLATES, type PdfTemplateId } from '../types/template.types';

export interface InteractivePdfPreviewProps {
  employees: CalculatedEmployeeRecord[];
  companyTitle?: string;
  sheetName?: string;
  language: PdfLanguage;
  onLanguageChange: (lang: PdfLanguage) => void;
  selectedTemplate: PdfTemplateId;
  onSelectTemplate: (template: PdfTemplateId) => void;
  onOpenTemplateGallery?: () => void;
  onBackToData: () => void;
}

export const InteractivePdfPreview: React.FC<InteractivePdfPreviewProps> = ({
  employees,
  companyTitle = 'GLOBAL ENTERPRISES',
  sheetName = '',
  language,
  onLanguageChange,
  selectedTemplate,
  onSelectTemplate: _onSelectTemplate,
  onOpenTemplateGallery,
  onBackToData,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportStatusText, setExportStatusText] = useState<string>('');

  // Zoom management: fit nicely across screen sizes
  const [zoomLevel, setZoomLevel] = useState<number>(0.85);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) {
        setZoomLevel(0.48); // Phone screen
      } else if (window.innerWidth < 1024) {
        setZoomLevel(0.68); // Tablet screen
      } else {
        setZoomLevel(0.85); // Desktop screen
      }
    }
  }, []);

  const pages = paginateEmployeesForA4(employees);
  const totalPages = calculateA4PageCount(employees.length);
  const safePageIndex = Math.min(currentPageIndex, Math.max(0, pages.length - 1));
  const currentPage = pages[safePageIndex];

  // Hidden container holding all pages for PDF rendering
  const allPagesContainerRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!allPagesContainerRef.current) return;
    setIsExportingPdf(true);
    setExportProgress(5);
    setExportStatusText('Preparing salary slips...');
    try {
      const fileName = `Brintly-Salary-Slips-${sheetName || 'Sheet'}.pdf`;
      await downloadSalarySlipsPdf(
        allPagesContainerRef.current,
        fileName,
        (progress, status) => {
          setExportProgress(progress);
          if (status) setExportStatusText(status);
        }
      );
    } catch (err: unknown) {
      console.error('PDF Export Error:', err);
      alert('Failed to generate PDF file. Please try the Print Slips option instead.');
    } finally {
      setIsExportingPdf(false);
      setExportProgress(0);
      setExportStatusText('');
    }
  };

  const currentSlipsStart = safePageIndex * 4 + 1;
  const currentSlipsEnd = Math.min((safePageIndex + 1) * 4, employees.length);

  const currentTemplate = PDF_TEMPLATES.find((t) => t.id === selectedTemplate);

  return (
    <div className="space-y-4">
      {/* =========================================================================
          1. TOP CONTROLS WORKBENCH (Unified Studio Header)
          ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-surface-200 dark:border-slate-800 shadow-card p-4 space-y-3 transition-colors">
        {/* ROW 1: Navigation & Primary Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Back button & Document Metadata */}
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onBackToData}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Data
            </Button>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-base font-extrabold text-surface-900 dark:text-slate-100 tracking-tight">
                  A4 Salary Slips Studio
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold hidden sm:inline-flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>2 × 2 Grid (4 Slips/Page)</span>
                </span>
              </div>
              <p className="text-[11px] text-surface-500 dark:text-slate-400 font-medium">
                {employees.length} employees included • {totalPages} A4 pages • Pre-calibrated cutting guides
              </p>
            </div>
          </div>

          {/* Right: Primary Action Buttons */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              disabled={isExportingPdf || employees.length === 0}
              leftIcon={<Printer className="w-4 h-4 text-surface-700 dark:text-slate-300" />}
            >
              Print Slips
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleDownloadPdf}
              disabled={isExportingPdf || employees.length === 0}
              leftIcon={
                isExportingPdf ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Download className="w-4 h-4" />
                )
              }
            >
              {isExportingPdf ? `Saving (${exportProgress}%)...` : 'Download PDF'}
            </Button>
          </div>
        </div>

        {/* ROW 2: Customization & Navigation Strip (Aligned & Clean) */}
        <div className="pt-2.5 border-t border-surface-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Template Pill (Browse 5 Previews) & Language Toggle */}
          <div className="flex items-center gap-2 flex-wrap">
            {onOpenTemplateGallery && (
              <button
                type="button"
                onClick={onOpenTemplateGallery}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700/60 bg-emerald-50/70 dark:bg-emerald-950/60 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/60 text-emerald-900 dark:text-emerald-300 text-xs font-bold transition-all shadow-2xs cursor-pointer group"
                title="Browse live visual previews of all 5 templates side by side"
              >
                <Palette className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-surface-600 dark:text-slate-400 text-[11px] font-medium">Template:</span>
                <span className="font-extrabold text-emerald-950 dark:text-emerald-200">{currentTemplate?.name || 'Corporate Minimal'}</span>
                <span className="text-[10px] bg-emerald-200/90 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 px-1.5 py-0.2 rounded font-black ml-0.5">
                  Browse 5 Previews
                </span>
              </button>
            )}

            {/* Language Toggle */}
            <div className="flex items-center bg-surface-50 dark:bg-slate-800/80 border border-surface-200 dark:border-slate-700 rounded-xl p-0.5 text-xs">
              <span className="px-1.5 text-surface-400 dark:text-slate-400">
                <Languages className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </span>
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-white dark:bg-slate-900 text-surface-900 dark:text-slate-100 font-bold shadow-2xs border border-surface-200 dark:border-slate-700'
                    : 'text-surface-500 dark:text-slate-400 hover:text-surface-800 dark:hover:text-slate-200 font-medium'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-300 font-bold shadow-2xs border border-surface-200 dark:border-slate-700'
                    : 'text-surface-500 dark:text-slate-400 hover:text-surface-800 dark:hover:text-slate-200 font-medium'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>

          {/* Right: Pagination Controls & Zoom Options */}
          <div className="flex items-center gap-2.5 ml-auto flex-wrap">
            {/* Zoom Selector */}
            <div className="hidden sm:flex items-center space-x-1 bg-surface-50 dark:bg-slate-800/80 border border-surface-200 dark:border-slate-700 rounded-xl p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setZoomLevel(0.48)}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  zoomLevel === 0.48
                    ? 'bg-white dark:bg-slate-900 font-bold shadow-2xs text-surface-900 dark:text-slate-100 border border-surface-200 dark:border-slate-700'
                    : 'text-surface-500 dark:text-slate-400 hover:text-surface-800 dark:hover:text-slate-200'
                }`}
                title="Fit"
              >
                Fit
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(0.72)}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  zoomLevel === 0.72
                    ? 'bg-white dark:bg-slate-900 font-bold shadow-2xs text-surface-900 dark:text-slate-100 border border-surface-200 dark:border-slate-700'
                    : 'text-surface-500 dark:text-slate-400 hover:text-surface-800 dark:hover:text-slate-200'
                }`}
              >
                75%
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(0.85)}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  zoomLevel === 0.85
                    ? 'bg-white dark:bg-slate-900 font-bold shadow-2xs text-surface-900 dark:text-slate-100 border border-surface-200 dark:border-slate-700'
                    : 'text-surface-500 dark:text-slate-400 hover:text-surface-800 dark:hover:text-slate-200'
                }`}
              >
                100%
              </button>
            </div>

            {/* Slips Range Count */}
            <span className="text-[11px] text-surface-500 dark:text-slate-400 font-medium hidden lg:inline">
              Slips #{currentSlipsStart}–#{currentSlipsEnd} of {employees.length}
            </span>

            {/* Pagination Navigator */}
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
                disabled={safePageIndex === 0}
                leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
              >
                Prev
              </Button>
              <span className="text-xs font-bold text-surface-800 dark:text-slate-200 px-2 py-1 rounded-lg bg-surface-50 dark:bg-slate-800/80 border border-surface-200 dark:border-slate-700">
                {safePageIndex + 1} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPageIndex((prev) => Math.min(pages.length - 1, prev + 1))}
                disabled={safePageIndex >= pages.length - 1}
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Export Progress Banner */}
      {isExportingPdf && (
        <div className="bg-emerald-900 text-white p-3.5 rounded-2xl shadow-card border border-emerald-700 animate-in fade-in space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold flex items-center space-x-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-300" />
              <span>{exportStatusText || 'Generating high-resolution salary slips...'}</span>
            </span>
            <span className="font-mono font-bold text-emerald-300">{exportProgress}%</span>
          </div>
          <div className="w-full bg-emerald-950 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-400 h-1.5 rounded-full transition-all duration-200 ease-out"
              style={{ width: `${exportProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* =========================================================================
          4. DOCUMENT DESK CANVAS (Realistic paper elevation and studio backdrop)
          ========================================================================= */}
      <div className="w-full overflow-x-auto p-4 sm:p-8 bg-slate-200/80 dark:bg-slate-950/90 rounded-3xl border border-surface-300 dark:border-slate-800 shadow-inner flex justify-center items-start min-h-[500px] transition-colors">
        {currentPage ? (
          <div
            className="transition-all duration-150 ease-out"
            style={{
              width: `${198 * zoomLevel}mm`,
              height: `${284 * zoomLevel}mm`,
              position: 'relative',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '198mm',
                height: '284mm',
                transform: `scale(${zoomLevel})`,
                transformOrigin: '0 0',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            >
              {/* Paper Elevation Wrapper - STRICTLY ISOLATED LIGHT MODE FOR PHYSICAL PAPER */}
              <div className="shadow-[0_20px_50px_rgba(0,0,0,0.18)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.7)] ring-1 ring-slate-900/15 dark:ring-white/10 rounded-xs bg-white pdf-light-isolate">
                <A4PageSheet
                  slips={currentPage.slips}
                  pageNumber={currentPage.pageNumber}
                  totalPages={currentPage.totalPages}
                  companyTitle={companyTitle}
                  sheetName={sheetName}
                  language={language}
                  template={selectedTemplate}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-16 text-center text-surface-500 dark:text-slate-400 space-y-2">
            <FileText className="w-10 h-10 mx-auto text-surface-400 dark:text-slate-500" />
            <p className="text-sm font-semibold">No employees selected for generation</p>
            <p className="text-xs text-surface-400 dark:text-slate-500">
              Return to the data review step to queue employees for PDF generation.
            </p>
          </div>
        )}
      </div>

      {/* =========================================================================
          5. HIDDEN DOCUMENT CONTAINER FOR PDF DOWNLOAD (Strict Light Mode)
          ========================================================================= */}
      <div
        ref={allPagesContainerRef}
        className="pdf-light-isolate light"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: -999,
          opacity: 0.01,
          pointerEvents: 'none',
          width: '198mm',
          backgroundColor: '#ffffff',
          color: '#0f172a',
          colorScheme: 'light',
        }}
      >
        {pages.map((p) => (
          <A4PageSheet
            key={`full-pdf-page-${p.pageNumber}`}
            slips={p.slips}
            pageNumber={p.pageNumber}
            totalPages={p.totalPages}
            companyTitle={companyTitle}
            sheetName={sheetName}
            language={language}
            template={selectedTemplate}
          />
        ))}
      </div>
    </div>
  );
};
