import { describe, it, expect } from 'vitest';
import { ExcelParserService } from '../features/excel/services/excel-parser';
import { getColumnLetter, formatFinancialCell } from '../features/excel/utils/formatters';

describe('Excel Utilities & Parser Service', () => {
  it('should convert column indexes to correct Excel letters', () => {
    expect(getColumnLetter(0)).toBe('A');
    expect(getColumnLetter(25)).toBe('Z');
    expect(getColumnLetter(26)).toBe('AA');
    expect(getColumnLetter(27)).toBe('AB');
  });

  it('should format financial numbers and currencies correctly', () => {
    expect(formatFinancialCell(1245000).formatted).toBe('1,245,000');
    expect(formatFinancialCell(null).formatted).toBe('—');
    expect(formatFinancialCell(true).formatted).toBe('TRUE');
  });

  it('should generate a valid demo financial workbook', () => {
    const demo = ExcelParserService.getMockFinancialWorkbook();
    expect(demo.meta.sheetNames.length).toBeGreaterThan(0);
    expect(demo.sheets['Income Statement']).toBeDefined();
    expect(demo.sheets['Income Statement'].rows.length).toBeGreaterThan(0);
  });
});
