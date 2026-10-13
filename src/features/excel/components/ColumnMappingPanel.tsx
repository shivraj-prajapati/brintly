import React from 'react';
import { SlidersHorizontal, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { ColumnMapping, SalaryInternalField, SheetColumn } from '../types/excel.types';
import { SALARY_FIELD_DEFINITIONS } from '../utils/column-definitions';

export interface ColumnMappingPanelProps {
  columns: SheetColumn[];
  mapping: ColumnMapping;
  onUpdateMapping: (field: SalaryInternalField, colIndex: number | null) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const ColumnMappingPanel: React.FC<ColumnMappingPanelProps> = ({
  columns,
  mapping,
  onUpdateMapping,
  isOpen,
  onToggleOpen,
}) => {
  // Check for duplicate assignments
  const usedIndices = Object.values(mapping).filter((idx): idx is number => idx !== null);
  const duplicates = usedIndices.filter((idx, i, arr) => arr.indexOf(idx) !== i);

  return (
    <div className="bg-white rounded-xl border border-surface-200 overflow-hidden shadow-subtle">
      {/* Header / Summary Bar */}
      <button
        type="button"
        onClick={onToggleOpen}
        className="w-full px-4 py-3 bg-surface-50/60 hover:bg-surface-100/60 transition-colors flex items-center justify-between text-left"
      >
        <div className="flex items-center space-x-2.5">
          <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
          <span className="text-xs font-semibold text-surface-900">
            Dynamic Column Mapping & Detection
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 font-medium">
            {Object.values(mapping).filter((v) => v !== null).length} mapped
          </span>
          {duplicates.length > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              <span>Duplicate mapping</span>
            </span>
          )}
        </div>

        <span className="text-xs text-emerald-700 font-semibold underline underline-offset-2">
          {isOpen ? 'Hide Mapping Settings' : 'Inspect / Adjust Columns'}
        </span>
      </button>

      {/* Expanded Mapping Grid */}
      {isOpen && (
        <div className="p-4 sm:p-5 border-t border-surface-200 bg-white space-y-4">
          <p className="text-xs text-surface-500 leading-relaxed">
            Columns are auto-detected from Hindi & English headers. If any column was assigned incorrectly or left unmapped, select the corresponding Excel column below:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SALARY_FIELD_DEFINITIONS.map((def) => {
              const currentColIdx = mapping[def.field];
              const isDuplicate = currentColIdx !== null && duplicates.includes(currentColIdx);

              return (
                <div
                  key={def.field}
                  className={`p-2.5 rounded-lg border text-xs flex flex-col justify-between ${
                    isDuplicate
                      ? 'border-amber-300 bg-amber-50/50'
                      : currentColIdx !== null
                      ? 'border-surface-200 bg-surface-50/40'
                      : 'border-dashed border-surface-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="font-semibold text-surface-900">{def.labelEn}</span>
                      <span className="text-surface-500 ml-1">({def.labelHi})</span>
                      {def.required && <span className="text-red-500 ml-0.5">*</span>}
                    </div>
                    {currentColIdx !== null && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </div>

                  <select
                    value={currentColIdx !== null ? currentColIdx : ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? null : Number(e.target.value);
                      onUpdateMapping(def.field, val);
                    }}
                    className="w-full text-xs font-mono bg-white border border-surface-200 rounded px-2 py-1 text-surface-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="">— Unmapped —</option>
                    {columns.map((col) => (
                      <option key={col.key} value={col.index}>
                        Col {col.letter}: {col.header}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
