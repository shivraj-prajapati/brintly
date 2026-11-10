import { useState, useMemo, useCallback } from 'react';
import type { ParsedWorkbook, SheetData } from '../types/excel.types';
import { ExcelParserService } from '../services/excel-parser';
import { useSheetWorker } from '../workers/useSheetWorker';

export function useWorkbook() {
  const [workbook, setWorkbook] = useState<ParsedWorkbook | null>(null);
  const [activeSheetName, setActiveSheetName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSheetLoading, setIsSheetLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { parseSheetInWorker, cancelCurrentParse } = useSheetWorker();

  /**
   * Upload handler — parses ONLY the first sheet immediately so the UI stays
   * responsive even for large multi-sheet workbooks.
   */
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
    cancelCurrentParse();
    setWorkbook(null);
    setActiveSheetName('');
    setError(null);
  }, [cancelCurrentParse]);

  /**
   * Sheet selector — uses a Web Worker to parse sheets on a background thread.
   * The main thread never blocks, so the UI stays responsive no matter how
   * many times the user switches sheets.
   */
  const selectSheet = useCallback(async (sheetName: string) => {
    if (!workbook) return;

    // Already parsed — switch instantly
    if (workbook.parsedSheetNames.includes(sheetName)) {
      setActiveSheetName(sheetName);
      return;
    }

    // Cancel any in-progress parse (user clicked a different sheet)
    cancelCurrentParse();

    setIsSheetLoading(true);
    setError(null);

    try {
      const { updatedWorkbook } = await parseSheetInWorker(workbook, sheetName);
      setWorkbook(updatedWorkbook);
      setActiveSheetName(sheetName);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(`Failed to load sheet "${sheetName}".`);
      }
    } finally {
      setIsSheetLoading(false);
    }
  }, [workbook, parseSheetInWorker, cancelCurrentParse]);

  const currentSheet: SheetData | null = useMemo(() => {
    if (!workbook || !activeSheetName) return null;
    return workbook.sheets[activeSheetName] || null;
  }, [workbook, activeSheetName]);

  return {
    workbook,
    activeSheetName,
    currentSheet,
    isLoading,
    isSheetLoading,
    error,
    selectSheet,
    handleFileUpload,
    resetWorkbook,
  };
}
