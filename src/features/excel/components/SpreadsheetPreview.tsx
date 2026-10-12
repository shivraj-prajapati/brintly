import React from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  FileSpreadsheet,
  RotateCcw,
  SlidersHorizontal,
  Info,
} from 'lucide-react';
import type { ParsedWorkbook, SheetData, SheetRow } from '../types/excel.types';
import { formatFileSize } from '../utils/formatters';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { SheetSelector } from './SheetSelector';

export interface SpreadsheetPreviewProps {
  workbook: ParsedWorkbook;
  activeSheetName: string;
  currentSheet: SheetData | null;
  paginatedRows: SheetRow[];
  totalFilteredRows: number;
  page: number;
  pageSize: number;
  totalPages: number;
  searchQuery: string;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
  onSearchChange: (query: string) => void;
  onSelectSheet: (sheetName: string) => void;
  onReset: () => void;
  onProceedToMapping: () => void;
}

export const SpreadsheetPreview: React.FC<SpreadsheetPreviewProps> = ({
  workbook,
  activeSheetName,
  currentSheet,
  paginatedRows,
  totalFilteredRows,
  page,
  pageSize,
  totalPages,
  searchQuery,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  onSelectSheet,
  onReset,
  onProceedToMapping,
}) => {
  if (!currentSheet) {
    return (
      <div className="bg-white rounded-xl border border-surface-200 p-12 text-center text-surface-500">
        <Info className="w-8 h-8 text-surface-400 mx-auto mb-3" />
        <p className="text-sm font-medium">No sheet selected</p>
      </div>
    );
  }

  const startRow = totalFilteredRows === 0 ? 0 : (page - 1) * pageSize + 1;
  const endRow = Math.min(page * pageSize, totalFilteredRows);

  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden flex flex-col">
      {/* Workbook Metadata Bar */}
      <div className="p-4 sm:p-5 border-b border-surface-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-semibold text-surface-900 tracking-tight truncate max-w-xs sm:max-w-md">
                {workbook.meta.fileName}
              </h2>
              <Badge variant="green" size="sm">
                Ready to map
              </Badge>
            </div>
            <div className="flex items-center space-x-3 text-xs text-surface-500 mt-0.5">
              <span>{formatFileSize(workbook.meta.fileSize)}</span>
              <span>•</span>
              <span>{workbook.meta.sheetNames.length} worksheets</span>
              <span>•</span>
              <span>
                {currentSheet.rowCount} rows × {currentSheet.columnCount} columns in{' '}
                <strong className="text-surface-700 font-medium">{activeSheetName}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5 text-surface-500" />}
          >
            Change File
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onProceedToMapping}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Continue to Field Mapping
          </Button>
        </div>
      </div>

      {/* Sheet Tabs */}
      <SheetSelector
        workbook={workbook}
        activeSheetName={activeSheetName}
        onSelectSheet={onSelectSheet}
      />

      {/* Spreadsheet Search and Quick Filter Toolbar */}
      <div className="px-4 py-3 border-b border-surface-200 bg-surface-50/40 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-surface-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={`Filter ${activeSheetName}...`}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-surface-200 rounded-lg text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-surface-400 hover:text-surface-600"
            >
              ×
            </button>
          )}
        </div>

        {/* View Options & Rows per page */}
        <div className="flex items-center justify-between w-full sm:w-auto space-x-3 text-xs text-surface-600">
          {searchQuery && (
            <span className="text-emerald-700 font-medium">
              {totalFilteredRows} match{totalFilteredRows === 1 ? '' : 'es'} found
            </span>
          )}

          <div className="flex items-center space-x-2">
            <span className="text-surface-500">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              aria-label="Rows per page"
              className="bg-white border border-surface-200 rounded-md px-2 py-1 text-xs text-surface-800 focus:outline-none focus:border-emerald-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scrollable Spreadsheet Grid */}
      <div className="overflow-x-auto relative min-h-[320px] max-h-[520px] border-b border-surface-200">
        {paginatedRows.length === 0 ? (
          <div className="py-16 text-center text-surface-500">
            <p className="text-sm font-medium">No matching data found in this sheet.</p>
            <p className="text-xs text-surface-400 mt-1">Try clearing your search query or selecting another sheet.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              {/* Row 1: Excel Column Letters (A, B, C...) */}
              <tr className="bg-surface-100/90 text-surface-500 font-mono text-[11px] select-none border-b border-surface-200">
                <th className="w-12 px-2.5 py-1.5 text-center font-normal border-r border-surface-200 bg-surface-100 sticky left-0 z-20">
                  #
                </th>
                {currentSheet.headers.map((col) => (
                  <th
                    key={col.key}
                    className="px-3.5 py-1.5 font-medium text-center border-r border-surface-200/80 last:border-r-0 min-w-[140px]"
                  >
                    {col.letter}
                  </th>
                ))}
              </tr>

              {/* Row 2: Detected Column Header Labels */}
              <tr className="bg-surface-50 text-surface-800 font-semibold border-b border-surface-200">
                <th className="w-12 px-2.5 py-2 text-center text-surface-400 border-r border-surface-200 bg-surface-50 sticky left-0 z-20">
                  <SlidersHorizontal className="w-3 h-3 mx-auto text-surface-400" />
                </th>
                {currentSheet.headers.map((col) => (
                  <th
                    key={`label_${col.key}`}
                    className="px-3.5 py-2.5 border-r border-surface-200/80 last:border-r-0 whitespace-nowrap min-w-[140px]"
                  >
                    <div className="flex items-center justify-between space-x-2">
                      <span className="truncate">{col.header}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-surface-100 bg-white">
              {paginatedRows.map((row) => (
                <tr
                  key={`row_${row.rowIndex}`}
                  className="hover:bg-emerald-50/30 transition-colors group"
                >
                  {/* Row Number */}
                  <td className="w-12 px-2.5 py-2 text-center font-mono text-[11px] text-surface-400 bg-surface-50/50 group-hover:bg-emerald-50/50 border-r border-surface-200 sticky left-0 z-10 select-none">
                    {row.rowIndex}
                  </td>

                  {/* Row Cells */}
                  {row.cells.map((cell, cIdx) => {
                    const isCurrencyOrNumber = cell.type === 'number' || cell.type === 'currency';
                    return (
                      <td
                        key={`cell_${row.rowIndex}_${cIdx}`}
                        className={`px-3.5 py-2 text-surface-800 border-r border-surface-100 last:border-r-0 whitespace-nowrap ${
                          isCurrencyOrNumber ? 'text-right font-mono text-[11.5px]' : ''
                        }`}
                      >
                        <span
                          className={`${
                            cell.type === 'empty'
                              ? 'text-surface-300'
                              : cell.formatted.startsWith('(') || cell.formatted.startsWith('-')
                              ? 'text-red-600 font-mono'
                              : 'text-surface-800'
                          }`}
                        >
                          {cell.formatted}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Table Pagination & Footer Controls */}
      <div className="p-3.5 sm:p-4 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-surface-600">
        <div className="flex items-center space-x-2">
          <span>
            Showing <strong className="font-semibold text-surface-900">{startRow}</strong> to{' '}
            <strong className="font-semibold text-surface-900">{endRow}</strong> of{' '}
            <strong className="font-semibold text-surface-900">{totalFilteredRows}</strong> rows
          </span>
        </div>

        {/* Page Navigators */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
          >
            Previous
          </Button>

          <span className="px-2 text-xs text-surface-600">
            Page <strong className="text-surface-900">{page}</strong> of{' '}
            <strong className="text-surface-900">{totalPages}</strong>
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
