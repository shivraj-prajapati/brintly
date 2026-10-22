import React from 'react';
import { X, Eye } from 'lucide-react';
import type { CalculatedEmployeeRecord } from '../../calculations/salary-engine';
import { Button } from '../../../components/ui/Button';

export interface ExcludedEmployeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  excludedEmployees: CalculatedEmployeeRecord[];
  sectionTitle?: string;
}

export const ExcludedEmployeesModal: React.FC<ExcludedEmployeesModalProps> = ({
  isOpen,
  onClose,
  excludedEmployees,
  sectionTitle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl border border-surface-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 sm:p-5 border-b border-surface-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Eye className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-surface-900 dark:text-slate-100">
                Excluded Employees ({excludedEmployees.length})
              </h3>
              <p className="text-xs text-surface-500 dark:text-slate-400 mt-0.5">
                Section: &ldquo;{sectionTitle || 'Last Section'}&rdquo; • Excluded from final PDF slips.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-surface-400 dark:text-slate-500 hover:text-surface-700 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          <table className="w-full text-xs text-left">
            <thead className="bg-surface-50 dark:bg-slate-800/80 text-surface-500 dark:text-slate-400 uppercase tracking-wider text-[10px] border-b border-surface-200 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-3">Sr. No.</th>
                <th className="py-2.5 px-3">Employee Name</th>
                <th className="py-2.5 px-3 text-right">Daily Rate</th>
                <th className="py-2.5 px-3 text-right">Days</th>
                <th className="py-2.5 px-3 text-right">Gross</th>
                <th className="py-2.5 px-3 text-right">Net Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-slate-800">
              {excludedEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-surface-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-mono text-surface-600 dark:text-slate-400">#{emp.serialNumber}</td>
                  <td className="py-2.5 px-3 font-semibold text-surface-900 dark:text-slate-100">{emp.name}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-surface-800 dark:text-slate-200">₹{emp.dailyRate}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-surface-800 dark:text-slate-200">{emp.days}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-surface-800 dark:text-slate-200">₹{emp.grossAmount.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800 dark:text-emerald-400">
                    ₹{emp.netAmount.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-surface-200 dark:border-slate-800 bg-surface-50 dark:bg-slate-950 flex items-center justify-between text-xs">
          <span className="text-surface-500 dark:text-slate-400">
            Uncheck &ldquo;Exclude Last Section&rdquo; on the toolbar to include these employees.
          </span>
          <Button variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};
