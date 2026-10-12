import { useState, useMemo, useCallback } from 'react';
import type { ParsedWorkbook, SheetData, SheetRow } from '../types/excel.types';
import { ExcelParserService } from '../services/excel-parser';

export function useWorkbook(initialLoadDemo = false) {
  const [workbook, setWorkbook] = useState<ParsedWorkbook | null>(() => {
    return initialLoadDemo ? ExcelParserService.getMockFinancialWorkbook() : null;
  });
  const [activeSheetName, setActiveSheetName] = useState<string>(() => {
    return initialLoadDemo ? 'Income Statement' : '';
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Filtering state
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleFileUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const parsed = await ExcelParserService.parseFile(file);
      setWorkbook(parsed);
      setActiveSheetName(parsed.defaultSheet);
      setPage(1);
      setSearchQuery('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to process Excel workbook.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadDemoWorkbook = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      const demo = ExcelParserService.getMockFinancialWorkbook();
      setWorkbook(demo);
      setActiveSheetName(demo.defaultSheet);
      setPage(1);
      setSearchQuery('');
      setIsLoading(false);
    }, 350);
  }, []);

  const resetWorkbook = useCallback(() => {
    setWorkbook(null);
    setActiveSheetName('');
    setError(null);
    setPage(1);
    setSearchQuery('');
  }, []);

  const selectSheet = useCallback((sheetName: string) => {
    setActiveSheetName(sheetName);
    setPage(1);
    setSearchQuery('');
  }, []);

  const currentSheet: SheetData | null = useMemo(() => {
    if (!workbook || !activeSheetName) return null;
    return workbook.sheets[activeSheetName] || null;
  }, [workbook, activeSheetName]);

  // Filtered rows based on search query
  const filteredRows: SheetRow[] = useMemo(() => {
    if (!currentSheet) return [];
    if (!searchQuery.trim()) return currentSheet.rows;

    const query = searchQuery.toLowerCase().trim();
    return currentSheet.rows.filter((row) =>
      row.cells.some((cell) => cell.formatted.toLowerCase().includes(query))
    );
  }, [currentSheet, searchQuery]);

  // Paginated rows for the preview
  const paginatedRows: SheetRow[] = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredRows.slice(startIndex, startIndex + pageSize);
  }, [filteredRows, page, pageSize]);

  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;

  return {
    workbook,
    activeSheetName,
    currentSheet,
    isLoading,
    error,
    page,
    pageSize,
    searchQuery,
    filteredRows,
    paginatedRows,
    totalPages,
    setPage,
    setPageSize,
    setSearchQuery,
    selectSheet,
    handleFileUpload,
    loadDemoWorkbook,
    resetWorkbook,
  };
}
