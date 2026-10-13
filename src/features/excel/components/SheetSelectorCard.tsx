import React from 'react';
import { Table, Calendar, Users, ArrowRight } from 'lucide-react';
import type { ParsedWorkbook } from '../types/excel.types';
import { Button } from '../../../components/ui/Button';

export interface SheetSelectorCardProps {
  workbook: ParsedWorkbook;
  activeSheetName: string;
  onSelectSheet: (sheetName: string) => void;
  onConfirm: () => void;
}

export const SheetSelectorCard: React.FC<SheetSelectorCardProps> = ({
  workbook,
  activeSheetName,
  onSelectSheet,
  onConfirm,
}) => {
  const sheetNames = workbook.meta.sheetNames;

  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-6 sm:p-8 shadow-card max-w-4xl mx-auto space-y-6">
      <div className="border-b border-surface-200 pb-4">
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span>Worksheet Selection</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-surface-900 tracking-tight">
          Select Salary Month or Worksheet
        </h2>
        <p className="text-xs sm:text-sm text-surface-500 mt-1">
          The uploaded workbook &ldquo;<strong>{workbook.meta.fileName}</strong>&rdquo; contains multiple worksheets.
          Please select which sheet you want to process into employee salary slips:
        </p>
      </div>

      {/* Grid of Sheet Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {sheetNames.map((name) => {
          const isSelected = name === activeSheetName;
          const sheet = workbook.sheets[name];
          const empCount = sheet ? sheet.employees.length : 0;

          return (
            <button
              key={name}
              type="button"
              onClick={() => onSelectSheet(name)}
              className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-sm'
                  : 'border-surface-200 hover:border-emerald-500/50 hover:bg-surface-50 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-medium text-surface-400">
                  <Table className="w-4 h-4 text-emerald-700" />
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-surface-900 tracking-tight truncate">
                  {name}
                </h3>
                <p className="text-[11px] text-surface-500 mt-0.5 flex items-center space-x-1">
                  <Users className="w-3 h-3 text-surface-400" />
                  <span>{empCount} employees</span>
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-surface-200">
        <div className="text-xs text-surface-500">
          Selected worksheet:{' '}
          <strong className="text-surface-900 font-semibold">{activeSheetName}</strong> (
          {workbook.sheets[activeSheetName]?.employees.length || 0} employees detected)
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={onConfirm}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Proceed with {activeSheetName}
        </Button>
      </div>
    </div>
  );
};
