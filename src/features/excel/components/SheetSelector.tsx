import React from 'react';
import { Table, Layers } from 'lucide-react';
import type { ParsedWorkbook } from '../types/excel.types';

export interface SheetSelectorProps {
  workbook: ParsedWorkbook;
  activeSheetName: string;
  onSelectSheet: (sheetName: string) => void;
}

export const SheetSelector: React.FC<SheetSelectorProps> = ({
  workbook,
  activeSheetName,
  onSelectSheet,
}) => {
  const sheetNames = workbook.meta.sheetNames;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-200 dark:border-slate-800 bg-surface-50/70 dark:bg-slate-900/80 px-4 py-2.5 transition-colors">
      {/* Worksheet Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar scroll-smooth">
        <span className="text-xs font-medium text-surface-500 dark:text-slate-400 mr-2 flex items-center space-x-1 flex-shrink-0">
          <Layers className="w-3.5 h-3.5 text-surface-400 dark:text-slate-500" />
          <span>Worksheets:</span>
        </span>

        {sheetNames.map((name) => {
          const isActive = name === activeSheetName;
          const sheet = workbook.sheets[name];
          const rowCount = sheet ? sheet.rowCount : 0;

          return (
            <button
              key={name}
              type="button"
              onClick={() => onSelectSheet(name)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 border ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 shadow-sm font-semibold'
                  : 'bg-transparent text-surface-600 dark:text-slate-400 border-transparent hover:bg-white/80 dark:hover:bg-slate-800 hover:text-surface-900 dark:hover:text-slate-100'
              }`}
            >
              <Table className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-surface-400 dark:text-slate-500'}`} />
              <span>{name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    : 'bg-surface-200/80 dark:bg-slate-700 text-surface-600 dark:text-slate-300'
                }`}
              >
                {rowCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sheet Summary */}
      <div className="text-[11px] text-surface-500 dark:text-slate-400 flex items-center space-x-3 flex-shrink-0">
        <span>
          <strong className="text-surface-700 dark:text-slate-300">{sheetNames.length}</strong> {sheetNames.length === 1 ? 'Sheet' : 'Sheets'} detected
        </span>
      </div>
    </div>
  );
};
