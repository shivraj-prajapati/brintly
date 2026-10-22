import { describe, it, expect } from 'vitest';
import {
  calculateEffectiveRate,
  calculateGrossAmount,
  calculateNetAmount,
  applySalaryRounding,
  calculateEmployeeRecord,
  parseNumericValue,
} from '../features/calculations/salary-engine';

describe('Salary Calculation Engine', () => {
  it('calculates Effective Rate correctly (Rate + Increase)', () => {
    expect(calculateEffectiveRate(550, 0)).toBe(550);
    expect(calculateEffectiveRate(550, 50)).toBe(600);
    expect(calculateEffectiveRate(600, 20)).toBe(620);
    expect(calculateEffectiveRate(0, 0)).toBe(0);
  });

  it('calculates Gross Amount from formula (Rate * Days + Rate/12 * Hours)', () => {
    // Example from requirements: Rate = 550, Days = 14, Hours = 6, Increase = 0
    // Gross = 550 * 14 + (550 / 12 * 6) = 7700 + 275 = 7975
    const gross = calculateGrossAmount(550, 14, 6);
    expect(gross).toBe(7975);

    // With increase: Rate = 600, Increase = 20 -> Effective = 620, Days = 25, Hours = 6
    // Gross = 620 * 25 + (620 / 12 * 6) = 15500 + 310 = 15810
    const grossWithInc = calculateGrossAmount(620, 25, 6);
    expect(grossWithInc).toBe(15810);

    // Zero hours
    expect(calculateGrossAmount(500, 20, 0)).toBe(10000);

    // Zero days
    expect(calculateGrossAmount(600, 0, 12)).toBe(600);
  });

  it('calculates Net Amount correctly (Gross - Advance - PF)', () => {
    // Gross = 15810, Advance = 5000, PF = 1000 -> 9810
    expect(calculateNetAmount(15810, 5000, 1000)).toBe(9810);
    // Blank/zero advance & PF
    expect(calculateNetAmount(7975, 0, 0)).toBe(7975);
    // Negative net amount preserved
    expect(calculateNetAmount(5000, 8000, 0)).toBe(-3000);
  });

  it('handles blank/null values gracefully without NaN', () => {
    expect(parseNumericValue('')).toBeNull();
    expect(parseNumericValue(null)).toBeNull();
    expect(parseNumericValue('—')).toBeNull();
    expect(parseNumericValue(' 15,300 ')).toBe(15300);
    expect(parseNumericValue('₹5,000')).toBe(5000);

    const record = calculateEmployeeRecord({
      id: 'emp-1',
      rowIndex: 1,
      serialNumber: 1,
      name: 'Test Worker',
      rate: null,
      days: null,
      hours: null,
      increase: null,
      excelGrossAmount: null,
      advance: null,
      pf: null,
    });

    expect(isFinite(record.grossAmount)).toBe(true);
    expect(isFinite(record.netAmount)).toBe(true);
    expect(record.grossAmount).toBe(0);
    expect(record.netAmount).toBe(0);
    expect(record.warnings.length).toBeGreaterThan(0);
  });

  it('supports Excel Amount calculation mode and flags discrepancies', () => {
    // Rate = 600, Days = 25, Hours = 6, Increase = 20 -> Calculated = 15810
    // But Excel Amount cell was 15300
    const raw = {
      id: 'emp-2',
      rowIndex: 2,
      serialNumber: 2,
      name: 'Ravi Kumar',
      rate: 600,
      days: 25,
      hours: 6,
      increase: 20,
      excelGrossAmount: 15300,
      advance: 5000,
      pf: 0,
    };

    // Mode 1: formula (default)
    const formulaRec = calculateEmployeeRecord(raw, 'formula', 'exact');
    expect(formulaRec.grossAmount).toBe(15810);
    expect(formulaRec.netAmount).toBe(10810);
    expect(formulaRec.hasDiscrepancy).toBe(true);

    // Mode 2: excel_amount
    const excelRec = calculateEmployeeRecord(raw, 'excel_amount', 'exact');
    expect(excelRec.grossAmount).toBe(15300);
    expect(excelRec.netAmount).toBe(10300);
  });
});

describe('Salary Rounding Rules', () => {
  it('Rule 1: Exact Amount keeps calculated net salary as integer without decimals', () => {
    expect(applySalaryRounding(34002, 'exact')).toBe(34002);
    expect(applySalaryRounding(12009, 'exact')).toBe(12009);
    expect(applySalaryRounding(13780, 'exact')).toBe(13780);
    // User requirement: Total Amount must NEVER have decimals
    expect(applySalaryRounding(15420.5, 'exact')).toBe(15421);
    expect(applySalaryRounding(10887.5, 'exact')).toBe(10888);
  });

  it('Rule 2: Nearest Ten (> 5 rounds up, <= 5 rounds down)', () => {
    // User specification: 10, 11, 12, 14, 15 -> 10 (last digit <= 5 rounds down)
    expect(applySalaryRounding(10, 'nearest_ten')).toBe(10);
    expect(applySalaryRounding(11, 'nearest_ten')).toBe(10);
    expect(applySalaryRounding(12, 'nearest_ten')).toBe(10);
    expect(applySalaryRounding(14, 'nearest_ten')).toBe(10);
    expect(applySalaryRounding(15, 'nearest_ten')).toBe(10);

    // User specification: 16, 17, 18, 19 -> 20 (last digit > 5 rounds up)
    expect(applySalaryRounding(16, 'nearest_ten')).toBe(20);
    expect(applySalaryRounding(17, 'nearest_ten')).toBe(20);
    expect(applySalaryRounding(18, 'nearest_ten')).toBe(20);
    expect(applySalaryRounding(19, 'nearest_ten')).toBe(20);

    // Three-digit examples: applies to last unit digit, not hundreds
    expect(applySalaryRounding(123, 'nearest_ten')).toBe(120);
    expect(applySalaryRounding(125, 'nearest_ten')).toBe(120);
    expect(applySalaryRounding(126, 'nearest_ten')).toBe(130);
    expect(applySalaryRounding(129, 'nearest_ten')).toBe(130);

    expect(applySalaryRounding(34002, 'nearest_ten')).toBe(34000);
    expect(applySalaryRounding(34005, 'nearest_ten')).toBe(34000);
    expect(applySalaryRounding(34006, 'nearest_ten')).toBe(34010);
    expect(applySalaryRounding(34009, 'nearest_ten')).toBe(34010);
  });

  it('Rule 3: Round Down / Floor Last Digit (11..19 -> 10, 123 -> 120)', () => {
    // User specification: 10, 11, 12, 14, 15, 16, 17, 18, 19 -> 10
    expect(applySalaryRounding(10, 'round_down')).toBe(10);
    expect(applySalaryRounding(11, 'round_down')).toBe(10);
    expect(applySalaryRounding(12, 'round_down')).toBe(10);
    expect(applySalaryRounding(14, 'round_down')).toBe(10);
    expect(applySalaryRounding(15, 'round_down')).toBe(10);
    expect(applySalaryRounding(16, 'round_down')).toBe(10);
    expect(applySalaryRounding(17, 'round_down')).toBe(10);
    expect(applySalaryRounding(18, 'round_down')).toBe(10);
    expect(applySalaryRounding(19, 'round_down')).toBe(10);

    // Only applies to last unit value, not 100s value: 123 -> 120
    expect(applySalaryRounding(123, 'round_down')).toBe(120);
    expect(applySalaryRounding(125, 'round_down')).toBe(120);
    expect(applySalaryRounding(129, 'round_down')).toBe(120);
    expect(applySalaryRounding(34009, 'round_down')).toBe(34000);
  });

  it('preserves negative net salary under rounding rules', () => {
    expect(applySalaryRounding(-15, 'nearest_ten')).toBe(-10);
    expect(applySalaryRounding(-16, 'nearest_ten')).toBe(-20);
    expect(applySalaryRounding(-123, 'round_down')).toBe(-120);
    expect(applySalaryRounding(-129, 'round_down')).toBe(-120);
  });
});
