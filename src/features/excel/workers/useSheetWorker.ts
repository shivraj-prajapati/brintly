/**
 * useSheetWorker — React hook that manages a Web Worker for off-thread sheet parsing.
 *
 * WHY A WEB WORKER?
 *   ExcelParserService.parseWorksheet() is synchronous CPU work (100-200ms per sheet
 *   with 100+ employees). Running it on the main thread blocks the browser, causing
 *   "Page Unresponsive" after repeated sheet switches.
 *
 *   This hook moves every on-demand parse onto a background Worker thread.
 *   The main thread only does setWorkbook() / setActiveSheetName() — microseconds.
 */
import { useCallback, useRef } from 'react';
import type { ParsedWorkbook, SheetData } from '../types/excel.types';

export interface SheetWorkerResult {
  updatedWorkbook: ParsedWorkbook;
  sheetName: string;
}

export interface UseSheetWorkerReturn {
  /**
   * Parse a sheet in the background Worker. Returns a Promise that resolves
   * with the updated workbook once the Worker finishes.
   * If the sheet is already parsed, resolves immediately with no Worker spawn.
   */
  parseSheetInWorker: (
    workbook: ParsedWorkbook,
    sheetName: string
  ) => Promise<SheetWorkerResult>;
  /** Cancel any in-progress Worker parse (e.g. user clicked a different sheet). */
  cancelCurrentParse: () => void;
}

export function useSheetWorker(): UseSheetWorkerReturn {
  // Keep a ref to the current Worker so we can terminate it if the user
  // switches sheets again before parsing finishes.
  const activeWorkerRef = useRef<Worker | null>(null);

  const cancelCurrentParse = useCallback(() => {
    if (activeWorkerRef.current) {
      activeWorkerRef.current.terminate();
      activeWorkerRef.current = null;
    }
  }, []);

  const parseSheetInWorker = useCallback(
    (workbook: ParsedWorkbook, sheetName: string): Promise<SheetWorkerResult> => {
      // Already parsed — resolve instantly, no Worker needed
      if (workbook.parsedSheetNames.includes(sheetName)) {
        return Promise.resolve({ updatedWorkbook: workbook, sheetName });
      }

      // Cancel any previous in-progress parse
      cancelCurrentParse();

      return new Promise<SheetWorkerResult>((resolve, reject) => {
        // Vite-compatible ES Module Worker — bundled separately at build time
        const worker = new Worker(
          new URL('./sheet-parser.worker.ts', import.meta.url),
          { type: 'module' }
        );
        activeWorkerRef.current = worker;

        worker.onmessage = (
          event: MessageEvent<{ sheetData?: SheetData; error?: string }>
        ) => {
          activeWorkerRef.current = null;
          worker.terminate();

          const { sheetData, error } = event.data;
          if (error || !sheetData) {
            reject(new Error(error || `Failed to parse sheet "${sheetName}".`));
            return;
          }

          // Immutably merge the new sheet into the workbook
          const updatedWorkbook: ParsedWorkbook = {
            ...workbook,
            sheets: { ...workbook.sheets, [sheetName]: sheetData },
            parsedSheetNames: [...workbook.parsedSheetNames, sheetName],
          };

          resolve({ updatedWorkbook, sheetName });
        };

        worker.onerror = (err: ErrorEvent) => {
          activeWorkerRef.current = null;
          worker.terminate();
          reject(new Error(err.message || `Worker error while parsing "${sheetName}".`));
        };

        // We COPY the buffer (slice) so the main thread keeps its reference.
        // Transferring (without slice) would detach it and break future sheet loads.
        const bufferCopy = workbook._rawBuffer.slice(0);
        worker.postMessage({ buffer: bufferCopy, sheetName }, [bufferCopy]);
      });
    },
    [cancelCurrentParse]
  );

  return { parseSheetInWorker, cancelCurrentParse };
}

