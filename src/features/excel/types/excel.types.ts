import type { CalculatedEmployeeRecord } from '../../calculations/salary-engine';

export type SalaryInternalField =
  | 'serialNumber'
  | 'employeeName'
  | 'dailyRate'
  | 'days'
  | 'hours'
  | 'increase'
  | 'grossAmount'
  | 'advance'
  | 'pf'
  | 'netAmount'
  | 'signature';

export interface FieldDefinition {
  field: SalaryInternalField;
  labelEn: string;
  labelHi: string;
  required: boolean;
  aliases: string[];
}

export type ColumnMapping = Record<SalaryInternalField, number | null>;

export interface SheetSection {
  id: string;
  title: string;
  startRow: number;
  endRow: number;
  employeeCount: number;
}

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
  mappedField?: SalaryInternalField | null;
  typeHint?: 'currency' | 'number' | 'text' | 'date';
}

export interface SheetData {
  name: string;
  companyTitle?: string;
  rowCount: number;
  columnCount: number;
  headers: SheetColumn[];
  rawRows: unknown[][];
  headerRowIndex: number;
  detectedMapping: ColumnMapping;
  sections: SheetSection[];
  employees: CalculatedEmployeeRecord[];
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
  /** Fully parsed sheets (populated lazily, one per selection). */
  sheets: Record<string, SheetData>;
  /** Names of sheets that have been parsed so far. */
  parsedSheetNames: string[];
  defaultSheet: string;
  /**
   * The original file ArrayBuffer. Kept so each sheet can be parsed
   * inside a Web Worker (background thread) without blocking the UI.
   * @internal  Do NOT use this outside of ExcelParserService / useWorkbook.
   */
  _rawBuffer: ArrayBuffer;
}

export type WorkflowStep = 'upload' | 'inspect' | 'preview' | 'export';
