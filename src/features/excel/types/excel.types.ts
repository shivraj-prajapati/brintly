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
  sheets: Record<string, SheetData>;
  defaultSheet: string;
}

export type WorkflowStep = 'upload' | 'inspect' | 'preview' | 'export';
