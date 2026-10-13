import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Calculator,
  Coins,
  Globe,
  HelpCircle,
  Eye,
  Check,
} from 'lucide-react';
import type {
  SalaryCalculationMode,
  SalaryRoundingRule,
  PdfLanguage,
} from '../../calculations/salary-engine';
import type { ParsedWorkbook, SheetSection } from '../types/excel.types';

export interface CompactToolbarProps {
  workbook: ParsedWorkbook;
  activeSheetName: string;
  onSelectSheet: (name: string) => void;
  calculationMode: SalaryCalculationMode;
  onCalculationModeChange: (mode: SalaryCalculationMode) => void;
  roundingRule: SalaryRoundingRule;
  onRoundingRuleChange: (rule: SalaryRoundingRule) => void;
  pdfLanguage: PdfLanguage;
  onPdfLanguageChange: (lang: PdfLanguage) => void;
  isExclusionEnabled: boolean;
  onToggleExclusion: (enabled: boolean) => void;
  lastSection: SheetSection | null;
  includedCount: number;
  excludedCount: number;
  onOpenInspectModal: () => void;
}

export const CompactToolbar: React.FC<CompactToolbarProps> = ({
  workbook,
  activeSheetName,
  onSelectSheet,
  calculationMode,
  onCalculationModeChange,
  roundingRule,
  onRoundingRuleChange,
  pdfLanguage,
  onPdfLanguageChange,
  isExclusionEnabled,
  onToggleExclusion,
  lastSection,
  includedCount,
  excludedCount,
  onOpenInspectModal,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-surface-200 shadow-subtle p-3.5 sm:p-4 space-y-3">
      {/* 1. Worksheet Tabs Bar (Prominently displayed right at the top) */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-surface-200 overflow-x-auto">
        <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5">
          <span className="text-xs font-bold text-surface-500 uppercase tracking-wider mr-2 flex items-center space-x-1 flex-shrink-0">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sheets:</span>
          </span>

          {workbook.meta.sheetNames.map((name) => {
            const isSelected = name === activeSheetName;
            const sheet = workbook.sheets[name];
            const count = sheet ? sheet.employees.length : 0;

            return (
              <button
                key={name}
                type="button"
                onClick={() => onSelectSheet(name)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex-shrink-0 border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-surface-50 text-surface-600 border-surface-200 hover:bg-surface-100 hover:text-surface-900'
                }`}
              >
                <span>{name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected
                      ? 'bg-emerald-800 text-white'
                      : 'bg-surface-200/80 text-surface-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Compact Settings Row (Compact pills with tooltips) */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Calculation Mode Pill */}
          <div className="relative inline-flex items-center">
            <div className="flex items-center bg-surface-50 border border-surface-200 rounded-lg p-0.5">
              <span
                className="px-2 text-surface-500 flex items-center space-x-1 cursor-help"
                onMouseEnter={() => setActiveTooltip('calcMode')}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <Calculator className="w-3.5 h-3.5 text-surface-500" />
                <span className="font-medium text-[11px]">Mode:</span>
              </span>
              <button
                type="button"
                onClick={() => onCalculationModeChange('formula')}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                  calculationMode === 'formula'
                    ? 'bg-white text-surface-900 shadow-xs border border-surface-200 font-bold'
                    : 'text-surface-500 hover:text-surface-900'
                }`}
              >
                Rate×Days
              </button>
              <button
                type="button"
                onClick={() => onCalculationModeChange('excel_amount')}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                  calculationMode === 'excel_amount'
                    ? 'bg-white text-surface-900 shadow-xs border border-surface-200 font-bold'
                    : 'text-surface-500 hover:text-surface-900'
                }`}
              >
                Excel Amount
              </button>
            </div>

            {/* Tooltip */}
            {activeTooltip === 'calcMode' && (
              <div className="absolute top-full left-0 mt-1 z-30 w-64 p-2 bg-slate-900 text-white rounded-lg shadow-xl text-[11px] leading-relaxed animate-in fade-in">
                <strong>Formula:</strong> (Rate + Increase) × Days + ((Rate + Increase)/12 × Hours).
                Switch to &ldquo;Excel Amount&rdquo; to use uploaded sheet value directly.
              </div>
            )}
          </div>

          {/* Exclude Last Section Pill */}
          <div className="relative inline-flex items-center">
            <div
              className={`flex items-center space-x-2 px-2.5 py-1 rounded-lg border text-[11px] transition-all ${
                isExclusionEnabled && lastSection
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                  : 'bg-surface-50 border-surface-200 text-surface-600'
              }`}
            >
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isExclusionEnabled}
                  onChange={(e) => onToggleExclusion(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="font-semibold">
                  Exclude Last Section
                  {lastSection && (
                    <span className="font-normal ml-1">
                      ({lastSection.title} • {lastSection.employeeCount})
                    </span>
                  )}
                </span>
              </label>

              {isExclusionEnabled && excludedCount > 0 && (
                <button
                  type="button"
                  onClick={onOpenInspectModal}
                  className="text-emerald-700 hover:text-emerald-900 font-bold ml-1 flex items-center space-x-0.5 underline underline-offset-2"
                  title="View excluded employees"
                >
                  <Eye className="w-3 h-3" />
                  <span>Inspect</span>
                </button>
              )}

              <span
                className="cursor-help text-surface-400 hover:text-surface-600"
                onMouseEnter={() => setActiveTooltip('exclusion')}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <HelpCircle className="w-3 h-3" />
              </span>
            </div>

            {/* Tooltip */}
            {activeTooltip === 'exclusion' && (
              <div className="absolute top-full left-0 mt-1 z-30 w-64 p-2 bg-slate-900 text-white rounded-lg shadow-xl text-[11px] leading-relaxed animate-in fade-in">
                Default: Enabled. Excludes the final data block from print slips without affecting earlier sections.
              </div>
            )}
          </div>

          {/* Rounding Rule Pill */}
          <div className="relative inline-flex items-center">
            <div className="flex items-center bg-surface-50 border border-surface-200 rounded-lg p-0.5">
              <span
                className="px-2 text-surface-500 flex items-center space-x-1 cursor-help"
                onMouseEnter={() => setActiveTooltip('rounding')}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <Coins className="w-3.5 h-3.5 text-surface-500" />
                <span className="font-medium text-[11px]">Rounding:</span>
              </span>
              <button
                type="button"
                onClick={() => onRoundingRuleChange('exact')}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                  roundingRule === 'exact'
                    ? 'bg-white text-surface-900 shadow-xs border border-surface-200 font-bold'
                    : 'text-surface-500 hover:text-surface-900'
                }`}
              >
                Exact
              </button>
              <button
                type="button"
                onClick={() => onRoundingRuleChange('nearest_ten')}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                  roundingRule === 'nearest_ten'
                    ? 'bg-white text-surface-900 shadow-xs border border-surface-200 font-bold'
                    : 'text-surface-500 hover:text-surface-900'
                }`}
              >
                Nearest 10
              </button>
              <button
                type="button"
                onClick={() => onRoundingRuleChange('round_up')}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                  roundingRule === 'round_up'
                    ? 'bg-white text-surface-900 shadow-xs border border-surface-200 font-bold'
                    : 'text-surface-500 hover:text-surface-900'
                }`}
              >
                Round Up
              </button>
            </div>

            {/* Tooltip */}
            {activeTooltip === 'rounding' && (
              <div className="absolute top-full left-0 mt-1 z-30 w-64 p-2 bg-slate-900 text-white rounded-lg shadow-xl text-[11px] leading-relaxed animate-in fade-in">
                <strong>Exact:</strong> Keeps amount unchanged.<br />
                <strong>Nearest 10:</strong> 0-4 down, 5-9 up.<br />
                <strong>Round Up:</strong> Non-zero last digit rounds up to 10.
              </div>
            )}
          </div>

          {/* PDF Language Pill */}
          <div className="flex items-center bg-surface-50 border border-surface-200 rounded-lg p-0.5">
            <span className="px-2 text-surface-500 flex items-center space-x-1">
              <Globe className="w-3.5 h-3.5 text-surface-500" />
              <span className="font-medium text-[11px]">Lang:</span>
            </span>
            <button
              type="button"
              onClick={() => onPdfLanguageChange('en')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                pdfLanguage === 'en'
                  ? 'bg-white text-surface-900 shadow-xs border border-surface-200 font-bold'
                  : 'text-surface-500 hover:text-surface-900'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onPdfLanguageChange('hi')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                pdfLanguage === 'hi'
                  ? 'bg-white text-surface-900 shadow-xs border border-surface-200 font-bold text-emerald-800'
                  : 'text-surface-500 hover:text-surface-900'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>

        {/* Included Counts Summary */}
        <div className="text-[11px] font-medium text-surface-500 flex items-center space-x-2">
          <span className="text-emerald-700 font-bold flex items-center space-x-1">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>{includedCount} for PDF</span>
          </span>
          {excludedCount > 0 && (
            <span>({excludedCount} excluded)</span>
          )}
        </div>
      </div>
    </div>
  );
};
