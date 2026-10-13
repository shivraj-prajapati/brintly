import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import '../index.css';
import { Header } from '../components/layout/Header';
import { HomeLandingView } from '../features/landing/components/HomeLandingView';
import { CompactToolbar } from '../features/excel/components/CompactToolbar';
import { ExcludedEmployeesModal } from '../features/excel/components/ExcludedEmployeesModal';
import { SpreadsheetDataView } from '../features/excel/components/SpreadsheetDataView';
import { InteractivePdfPreview } from '../features/pdf/components/InteractivePdfPreview';
import { TemplateGalleryModal } from '../features/pdf/components/TemplateGalleryModal';
import { PrintableDocument } from '../features/pdf/components/PrintableDocument';
import { A4PageSheet } from '../features/pdf/components/A4PageSheet';
import { paginateEmployeesForA4, calculateA4PageCount } from '../features/pdf/utils/pagination';
import { downloadSalarySlipsPdf } from '../features/pdf/services/pdf-export';
import { ExcelParserService } from '../features/excel/services/excel-parser';
import {
  calculateEmployeeRecord,
  type SalaryCalculationMode,
  type SalaryRoundingRule,
  type PdfLanguage,
  type CalculatedEmployeeRecord,
} from '../features/calculations/salary-engine';
import type {
  ParsedWorkbook,
  SheetData,
  WorkflowStep,
} from '../features/excel/types/excel.types';
import type { PdfTemplateId } from '../features/pdf/types/template.types';
import { StorageKeys, getStoredConfig, setStoredConfig } from '../lib/storage';
import { Button } from '../components/ui/Button';
import { Download, Printer, Eye, Loader2 } from 'lucide-react';

export default function App() {
  // 1. Core State
  const [workbook, setWorkbook] = useState<ParsedWorkbook | null>(null);
  const [activeSheetName, setActiveSheetName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Workflow & Persistent Configuration State (Saved in LocalStorage)
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('upload');
  const [calculationMode, setCalculationMode] = useState<SalaryCalculationMode>(() =>
    getStoredConfig(StorageKeys.CALC_MODE, 'formula')
  );
  const [roundingRule, setRoundingRule] = useState<SalaryRoundingRule>(() =>
    getStoredConfig(StorageKeys.ROUNDING, 'exact')
  );
  const [pdfLanguage, setPdfLanguage] = useState<PdfLanguage>(() =>
    getStoredConfig(StorageKeys.LANGUAGE, 'en')
  );
  const [selectedTemplate, setSelectedTemplate] = useState<PdfTemplateId>(() =>
    getStoredConfig(StorageKeys.TEMPLATE, 'corporate')
  );
  const [isExclusionEnabled, setIsExclusionEnabled] = useState<boolean>(() =>
    getStoredConfig(StorageKeys.EXCLUSION, true)
  );

  // Synchronize user preferences to LocalStorage
  useEffect(() => {
    setStoredConfig(StorageKeys.TEMPLATE, selectedTemplate);
  }, [selectedTemplate]);

  useEffect(() => {
    setStoredConfig(StorageKeys.LANGUAGE, pdfLanguage);
  }, [pdfLanguage]);

  useEffect(() => {
    setStoredConfig(StorageKeys.CALC_MODE, calculationMode);
  }, [calculationMode]);

  useEffect(() => {
    setStoredConfig(StorageKeys.ROUNDING, roundingRule);
  }, [roundingRule]);

  useEffect(() => {
    setStoredConfig(StorageKeys.EXCLUSION, isExclusionEnabled);
  }, [isExclusionEnabled]);

  // 3. Modals & Overrides
  const [isInspectModalOpen, setIsInspectModalOpen] = useState<boolean>(false);
  const [isTemplateGalleryOpen, setIsTemplateGalleryOpen] = useState<boolean>(false);
  const [employeeFieldOverrides, setEmployeeFieldOverrides] = useState<
    Record<string, Record<string, number>>
  >({});
  const [employeeSelectionOverrides, setEmployeeSelectionOverrides] = useState<
    Record<string, boolean>
  >({});

  // 4. Standalone PDF Export State
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const offscreenPrintRef = useRef<HTMLDivElement>(null);

  // Handle Excel file upload: Direct jump to spreadsheet view
  const handleFileUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const parsed = await ExcelParserService.parseFile(file);
      setWorkbook(parsed);
      setActiveSheetName(parsed.defaultSheet);
      setEmployeeFieldOverrides({});
      setEmployeeSelectionOverrides({});
      setCurrentStep('inspect');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to process Excel workbook.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle 1-Click Demo File Load (demo.xlsx - Safe & Generic)
  const handleLoadDemo = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/demo.xlsx');
      if (!response.ok) {
        throw new Error('Demo file could not be loaded from server.');
      }
      const blob = await response.blob();
      const demoFile = new File([blob], 'demo.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      await handleFileUpload(demoFile);
    } catch (err: unknown) {
      console.error('Failed to load demo file:', err);
      setError('Unable to load demo payroll file. You can still upload your own Excel file.');
      setIsLoading(false);
    }
  }, [handleFileUpload]);

  // Reset to Home State
  const handleReset = useCallback(() => {
    setWorkbook(null);
    setActiveSheetName('');
    setError(null);
    setCurrentStep('upload');
    setEmployeeFieldOverrides({});
    setEmployeeSelectionOverrides({});
  }, []);

  // Active sheet object
  const currentSheet: SheetData | null = useMemo(() => {
    if (!workbook || !activeSheetName) return null;
    return workbook.sheets[activeSheetName] || null;
  }, [workbook, activeSheetName]);

  // Last section determination for exclusion
  const lastSection = useMemo(() => {
    if (!currentSheet || currentSheet.sections.length <= 1) return null;
    return currentSheet.sections[currentSheet.sections.length - 1];
  }, [currentSheet]);

  // Calculate all employees with zero decimal net amount guarantee
  const calculatedEmployees: CalculatedEmployeeRecord[] = useMemo(() => {
    if (!currentSheet) return [];

    return currentSheet.employees.map((baseEmp) => {
      const overrides = employeeFieldOverrides[baseEmp.id] || {};
      const isDeselected = employeeSelectionOverrides[baseEmp.id] === false;

      const isExcludedByLastSection = isExclusionEnabled && lastSection
        ? baseEmp.sectionName === lastSection.title
        : false;

      const mergedRaw = {
        id: baseEmp.id,
        rowIndex: baseEmp.rowIndex,
        serialNumber: baseEmp.serialNumber,
        name: baseEmp.name,
        sectionName: baseEmp.sectionName,
        rate: overrides.dailyRate !== undefined ? overrides.dailyRate : baseEmp.dailyRate,
        days: overrides.days !== undefined ? overrides.days : baseEmp.days,
        hours: overrides.hours !== undefined ? overrides.hours : baseEmp.hours,
        increase: overrides.increase !== undefined ? overrides.increase : baseEmp.increase,
        excelGrossAmount: baseEmp.excelGrossAmount,
        advance: overrides.advance !== undefined ? overrides.advance : baseEmp.advance,
        pf: overrides.pf !== undefined ? overrides.pf : baseEmp.pf,
      };

      return calculateEmployeeRecord(mergedRaw, calculationMode, roundingRule, {
        isSelected: !isDeselected,
        isExcludedByRule: isExcludedByLastSection,
      });
    });
  }, [
    currentSheet,
    calculationMode,
    roundingRule,
    isExclusionEnabled,
    lastSection,
    employeeFieldOverrides,
    employeeSelectionOverrides,
  ]);

  const includedInPdfEmployees = useMemo(() => {
    return calculatedEmployees.filter((e) => e.isSelected && !e.isExcludedByRule);
  }, [calculatedEmployees]);

  const excludedEmployeesList = useMemo(() => {
    return calculatedEmployees.filter((e) => e.isExcludedByRule);
  }, [calculatedEmployees]);

  // Live inline edit handler
  const handleUpdateEmployeeField = (empId: string, field: string, val: number) => {
    setEmployeeFieldOverrides((prev) => ({
      ...prev,
      [empId]: {
        ...(prev[empId] || {}),
        [field]: val,
      },
    }));
  };

  const handleToggleSelectEmployee = (empId: string) => {
    setEmployeeSelectionOverrides((prev) => {
      const currentVal = prev[empId] !== undefined ? prev[empId] : true;
      return { ...prev, [empId]: !currentVal };
    });
  };

  const handleSelectAll = () => {
    const newOverrides: Record<string, boolean> = {};
    calculatedEmployees.forEach((e) => {
      newOverrides[e.id] = true;
    });
    setEmployeeSelectionOverrides(newOverrides);
  };

  const handleDeselectAll = () => {
    const newOverrides: Record<string, boolean> = {};
    calculatedEmployees.forEach((e) => {
      newOverrides[e.id] = false;
    });
    setEmployeeSelectionOverrides(newOverrides);
  };

  // Direct Standalone Download PDF
  const handleDirectDownloadPdf = async () => {
    if (!offscreenPrintRef.current) return;
    setIsExportingPdf(true);
    setExportProgress(10);
    try {
      const fileName = `Brintly-Salary-Slips-${activeSheetName || 'Sheet'}.pdf`;
      await downloadSalarySlipsPdf(
        offscreenPrintRef.current,
        fileName,
        (progress) => setExportProgress(progress)
      );
    } catch (err) {
      console.error('PDF download error:', err);
      alert('PDF generation encountered an issue. You can also use Print Slips.');
    } finally {
      setIsExportingPdf(false);
      setExportProgress(0);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const printablePages = useMemo(() => {
    return paginateEmployeesForA4(includedInPdfEmployees);
  }, [includedInPdfEmployees]);

  const estimatedPages = calculateA4PageCount(includedInPdfEmployees.length);

  return (
    <div className="min-h-screen bg-surface-bg text-surface-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. Header (Navbar with clickable Brintly Logo, Upload Action & Template Gallery Trigger) */}
      <Header
        currentStep={currentStep}
        hasWorkbook={!!workbook}
        onReset={handleReset}
        onStepClick={(step) => setCurrentStep(step)}
        onFileUpload={handleFileUpload}
        onOpenTemplateGallery={() => setIsTemplateGalleryOpen(true)}
      />

      {/* 2. Main Workspace */}
      <main className="flex-1 max-w-screen-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
        {isLoading ? (
          <div className="bg-white rounded-3xl border border-surface-200 p-16 text-center shadow-card flex flex-col items-center justify-center space-y-4 my-8">
            <div className="w-12 h-12 rounded-full border-3 border-emerald-600 border-t-transparent animate-spin" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-surface-900">Processing Excel Workbook</h3>
              <p className="text-xs text-surface-500">
                Detecting Hindi & English headers, section boundaries, and salary formulas...
              </p>
            </div>
          </div>
        ) : !workbook || currentStep === 'upload' ? (
          /* Step 1: Clean Website Landing View (Hero Upload + 1-Click Demo + Feature Showcase) */
          <HomeLandingView
            onFileUpload={handleFileUpload}
            onLoadDemo={handleLoadDemo}
            isLoading={isLoading}
            error={error}
          />
        ) : currentStep === 'export' ? (
          /* Step 3: Interactive PDF Preview & Generation */
          <InteractivePdfPreview
            employees={includedInPdfEmployees}
            companyTitle={currentSheet?.companyTitle || 'GLOBAL ENTERPRISES'}
            sheetName={activeSheetName}
            language={pdfLanguage}
            onLanguageChange={setPdfLanguage}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={setSelectedTemplate}
            onOpenTemplateGallery={() => setIsTemplateGalleryOpen(true)}
            onBackToData={() => setCurrentStep('inspect')}
          />
        ) : (
          /* Step 2: Spreadsheet Data View with Compact Toolbar */
          <div className="space-y-4">
            {/* COMPACT TOOLBAR (Sheet tabs + tooltips + 5 templates) */}
            <CompactToolbar
              workbook={workbook}
              activeSheetName={activeSheetName}
              onSelectSheet={setActiveSheetName}
              calculationMode={calculationMode}
              onCalculationModeChange={setCalculationMode}
              roundingRule={roundingRule}
              onRoundingRuleChange={setRoundingRule}
              pdfLanguage={pdfLanguage}
              onPdfLanguageChange={setPdfLanguage}
              isExclusionEnabled={isExclusionEnabled}
              onToggleExclusion={setIsExclusionEnabled}
              lastSection={lastSection}
              includedCount={includedInPdfEmployees.length}
              excludedCount={excludedEmployeesList.length}
              onOpenInspectModal={() => setIsInspectModalOpen(true)}
            />

            {/* SPREADSHEET TABLE with Direct English/Hindi Headers & Sort Order */}
            <SpreadsheetDataView
              employees={calculatedEmployees}
              calculationMode={calculationMode}
              pdfLanguage={pdfLanguage}
              onToggleSelectEmployee={handleToggleSelectEmployee}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              onUpdateEmployeeField={handleUpdateEmployeeField}
            />

            {/* Bottom Sticky Action Bar: Separate Download & Print buttons */}
            <div className="bg-white rounded-2xl border border-surface-200 p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky bottom-4 z-20">
              <div>
                <div className="flex items-center space-x-2 text-sm font-bold text-surface-900">
                  <span>{includedInPdfEmployees.length} of {calculatedEmployees.length} queued for PDF</span>
                  <span className="text-surface-300">•</span>
                  <span className="text-emerald-700">
                    {estimatedPages} A4 pages (4 slips/page)
                  </span>
                </div>
                <p className="text-xs text-surface-500 mt-0.5">
                  Sheet: &ldquo;{activeSheetName}&rdquo; • Mode: {calculationMode} • Template: {selectedTemplate} • Labels: {pdfLanguage === 'en' ? 'English' : 'Hindi'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleDirectDownloadPdf}
                  disabled={isExportingPdf || includedInPdfEmployees.length === 0}
                  leftIcon={
                    isExportingPdf ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )
                  }
                >
                  {isExportingPdf ? `Saving PDF (${exportProgress}%)...` : 'Download PDF'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={handlePrint}
                  disabled={isExportingPdf || includedInPdfEmployees.length === 0}
                  leftIcon={<Printer className="w-4 h-4" />}
                >
                  Print Slips
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setCurrentStep('export')}
                  disabled={includedInPdfEmployees.length === 0}
                  leftIcon={<Eye className="w-4 h-4 text-emerald-600" />}
                >
                  Preview Layout
                </Button>
              </div>
            </div>

            {/* Modal: Excluded Employees */}
            <ExcludedEmployeesModal
              isOpen={isInspectModalOpen}
              onClose={() => setIsInspectModalOpen(false)}
              excludedEmployees={excludedEmployeesList}
              sectionTitle={lastSection?.title}
            />
          </div>
        )}
      </main>

      {/* 3. Offscreen Printable Container for Standalone PDF Generation */}
      <div
        ref={offscreenPrintRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: -999,
          opacity: 0.01,
          pointerEvents: 'none',
          width: '198mm',
          backgroundColor: '#ffffff',
        }}
      >
        {printablePages.map((p) => (
          <A4PageSheet
            key={`offscreen-pdf-${p.pageNumber}`}
            slips={p.slips}
            pageNumber={p.pageNumber}
            totalPages={p.totalPages}
            companyTitle={currentSheet?.companyTitle || 'GLOBAL ENTERPRISES'}
            sheetName={activeSheetName}
            language={pdfLanguage}
            template={selectedTemplate}
          />
        ))}
      </div>

      {/* 4. Hidden Printable Document (Triggered by window.print()) */}
      {workbook && (
        <PrintableDocument
          employees={includedInPdfEmployees}
          companyTitle={currentSheet?.companyTitle || 'GLOBAL ENTERPRISES'}
          sheetName={activeSheetName}
          language={pdfLanguage}
          template={selectedTemplate}
        />
      )}

      {/* 5. Minimal Professional Footer */}
      <footer className="mt-auto border-t border-surface-200 bg-white py-4 sm:py-5">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-surface-500">
          <div className="flex items-center space-x-2.5">
            <img
              src="/logo/logo.png"
              alt="Brintly"
              className="w-5 h-5 rounded-md object-cover shadow-2xs"
            />
            <span className="font-logo font-black text-black text-sm tracking-tight">Brintly</span>
            <span>•</span>
            <span>Excel to PDF Salary Slips</span>
          </div>
          <div className="flex items-center space-x-4 text-surface-500">
            <span>A4 Portrait (2×2 Grid)</span>
            <span>•</span>
            <span>Devanagari Hindi & English</span>
            <span>•</span>
            <span>Built-in Cutting Guides</span>
          </div>
        </div>
      </footer>

      {/* 6. Template Gallery Modal (Visual comparison of all 5 templates) */}
      <TemplateGalleryModal
        isOpen={isTemplateGalleryOpen}
        onClose={() => setIsTemplateGalleryOpen(false)}
        selectedTemplate={selectedTemplate}
        onSelectTemplate={setSelectedTemplate}
        language={pdfLanguage}
        sampleEmployee={includedInPdfEmployees[0] || null}
        companyTitle={currentSheet?.companyTitle || 'GLOBAL ENTERPRISES'}
        sheetName={activeSheetName || 'JANUARY'}
      />
    </div>
  );
}
