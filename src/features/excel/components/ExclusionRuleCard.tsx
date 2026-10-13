import React, { useState } from 'react';
import { Eye, CheckCircle2, ChevronDown } from 'lucide-react';
import type { SheetSection } from '../types/excel.types';
import type { CalculatedEmployeeRecord } from '../../calculations/salary-engine';

export interface ExclusionRuleCardProps {
  sections: SheetSection[];
  isExclusionEnabled: boolean;
  onToggleExclusion: (enabled: boolean) => void;
  selectedExcludedSectionId: string | null;
  onSelectExcludedSection: (sectionId: string) => void;
  includedCount: number;
  excludedCount: number;
  excludedEmployees: CalculatedEmployeeRecord[];
}

export const ExclusionRuleCard: React.FC<ExclusionRuleCardProps> = ({
  sections,
  isExclusionEnabled,
  onToggleExclusion,
  selectedExcludedSectionId,
  onSelectExcludedSection,
  includedCount,
  excludedCount,
  excludedEmployees,
}) => {
  const [showInspectionModal, setShowInspectionModal] = useState<boolean>(false);

  const hasMultipleSections = sections.length > 1;
  const currentExcludedSection = sections.find((s) => s.id === selectedExcludedSectionId) || (hasMultipleSections ? sections[sections.length - 1] : null);

  return (
    <>
      <div className="bg-white rounded-xl border border-surface-200 p-4 sm:p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Toggle & Details */}
        <div className="flex items-start space-x-3.5">
          <label className="relative flex items-center cursor-pointer mt-0.5">
            <input
              type="checkbox"
              checked={isExclusionEnabled}
              onChange={(e) => onToggleExclusion(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-surface-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
          </label>

          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-surface-900 tracking-tight">
                Exclude the last section / अंतिम सेक्शन शामिल न करें
              </h3>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Default: Enabled
              </span>
            </div>

            <p className="text-xs text-surface-500 mt-1 leading-relaxed">
              {hasMultipleSections ? (
                <>
                  Excludes the final data group &ldquo;
                  <strong className="text-surface-800 font-semibold">
                    {currentExcludedSection?.title || 'Last Section'}
                  </strong>
                  &rdquo; ({currentExcludedSection?.employeeCount || 0} employees) from the generated PDF slips.
                </>
              ) : (
                'Single section detected. No sub-sections found in this worksheet.'
              )}
            </p>

            {/* Counts Badge */}
            <div className="flex items-center space-x-3 text-xs mt-2">
              <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Included in PDF: {includedCount} employees</span>
              </span>
              <span>•</span>
              <span className="text-surface-500 font-medium">
                Excluded: {isExclusionEnabled ? excludedCount : 0} employees
              </span>
            </div>
          </div>
        </div>

        {/* Section Picker & Inspect Button */}
        <div className="flex items-center space-x-2.5 self-start md:self-auto flex-shrink-0">
          {hasMultipleSections && isExclusionEnabled && (
            <div className="relative">
              <select
                value={currentExcludedSection?.id || ''}
                onChange={(e) => onSelectExcludedSection(e.target.value)}
                className="text-xs bg-surface-50 border border-surface-200 rounded-lg px-2.5 py-1.5 text-surface-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-7 appearance-none cursor-pointer font-medium"
              >
                {sections.map((sec, idx) => (
                  <option key={sec.id} value={sec.id}>
                    {idx === sections.length - 1 ? '★ Final: ' : 'Section: '}
                    {sec.title} ({sec.employeeCount} emp)
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-surface-400 absolute right-2 top-2.5 pointer-events-none" />
            </div>
          )}

          {isExclusionEnabled && excludedEmployees.length > 0 && (
            <button
              type="button"
              onClick={() => setShowInspectionModal(true)}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              <span>Inspect Excluded ({excludedEmployees.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Modal / Dialog to inspect excluded records */}
      {showInspectionModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl border border-surface-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 sm:p-5 border-b border-surface-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-surface-900">
                  Inspect Excluded Employees ({excludedEmployees.length})
                </h3>
                <p className="text-xs text-surface-500 mt-0.5">
                  Section: &ldquo;{currentExcludedSection?.title}&rdquo; • These employees will not appear in the PDF.
                </p>
              </div>
              <button
                onClick={() => setShowInspectionModal(false)}
                className="text-xs text-surface-400 hover:text-surface-700 font-semibold p-1.5 rounded-lg hover:bg-surface-100"
              >
                Close ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              <table className="w-full text-xs text-left">
                <thead className="bg-surface-50 text-surface-500 uppercase tracking-wider text-[10px] border-b border-surface-200">
                  <tr>
                    <th className="py-2 px-3">Sr. No.</th>
                    <th className="py-2 px-3">Employee Name</th>
                    <th className="py-2 px-3 text-right">Daily Rate</th>
                    <th className="py-2 px-3 text-right">Days</th>
                    <th className="py-2 px-3 text-right">Gross Amount</th>
                    <th className="py-2 px-3 text-right">Net Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {excludedEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-surface-50/50">
                      <td className="py-2 px-3 font-mono text-surface-600">#{emp.serialNumber}</td>
                      <td className="py-2 px-3 font-medium text-surface-900">{emp.name}</td>
                      <td className="py-2 px-3 text-right font-mono">₹{emp.dailyRate}</td>
                      <td className="py-2 px-3 text-right font-mono">{emp.days}</td>
                      <td className="py-2 px-3 text-right font-mono">₹{emp.grossAmount.toLocaleString('en-IN')}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">₹{emp.netAmount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-surface-200 bg-surface-50 flex justify-between items-center text-xs">
              <span className="text-surface-500">
                To include these employees in the PDF, uncheck the exclusion toggle.
              </span>
              <button
                onClick={() => setShowInspectionModal(false)}
                className="px-4 py-1.5 rounded-lg bg-surface-900 text-white font-medium hover:bg-surface-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
