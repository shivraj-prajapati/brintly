import { useState, useMemo, useCallback } from 'react';
import type { ParsedWorkbook, SheetData } from '../types/excel.types';
import { ExcelParserService } from '../services/excel-parser';

export function useWorkbook() {
  const [workbook, setWorkbook] = useState<ParsedWorkbook | null>(null);
  const [activeSheetName, setActiveSheetName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const parsed = await ExcelParserService.parseFile(file);
      setWorkbook(parsed);
      setActiveSheetName(parsed.defaultSheet);
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

  const resetWorkbook = useCallback(() => {
    setWorkbook(null);
    setActiveSheetName('');
    setError(null);
  }, []);

  const selectSheet = useCallback((sheetName: string) => {
    setActiveSheetName(sheetName);
  }, []);

  const currentSheet: SheetData | null = useMemo(() => {
    if (!workbook || !activeSheetName) return null;
    return workbook.sheets[activeSheetName] || null;
  }, [workbook, activeSheetName]);

  return {
    workbook,
    activeSheetName,
    currentSheet,
    isLoading,
    error,
    selectSheet,
    handleFileUpload,
    resetWorkbook,
  };
}
