import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { ExcelParserService } from '../features/excel/services/excel-parser';
import { getColumnLetter } from '../features/excel/utils/formatters';
import { matchHeaderToField } from '../features/excel/utils/column-definitions';

describe('Excel Utilities & Parser Service with Real Workbook', () => {
  it('converts column indexes to correct Excel letters', () => {
    expect(getColumnLetter(0)).toBe('A');
    expect(getColumnLetter(25)).toBe('Z');
    expect(getColumnLetter(26)).toBe('AA');
    expect(getColumnLetter(27)).toBe('AB');
  });

  it('matches Hindi and English headers accurately', () => {
    expect(matchHeaderToField('Sr No.')).toBe('serialNumber');
    expect(matchHeaderToField('Name')).toBe('employeeName');
    expect(matchHeaderToField('नाम ')).toBe('employeeName');
    expect(matchHeaderToField('रेट ')).toBe('dailyRate');
    expect(matchHeaderToField('दिन ')).toBe('days');
    expect(matchHeaderToField('घंटा ')).toBe('hours');
    expect(matchHeaderToField('बढ़ाया ')).toBe('increase');
    expect(matchHeaderToField('पगार ')).toBe('grossAmount');
    expect(matchHeaderToField('उपाढ़ ')).toBe('advance');
    expect(matchHeaderToField('PF')).toBe('pf');
    expect(matchHeaderToField('कुल पगार ')).toBe('netAmount');
    expect(matchHeaderToField('साइन ')).toBe('signature');
  });

  it('correctly parses real sample file JAY.xlsx', () => {
    const filePath = path.resolve(__dirname, '../../JAY.xlsx');
    if (!fs.existsSync(filePath)) {
      console.warn('JAY.xlsx not found at path, skipping direct file parse');
      return;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const parsed = ExcelParserService.parseArrayBuffer(fileBuffer.buffer, 'JAY.xlsx', fileBuffer.length);

    expect(parsed.meta.sheetNames).toContain('APRIL');
    expect(parsed.meta.sheetNames).toContain('NOV');
    expect(parsed.meta.sheetNames).toContain('JAN');

    // Test APRIL sheet (which has 4 distinct sections and Hindi headers)
    const april = parsed.sheets['APRIL'];
    expect(april).toBeDefined();
    expect(april.companyTitle).toBe('JAY-INTERNATIONAL');
    expect(april.headers.some((h) => h.mappedField === 'employeeName')).toBe(true);
    expect(april.headers.some((h) => h.mappedField === 'dailyRate')).toBe(true);
    expect(april.headers.some((h) => h.mappedField === 'grossAmount')).toBe(true);

    // Verify sections detection in APRIL
    expect(april.sections.length).toBe(4);
    expect(april.sections[0].title).toContain('भट्टी का कारीगर');
    expect(april.sections[1].title).toContain('प्रेस का कारीगर');
    expect(april.sections[2].title).toContain('प्रोसेस का कारीगर');
    expect(april.sections[3].title).toContain('परोसे की कारीगर');

    // Total employees in APRIL = 53 (9 + 12 + 20 in first 3 sections + 12 in last section)
    expect(april.employees.length).toBe(53);

    // Verify last section exclusion rule defaults
    const excludedEmployees = april.employees.filter((e) => e.isExcludedByRule);
    const includedEmployees = april.employees.filter((e) => !e.isExcludedByRule);
    expect(excludedEmployees.length).toBe(12);
    expect(includedEmployees.length).toBe(41);

    // Verify original Hindi employee name is preserved exactly
    expect(april.employees[0].name).toContain('कंचन ठाकुर');
    expect(april.employees[0].dailyRate).toBe(826);
    expect(april.employees[0].days).toBe(17);

    // Verify NOV sheet (English headers, 71 employees, 1 section)
    const nov = parsed.sheets['NOV'];
    expect(nov).toBeDefined();
    expect(nov.employees.length).toBe(71);
    expect(nov.employees[0].name).toBe('Pradeep Nanda');
    expect(nov.employees[0].dailyRate).toBe(570);
    expect(nov.employees[0].days).toBe(23);
  });
});
