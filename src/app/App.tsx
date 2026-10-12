import { useState } from 'react';
import '../index.css';
import { Header } from '../components/layout/Header';
import { ExcelUploader } from '../features/excel/components/ExcelUploader';
import { SpreadsheetPreview } from '../features/excel/components/SpreadsheetPreview';
import { useWorkbook } from '../features/excel/hooks/useWorkbook';
import {
  FileSpreadsheet,
  CheckCircle2,
  FileText,
  Shield,
  Layers,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function App() {
  // Initialize with the realistic mock financial workbook for the initial UI experience
  const {
    workbook,
    activeSheetName,
    currentSheet,
    isLoading,
    error,
    page,
    pageSize,
    searchQuery,
    filteredRows,
    paginatedRows,
    totalPages,
    setPage,
    setPageSize,
    setSearchQuery,
    selectSheet,
    handleFileUpload,
    loadDemoWorkbook,
    resetWorkbook,
  } = useWorkbook(true);

  const [proceedNotification, setProceedNotification] = useState<boolean>(false);

  const handleProceedToMapping = () => {
    setProceedNotification(true);
    setTimeout(() => {
      setProceedNotification(false);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-white text-surface-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Application Header */}
      <Header currentStep="upload" onDemoClick={loadDemoWorkbook} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Step Intro / Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-surface-200/80">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Step 1 of 4 • Workbook Ingestion</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-surface-900">
              Upload & Inspect Financial Model
            </h1>
            <p className="text-sm text-surface-500 mt-1 max-w-2xl leading-relaxed">
              Import balance sheets, P&L statements, or custom financial models. Preview structured cell
              data before configuring automated calculation rules and generating publication-ready PDFs.
            </p>
          </div>

          <div className="flex items-center space-x-3 flex-shrink-0">
            {workbook && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetWorkbook}
              >
                Upload New File
              </Button>
            )}
            <div className="flex items-center space-x-1.5 text-xs text-surface-500 bg-surface-50 border border-surface-200 px-3 py-1.5 rounded-lg">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero server upload • 100% in-browser</span>
            </div>
          </div>
        </div>

        {/* Floating Notification for Next Step */}
        {proceedNotification && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start justify-between shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold">Sheet inspection confirmed</p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Worksheet &ldquo;<strong>{activeSheetName}</strong>&rdquo; with{' '}
                  {currentSheet?.headers.length} columns and {currentSheet?.rowCount} rows is ready. Step 2 (Field
                  Mapping) is ready for connection to your calculation pipeline.
                </p>
              </div>
            </div>
            <button
              onClick={() => setProceedNotification(false)}
              className="text-xs text-emerald-700 hover:text-emerald-900 ml-4 font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading State Overlay */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-surface-200 p-16 text-center shadow-subtle flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-surface-900">Parsing Excel Structure</h3>
              <p className="text-xs text-surface-500">Reading worksheets, cell data, and formulas...</p>
            </div>
          </div>
        ) : !workbook ? (
          /* Empty / Initial Upload State */
          <div className="space-y-8">
            <ExcelUploader
              onFileUpload={handleFileUpload}
              onLoadDemo={loadDemoWorkbook}
              isLoading={isLoading}
              error={error}
            />

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="p-5 rounded-xl border border-surface-200/90 bg-surface-50/50">
                <div className="w-9 h-9 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center mb-3">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-surface-900 mb-1">
                  Multi-Sheet Workbook Ingestion
                </h4>
                <p className="text-xs text-surface-500 leading-relaxed">
                  Automatically extracts all worksheet tabs, preserved column hierarchies, and numeric formats
                  from single or complex multi-tab financial workbooks.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-surface-200/90 bg-surface-50/50">
                <div className="w-9 h-9 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center mb-3">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-surface-900 mb-1">
                  Dynamic Financial Mapping
                </h4>
                <p className="text-xs text-surface-500 leading-relaxed">
                  Map spreadsheet columns to GAAP financial statements, balance sheet sections, or EBITDA
                  schedules with automatic header inference.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-surface-200/90 bg-surface-50/50">
                <div className="w-9 h-9 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-surface-900 mb-1">
                  High-Fidelity PDF Output
                </h4>
                <p className="text-xs text-surface-500 leading-relaxed">
                  Generate boardroom-ready executive PDF reports with tailored vector typography, corporate
                  theming, and precise pagination controls.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Active Workbook Inspection & Preview State */
          <div className="space-y-6">
            <SpreadsheetPreview
              workbook={workbook}
              activeSheetName={activeSheetName}
              currentSheet={currentSheet}
              paginatedRows={paginatedRows}
              totalFilteredRows={filteredRows.length}
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              searchQuery={searchQuery}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              onSearchChange={setSearchQuery}
              onSelectSheet={selectSheet}
              onReset={resetWorkbook}
              onProceedToMapping={handleProceedToMapping}
            />

            {/* Quick Summary Cards below the sheet */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-surface-200 bg-white">
                <span className="text-[11px] font-medium text-surface-500 uppercase tracking-wider">
                  Active Sheet
                </span>
                <p className="text-base font-semibold text-surface-900 mt-1 truncate">
                  {activeSheetName}
                </p>
                <span className="text-xs text-emerald-600 font-medium mt-0.5 inline-block">
                  Verified Structure
                </span>
              </div>

              <div className="p-4 rounded-xl border border-surface-200 bg-white">
                <span className="text-[11px] font-medium text-surface-500 uppercase tracking-wider">
                  Total Records
                </span>
                <p className="text-base font-semibold text-surface-900 mt-1 font-mono">
                  {currentSheet?.rowCount || 0} Rows
                </p>
                <span className="text-xs text-surface-500 mt-0.5 inline-block">
                  {currentSheet?.columnCount || 0} Total Columns
                </span>
              </div>

              <div className="p-4 rounded-xl border border-surface-200 bg-white">
                <span className="text-[11px] font-medium text-surface-500 uppercase tracking-wider">
                  Detected Header
                </span>
                <p className="text-base font-semibold text-surface-900 mt-1 truncate">
                  Row 1 (Column Letters A-{currentSheet?.headers[currentSheet.headers.length - 1]?.letter || 'A'})
                </p>
                <span className="text-xs text-emerald-600 font-medium mt-0.5 inline-block">
                  Auto-aligned
                </span>
              </div>

              <div className="p-4 rounded-xl border border-surface-200 bg-white">
                <span className="text-[11px] font-medium text-surface-500 uppercase tracking-wider">
                  Processing Pipeline
                </span>
                <p className="text-base font-semibold text-surface-900 mt-1">
                  Ready for Mapping
                </p>
                <span className="text-xs text-surface-500 mt-0.5 inline-block">
                  Step 2 of 4
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Clean Dashboard Footer */}
      <footer className="mt-auto border-t border-surface-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-surface-500">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-surface-700">Brintly</span>
            <span>•</span>
            <span>Excel to Financial PDF Web Application</span>
          </div>
          <div className="flex items-center space-x-6 text-surface-500">
            <span>RFC-complaint numeric engine</span>
            <span>Client-side sandbox</span>
            <span>TypeScript strict</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
