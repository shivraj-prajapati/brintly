import React from 'react';
import { SlidersHorizontal, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import type { ColumnMapping, SalaryInternalField, SheetColumn } from '../types/excel.types';
import { SALARY_FIELD_DEFINITIONS } from '../utils/column-definitions';
import { Button } from '../../../components/ui/Button';

export interface ColumnMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: SheetColumn[];
  mapping: ColumnMapping;
  onUpdateMapping: (field: SalaryInternalField, colIndex: number | null) => void;
}

export const ColumnMappingModal: React.FC<ColumnMappingModalProps> = ({
  isOpen,
  onClose,
  columns,
  mapping,
  onUpdateMapping,
}) => {
  if (!isOpen) return null;

  const usedIndices = Object.values(mapping).filter((idx): idx is number => idx !== null);
  const duplicates = usedIndices.filter((idx, i, arr) => arr.indexOf(idx) !== i);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-surface-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-surface-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-bold text-surface-900">
                Excel Column Header Mapping
              </h3>
              <p className="text-xs text-surface-500 mt-0.5">
                Auto-detected from Hindi and English column headers. Adjust assignments if needed:
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-surface-400 hover:text-surface-700 p-1.5 rounded-lg hover:bg-surface-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {duplicates.length > 0 && (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Warning: The same Excel column is mapped to multiple fields.</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SALARY_FIELD_DEFINITIONS.map((def) => {
              const currentColIdx = mapping[def.field];
              const isDuplicate = currentColIdx !== null && duplicates.includes(currentColIdx);

              return (
                <div
                  key={def.field}
                  className={`p-3 rounded-xl border text-xs flex flex-col justify-between ${
                    isDuplicate
                      ? 'border-amber-300 bg-amber-50/50'
                      : currentColIdx !== null
                      ? 'border-surface-200 bg-surface-50/60'
                      : 'border-dashed border-surface-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-bold text-surface-900">{def.labelEn}</span>
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
                    className="w-full text-xs font-mono bg-white border border-surface-200 rounded-lg px-2.5 py-1.5 text-surface-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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

        {/* Footer */}
        <div className="p-4 border-t border-surface-200 bg-surface-50 flex justify-end">
          <Button variant="primary" size="md" onClick={onClose}>
            Apply & Close
          </Button>
        </div>
      </div>
    </div>
  );
};
