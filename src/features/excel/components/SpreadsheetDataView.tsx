import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckSquare,
  Square,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RotateCcw,
} from 'lucide-react';
import type { CalculatedEmployeeRecord, SalaryCalculationMode, PdfLanguage } from '../../calculations/salary-engine';

export type SortField =
  | 'default'
  | 'net_desc'
  | 'net_asc'
  | 'rate_desc'
  | 'rate_asc'
  | 'days_desc'
  | 'days_asc'
  | 'name_asc';

export interface SpreadsheetDataViewProps {
  employees: CalculatedEmployeeRecord[];
  calculationMode: SalaryCalculationMode;
  pdfLanguage: PdfLanguage;
  onToggleSelectEmployee: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onUpdateEmployeeField: (id: string, field: string, value: number) => void;
}

export const SpreadsheetDataView: React.FC<SpreadsheetDataViewProps> = ({
  employees,
  calculationMode,
  pdfLanguage,
  onToggleSelectEmployee,
  onSelectAll,
  onDeselectAll,
  onUpdateEmployeeField,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortField>('default');

  const isFilterActive = searchQuery !== '' || sortBy !== 'default';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSortBy('default');
  };

  // Filter & Sort employees
  const processedEmployees = useMemo(() => {
    // 1. Filter
    const filtered = employees.filter((emp) => {
      const matchesQuery =
        searchQuery.trim() === '' ||
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(emp.serialNumber).includes(searchQuery) ||
        emp.sectionName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesQuery;
    });

    // 2. Sort / Order
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'net_desc':
          return b.netAmount - a.netAmount;
        case 'net_asc':
          return a.netAmount - b.netAmount;
        case 'rate_desc':
          return b.dailyRate - a.dailyRate;
        case 'rate_asc':
          return a.dailyRate - b.dailyRate;
        case 'days_desc':
          return b.days - a.days;
        case 'days_asc':
          return a.days - b.days;
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'default':
        default:
          return a.rowIndex - b.rowIndex;
      }
    });
  }, [employees, searchQuery, sortBy]);

  const selectedCount = employees.filter((e) => e.isSelected && !e.isExcludedByRule).length;
  const allSelected = selectedCount === employees.filter((e) => !e.isExcludedByRule).length;

  const handleHeaderSort = (field: 'net' | 'rate' | 'days' | 'name') => {
    if (field === 'net') {
      setSortBy((prev) => (prev === 'net_desc' ? 'net_asc' : 'net_desc'));
    } else if (field === 'rate') {
      setSortBy((prev) => (prev === 'rate_desc' ? 'rate_asc' : 'rate_desc'));
    } else if (field === 'days') {
      setSortBy((prev) => (prev === 'days_desc' ? 'days_asc' : 'days_desc'));
    } else if (field === 'name') {
      setSortBy((prev) => (prev === 'name_asc' ? 'default' : 'name_asc'));
    }
  };

  // Dynamic Header Labels reflecting current Language Selection
  const isHi = pdfLanguage === 'hi';
  const tableHeaders = {
    srNo: isHi ? 'क्रम संख्या' : 'Sr No',
    name: isHi ? 'नाम' : 'Employee Name',
    rate: isHi ? 'रेट (₹)' : 'Rate (₹)',
    days: isHi ? 'दिन' : 'Days',
    hours: isHi ? 'घंटा' : 'Hours',
    increase: isHi ? 'बढ़ाया (₹)' : 'Incr. (₹)',
    gross: isHi ? 'पगार (₹)' : 'Gross (₹)',
    advance: isHi ? 'उपाढ़ (₹)' : 'Advance (₹)',
    pf: isHi ? 'PF (₹)' : 'PF (₹)',
    totalAmount: isHi ? 'कुल पगार (₹)' : 'Total Amount (₹)',
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-surface-200 dark:border-slate-800 shadow-subtle overflow-hidden flex flex-col transition-colors">
      {/* Search, Order & Filter Bar with Reset Option */}
      <div className="p-3.5 sm:p-4 border-b border-surface-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-900 transition-colors">
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:flex-none min-w-[160px] sm:min-w-[220px]">
            <Search className="w-4 h-4 text-surface-400 dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder={isHi ? 'नाम या क्रम संख्या से खोजें...' : 'Search employee by name...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-1.5 rounded-lg bg-surface-50 dark:bg-slate-800/80 border border-surface-200 dark:border-slate-700 text-surface-900 dark:text-slate-100 placeholder:text-surface-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
            />
          </div>

          {/* ORDER / SORT FILTER (Greater / Non-Greater values) */}
          <div className="flex items-center space-x-1 bg-surface-50 dark:bg-slate-800/80 border border-surface-200 dark:border-slate-700 rounded-lg p-0.5 text-xs flex-1 sm:flex-none">
            <span className="px-2 text-surface-500 dark:text-slate-400 flex items-center space-x-1 font-medium text-[11px] whitespace-nowrap">
              <ArrowUpDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{isHi ? 'क्रम:' : 'Order:'}</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortField)}
              className="bg-white dark:bg-slate-900 text-surface-800 dark:text-slate-200 text-xs font-semibold py-1 px-2 rounded border border-surface-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer w-full sm:w-auto"
            >
              <option value="default">{isHi ? 'मूल क्रम (Original)' : 'Original Order'}</option>
              <option value="net_desc">{isHi ? 'ज्यादा पगार पहले (Highest ↓)' : 'Highest Salary First (Greater ↓)'}</option>
              <option value="net_asc">{isHi ? 'कम पगार पहले (Lowest ↑)' : 'Lowest Salary First (Lesser ↑)'}</option>
              <option value="rate_desc">{isHi ? 'ज्यादा रेट (Rate ↓)' : 'Highest Rate First'}</option>
              <option value="rate_asc">{isHi ? 'कम रेट (Rate ↑)' : 'Lowest Rate First'}</option>
              <option value="days_desc">{isHi ? 'ज्यादा दिन (Days ↓)' : 'Most Days Worked'}</option>
              <option value="name_asc">{isHi ? 'नाम अनुसार (A-Z)' : 'Employee Name (A-Z)'}</option>
            </select>
          </div>

          {/* Quick Select All / None */}
          <button
            type="button"
            onClick={allSelected ? onDeselectAll : onSelectAll}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-surface-200 dark:border-slate-700 text-surface-700 dark:text-slate-300 hover:bg-surface-50 dark:hover:bg-slate-800 font-medium text-xs transition-colors whitespace-nowrap"
          >
            {allSelected ? (
              <>
                <CheckSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{isHi ? 'सभी हटाएं' : 'Deselect All'}</span>
              </>
            ) : (
              <>
                <Square className="w-3.5 h-3.5 text-surface-400 dark:text-slate-500" />
                <span>{isHi ? 'सभी चुनें' : 'Select All'}</span>
              </>
            )}
          </button>

          {/* RESET FILTER BUTTON */}
          {isFilterActive && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-surface-100 dark:bg-slate-800 hover:bg-surface-200 dark:hover:bg-slate-700 text-surface-700 dark:text-slate-300 text-xs font-semibold transition-colors whitespace-nowrap"
              title="Reset all search and sorting filters"
            >
              <RotateCcw className="w-3.5 h-3.5 text-surface-500 dark:text-slate-400" />
              <span>{isHi ? 'फ़िल्टर रीसेट' : 'Reset Filters'}</span>
            </button>
          )}
        </div>

        {/* Counter */}
        <div className="flex items-center space-x-2 text-xs text-surface-500 dark:text-slate-400 self-end md:self-auto">
          <span>
            <strong className="text-surface-900 dark:text-slate-100">{processedEmployees.length}</strong> {isHi ? 'रिकॉर्ड' : 'records'}
          </span>
          <span>•</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
            {selectedCount} {isHi ? 'PDF हेतु' : 'queued'}
          </span>
        </div>
      </div>

      {/* Mobile Swipe Hint */}
      <div className="sm:hidden px-3.5 py-1.5 bg-surface-50 dark:bg-slate-800/60 text-[10px] text-surface-500 dark:text-slate-400 border-b border-surface-200 dark:border-slate-800 flex items-center justify-between">
        <span>← Swipe horizontally to see all columns →</span>
      </div>

      {/* Spreadsheet Table: Direct Language Representation on Column Headers */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-surface-50 dark:bg-slate-800/80 text-surface-600 dark:text-slate-300 border-b border-surface-200 dark:border-slate-700 text-[11px] font-semibold tracking-wider uppercase select-none">
              <th className="py-2.5 px-3 w-10 text-center">
                <span className="sr-only">Select</span>
              </th>
              <th className="py-2.5 px-2 w-16 text-center">{tableHeaders.srNo}</th>
              <th
                className="py-2.5 px-4 min-w-[180px] cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-400"
                onClick={() => handleHeaderSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>{tableHeaders.name}</span>
                  {sortBy === 'name_asc' && <ArrowUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
                </div>
              </th>
              <th
                className="py-2.5 px-3 text-right w-24 cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-400"
                onClick={() => handleHeaderSort('rate')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>{tableHeaders.rate}</span>
                  {sortBy === 'rate_desc' && <ArrowDown className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
                  {sortBy === 'rate_asc' && <ArrowUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
                </div>
              </th>
              <th
                className="py-2.5 px-3 text-right w-20 cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-400"
                onClick={() => handleHeaderSort('days')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>{tableHeaders.days}</span>
                  {sortBy === 'days_desc' && <ArrowDown className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
                  {sortBy === 'days_asc' && <ArrowUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
                </div>
              </th>
              <th className="py-2.5 px-3 text-right w-20">{tableHeaders.hours}</th>
              <th className="py-2.5 px-3 text-right w-24">{tableHeaders.increase}</th>
              <th className="py-2.5 px-3 text-right w-28">{tableHeaders.gross}</th>
              <th className="py-2.5 px-3 text-right w-24">{tableHeaders.advance}</th>
              <th className="py-2.5 px-3 text-right w-20">{tableHeaders.pf}</th>
              <th
                className="py-2.5 px-4 text-right w-36 cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-400 bg-surface-100/70 dark:bg-slate-800"
                onClick={() => handleHeaderSort('net')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>{tableHeaders.totalAmount}</span>
                  {sortBy === 'net_desc' && <ArrowDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                  {sortBy === 'net_asc' && <ArrowUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 dark:divide-slate-800 text-surface-800 dark:text-slate-200">
            {processedEmployees.map((emp) => {
              const isExcluded = emp.isExcludedByRule;
              const isSelected = emp.isSelected && !isExcluded;

              // Strictly Integer - zero decimals
              const netInt = Math.round(emp.netAmount);
              const grossInt = Math.round(emp.grossAmount);

              return (
                <tr
                  key={emp.id}
                  className={`transition-colors ${
                    isExcluded
                      ? 'bg-surface-50/70 dark:bg-slate-950/40 opacity-60'
                      : isSelected
                      ? 'hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20'
                      : 'bg-white dark:bg-slate-900 opacity-70 hover:opacity-100'
                  }`}
                >
                  {/* Selection Checkbox */}
                  <td className="py-2.5 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isExcluded}
                      onChange={() => onToggleSelectEmployee(emp.id)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer disabled:cursor-not-allowed"
                      title={isExcluded ? 'Excluded by Last Section rule' : 'Include in PDF'}
                    />
                  </td>

                  {/* Serial Number */}
                  <td className="py-2.5 px-2 text-center font-mono font-medium text-surface-500 dark:text-slate-400">
                    #{emp.serialNumber}
                  </td>

                  {/* Employee Name */}
                  <td className="py-2.5 px-4 font-medium text-surface-900 dark:text-slate-100">
                    <div className="flex flex-col">
                      <span className="font-semibold text-surface-900 dark:text-slate-100 truncate max-w-[200px]">
                        {emp.name}
                      </span>
                      {emp.sectionName && (
                        <span className="text-[10px] text-surface-400 dark:text-slate-500 truncate max-w-[200px]">
                          {emp.sectionName}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Editable Daily Rate */}
                  <td className="py-2 px-2.5 text-right font-mono">
                    <input
                      type="number"
                      value={emp.dailyRate}
                      onChange={(e) => onUpdateEmployeeField(emp.id, 'dailyRate', Number(e.target.value))}
                      className="w-20 text-right text-xs font-mono bg-surface-50/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-surface-900 dark:text-slate-100 border border-surface-200/60 dark:border-slate-750 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/20 rounded px-1.5 py-1 outline-none transition-all"
                    />
                  </td>

                  {/* Editable Days */}
                  <td className="py-2 px-2.5 text-right font-mono">
                    <input
                      type="number"
                      value={emp.days}
                      onChange={(e) => onUpdateEmployeeField(emp.id, 'days', Number(e.target.value))}
                      className="w-16 text-right text-xs font-mono bg-surface-50/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-surface-900 dark:text-slate-100 border border-surface-200/60 dark:border-slate-750 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/20 rounded px-1.5 py-1 outline-none transition-all"
                    />
                  </td>

                  {/* Editable Hours */}
                  <td className="py-2 px-2.5 text-right font-mono">
                    <input
                      type="number"
                      value={emp.hours}
                      onChange={(e) => onUpdateEmployeeField(emp.id, 'hours', Number(e.target.value))}
                      className="w-16 text-right text-xs font-mono bg-surface-50/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-surface-900 dark:text-slate-100 border border-surface-200/60 dark:border-slate-750 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/20 rounded px-1.5 py-1 outline-none transition-all"
                    />
                  </td>

                  {/* Editable Increase */}
                  <td className="py-2 px-2.5 text-right font-mono">
                    <input
                      type="number"
                      value={emp.increase}
                      onChange={(e) => onUpdateEmployeeField(emp.id, 'increase', Number(e.target.value))}
                      className="w-16 text-right text-xs font-mono bg-surface-50/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 border border-surface-200/60 dark:border-slate-750 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/20 rounded px-1.5 py-1 outline-none text-emerald-700 dark:text-emerald-400 font-medium transition-all"
                    />
                  </td>

                  {/* Gross (Zero Decimals) */}
                  <td className="py-2.5 px-3 text-right font-mono font-medium text-surface-900 dark:text-slate-100">
                    <div className="flex flex-col items-end">
                      <span>₹{grossInt.toLocaleString('en-IN')}</span>
                      {emp.hasDiscrepancy && calculationMode === 'formula' && (
                        <span
                          className="text-[9px] text-amber-600 dark:text-amber-400 font-semibold"
                          title={`Excel Amount was ₹${emp.excelGrossAmount ? Math.round(emp.excelGrossAmount).toLocaleString('en-IN') : ''}`}
                        >
                          Excel: ₹{emp.excelGrossAmount ? Math.round(emp.excelGrossAmount).toLocaleString('en-IN') : ''}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Editable Advance */}
                  <td className="py-2 px-2.5 text-right font-mono">
                    <input
                      type="number"
                      value={emp.advance}
                      onChange={(e) => onUpdateEmployeeField(emp.id, 'advance', Number(e.target.value))}
                      className="w-20 text-right text-xs font-mono bg-surface-50/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 border border-surface-200/60 dark:border-slate-750 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/20 rounded px-1.5 py-1 outline-none text-red-600 dark:text-red-400 font-medium transition-all"
                    />
                  </td>

                  {/* Editable PF */}
                  <td className="py-2 px-2.5 text-right font-mono">
                    <input
                      type="number"
                      value={emp.pf}
                      onChange={(e) => onUpdateEmployeeField(emp.id, 'pf', Number(e.target.value))}
                      className="w-16 text-right text-xs font-mono bg-surface-50/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 border border-surface-200/60 dark:border-slate-750 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/20 rounded px-1.5 py-1 outline-none text-surface-700 dark:text-slate-300 font-medium transition-all"
                    />
                  </td>

                  {/* Final Net Amount (Strictly Integer, Zero Decimals) */}
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-emerald-300 text-[13px] bg-emerald-50/40 dark:bg-emerald-950/30 border-l border-surface-100 dark:border-slate-800">
                    ₹{netInt.toLocaleString('en-IN')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
