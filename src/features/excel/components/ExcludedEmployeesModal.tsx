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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl border border-surface-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 sm:p-5 border-b border-surface-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Eye className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-bold text-surface-900">
                Excluded Employees ({excludedEmployees.length})
              </h3>
              <p className="text-xs text-surface-500 mt-0.5">
                Section: &ldquo;{sectionTitle || 'Last Section'}&rdquo; • Excluded from final PDF slips.
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

        <div className="p-4 overflow-y-auto flex-1">
          <table className="w-full text-xs text-left">
            <thead className="bg-surface-50 text-surface-500 uppercase tracking-wider text-[10px] border-b border-surface-200">
              <tr>
                <th className="py-2.5 px-3">Sr. No.</th>
                <th className="py-2.5 px-3">Employee Name</th>
                <th className="py-2.5 px-3 text-right">Daily Rate</th>
                <th className="py-2.5 px-3 text-right">Days</th>
                <th className="py-2.5 px-3 text-right">Gross</th>
                <th className="py-2.5 px-3 text-right">Net Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {excludedEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-surface-50/50">
                  <td className="py-2.5 px-3 font-mono text-surface-600">#{emp.serialNumber}</td>
                  <td className="py-2.5 px-3 font-semibold text-surface-900">{emp.name}</td>
                  <td className="py-2.5 px-3 text-right font-mono">₹{emp.dailyRate}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{emp.days}</td>
                  <td className="py-2.5 px-3 text-right font-mono">₹{emp.grossAmount.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                    ₹{emp.netAmount.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-surface-200 bg-surface-50 flex items-center justify-between text-xs">
          <span className="text-surface-500">
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
