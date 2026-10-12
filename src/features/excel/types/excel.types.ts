export interface CellValue {
  raw: string | number | boolean | null;
  formatted: string;
  type: 'string' | 'number' | 'currency' | 'date' | 'boolean' | 'empty';
}

export interface SheetRow {
  rowIndex: number;
  cells: CellValue[];
}

export interface SheetColumn {
  key: string;
  index: number;
  letter: string;
  header: string;
  typeHint?: 'currency' | 'number' | 'text' | 'date';
}

export interface SheetData {
  name: string;
  rowCount: number;
  columnCount: number;
  headers: SheetColumn[];
  rows: SheetRow[];
}

export interface WorkbookMeta {
  fileName: string;
  fileSize: number;
  sheetNames: string[];
  lastModified?: number;
  uploadedAt: Date;
}

export interface ParsedWorkbook {
  meta: WorkbookMeta;
  sheets: Record<string, SheetData>;
  defaultSheet: string;
}

export type WorkflowStep = 'upload' | 'mapping' | 'calculation' | 'export';

export interface PaginationConfig {
  page: number;
  pageSize: number;
  totalRows: number;
  totalPages: number;
}
