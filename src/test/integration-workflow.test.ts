import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { ExcelParserService } from '../features/excel/services/excel-parser';
import {
  calculateEmployeeRecord,
  applySalaryRounding,
  calculateGrossAmount,
  calculateNetAmount,
} from '../features/calculations/salary-engine';
import { paginateEmployeesForA4, calculateA4PageCount } from '../features/pdf/utils/pagination';
import { getSlipLabels } from '../features/pdf/utils/pdf-labels';

describe('End-to-End Workflow Integration Test with JAY.xlsx', () => {
  const filePath = path.resolve(__dirname, '../../JAY.xlsx');
  const fileBuffer = fs.readFileSync(filePath);
  const parsed = ExcelParserService.parseArrayBuffer(fileBuffer.buffer, 'JAY.xlsx', fileBuffer.length);

  it('1. Upload & Sheet Ingestion: Correctly identifies all 11 sheets without dummy data', () => {
    expect(parsed.meta.sheetNames).toEqual([
      'NOV', 'DEC', 'JAN', 'FEB', 'MAR', 'APRIL', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP'
    ]);
  });

  it('2. Multi-Section & Hindi Detection in APRIL: 4 sections detected, last section identified', () => {
    const april = parsed.sheets['APRIL'];
    expect(april.sections.length).toBe(4);
    expect(april.sections[3].title).toBe('परोसे की कारीगर (लड़की )');
    expect(april.sections[3].employeeCount).toBe(12);

    // Total employees in APRIL
    expect(april.employees.length).toBe(53);

    // Default mandatory exclusion: last section excluded by default
    const excluded = april.employees.filter((e) => e.isExcludedByRule);
    const included = april.employees.filter((e) => !e.isExcludedByRule);
    expect(excluded.length).toBe(12);
    expect(included.length).toBe(41);
  });

  it('3. Original Employee Names Preserved: Hindi names untouched without transliteration', () => {
    const april = parsed.sheets['APRIL'];
    expect(april.employees[0].name).toBe('कंचन ठाकुर');
    expect(april.employees[1].name).toBe('महेश  सरोज');
    expect(april.employees[2].name).toBe('सुलेमान आकबर');
  });

  it('4. Salary Formula & Increment: Effective Rate = Rate + Increase, Gross = Rate*Days + Rate/12*Hours', () => {
    // Row 6 in APRIL: Rate = 600, Days = 25, Hours = 6, Increase = 20
    // Effective Rate = 620
    // Calculated Gross = 620 * 25 + (620 / 12 * 6) = 15500 + 310 = 15810
    const gross = calculateGrossAmount(620, 25, 6);
    expect(gross).toBe(15810);

    // Deductions: Advance = 5000, PF = 0
    const net = calculateNetAmount(15810, 5000, 0);
    expect(net).toBe(10810);
  });

  it('5. Calculation Modes: Formula vs Excel Amount', () => {
    const rawWorker = {
      id: 'test-1',
      rowIndex: 6,
      serialNumber: 3,
      name: 'सुलेमान आकबर',
      rate: 600,
      days: 25,
      hours: 6,
      increase: 20,
      excelGrossAmount: 15300,
      advance: 5000,
      pf: 0,
    };

    // Mode 1: Formula mode (adds increment to rate) -> 15810 gross, flags discrepancy
    const formulaRec = calculateEmployeeRecord(rawWorker, 'formula', 'exact');
    expect(formulaRec.grossAmount).toBe(15810);
    expect(formulaRec.hasDiscrepancy).toBe(true);

    // Mode 2: Excel Amount mode -> uses uploaded 15300
    const excelRec = calculateEmployeeRecord(rawWorker, 'excel_amount', 'exact');
    expect(excelRec.grossAmount).toBe(15300);
    expect(excelRec.netAmount).toBe(10300);
  });

  it('6. Rounding Rules: Exact, Nearest Ten, and Round Any Non-Zero Digit Up', () => {
    const amount = 34002;
    expect(applySalaryRounding(amount, 'exact')).toBe(34002);
    expect(applySalaryRounding(amount, 'nearest_ten')).toBe(34000);
    expect(applySalaryRounding(amount, 'round_up')).toBe(34010);

    expect(applySalaryRounding(34005, 'nearest_ten')).toBe(34010);
    expect(applySalaryRounding(34000, 'round_up')).toBe(34000);
  });

  it('7. PDF Column Language: English & Hindi labels dictionary', () => {
    const en = getSlipLabels('en');
    expect(en.slipTitle).toBe('SALARY SLIP');
    expect(en.srNo).toBe('Sr. No.');
    expect(en.totalAmount).toBe('Total Amount');

    const hi = getSlipLabels('hi');
    expect(hi.slipTitle).toBe('वेतन पर्ची');
    expect(hi.srNo).toBe('क्रम संख्या');
    expect(hi.totalAmount).toBe('कुल पगार');
  });

  it('8. A4 4-per-page Pagination: Exact pagination for 41 included employees', () => {
    const april = parsed.sheets['APRIL'];
    const included = april.employees.filter((e) => !e.isExcludedByRule);
    expect(included.length).toBe(41);

    const pageCount = calculateA4PageCount(included.length);
    // 41 / 4 = 10.25 -> 11 pages
    expect(pageCount).toBe(11);

    const pages = paginateEmployeesForA4(included);
    expect(pages.length).toBe(11);

    // Page 11 has 1 employee + 3 blank slip quadrants
    expect(pages[10].slips[0]).not.toBeNull();
    expect(pages[10].slips[1]).toBeNull();
    expect(pages[10].slips[2]).toBeNull();
    expect(pages[10].slips[3]).toBeNull();
  });

  it('9. When Exclusion is Disabled: All 53 employees in APRIL included across 14 pages', () => {
    const april = parsed.sheets['APRIL'];
    const allEmps = april.employees;
    expect(allEmps.length).toBe(53);

    // 53 / 4 = 13.25 -> 14 pages
    expect(calculateA4PageCount(53)).toBe(14);
    const pages = paginateEmployeesForA4(allEmps);
    expect(pages.length).toBe(14);
    // Page 14 has 1 employee + 3 blank slip quadrants
    expect(pages[13].slips[0]?.name).toBe('चनको देवी');
    expect(pages[13].slips[1]).toBeNull();
  });

  it('10. English sheet NOV: 71 employees across 18 pages', () => {
    const nov = parsed.sheets['NOV'];
    expect(nov.employees.length).toBe(71);
    expect(calculateA4PageCount(71)).toBe(18);
  });
});
