/**
 * Sheet Parser Web Worker
 *
 * Runs entirely on a background thread so the main UI thread is NEVER blocked
 * during Excel sheet parsing — no matter how large the sheet or how many times
 * the user switches tabs.
 *
 * Message protocol:
 *   IN  → { buffer: ArrayBuffer, sheetName: string }
 *   OUT → { sheetData: SheetData } | { error: string }
 */
import * as XLSX from 'xlsx';
import { ExcelParserService } from '../services/excel-parser';
import type { SheetData } from '../types/excel.types';

export interface WorkerRequest {
  buffer: ArrayBuffer;
  sheetName: string;
}

export interface WorkerResponse {
  sheetData?: SheetData;
  error?: string;
}

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const { buffer, sheetName } = event.data;

  try {
    // Re-read the workbook from the ArrayBuffer (zero allocation on main thread)
    const wb = XLSX.read(buffer, {
      type: 'array',
      cellDates: true,
      cellFormula: true,
    });

    const ws = wb.Sheets[sheetName];
    if (!ws) {
      (self).postMessage({
        error: `Sheet "${sheetName}" not found in workbook.`,
      } satisfies WorkerResponse);
      return;
    }

    const sheetData = ExcelParserService.parseWorksheet(ws, sheetName);

    (self).postMessage({
      sheetData,
    } satisfies WorkerResponse);
  } catch (err: unknown) {
    (self).postMessage({
      error: err instanceof Error ? err.message : `Failed to parse sheet "${sheetName}".`,
    } satisfies WorkerResponse);
  }
};

