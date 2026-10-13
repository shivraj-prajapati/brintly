import { describe, it, expect } from 'vitest';
import { calculateA4PageCount, paginateEmployeesForA4 } from '../features/pdf/utils/pagination';
import type { CalculatedEmployeeRecord } from '../features/calculations/salary-engine';

function createMockEmployee(id: number, section = 'Main'): CalculatedEmployeeRecord {
  return {
    id: `emp-${id}`,
    rowIndex: id + 1,
    serialNumber: id,
    name: `Worker ${id}`,
    sectionName: section,
    dailyRate: 500,
    days: 20,
    hours: 0,
    increase: 0,
    effectiveRate: 500,
    grossAmount: 10000,
    excelGrossAmount: 10000,
    advance: 1000,
    pf: 500,
    rawNetAmount: 8500,
    netAmount: 8500,
    hasDiscrepancy: false,
    isValid: true,
    errors: [],
    warnings: [],
    isSelected: true,
    isExcludedByRule: false,
  };
}

describe('A4 Pagination Rules (4 Slips Per Page)', () => {
  it('computes exact page counts for all required thresholds (1, 4, 5, 8, 10, 63)', () => {
    // Requirements: 1 -> 1, 4 -> 1, 5 -> 2, 8 -> 2, 10 -> 3, 63 -> 16
    expect(calculateA4PageCount(1)).toBe(1);
    expect(calculateA4PageCount(4)).toBe(1);
    expect(calculateA4PageCount(5)).toBe(2);
    expect(calculateA4PageCount(8)).toBe(2);
    expect(calculateA4PageCount(10)).toBe(3);
    expect(calculateA4PageCount(63)).toBe(16);
  });

  it('guarantees exactly 4 slip slots per page and pads partial pages with null', () => {
    const list5 = Array.from({ length: 5 }, (_, i) => createMockEmployee(i + 1));
    const pages = paginateEmployeesForA4(list5);

    expect(pages.length).toBe(2);
    // Page 1 has 4 employees
    expect(pages[0].slips.length).toBe(4);
    expect(pages[0].slips.filter((s) => s !== null).length).toBe(4);

    // Page 2 has 1 employee + 3 empty slots for cutting alignment
    expect(pages[1].slips.length).toBe(4);
    expect(pages[1].slips[0]?.name).toBe('Worker 5');
    expect(pages[1].slips[1]).toBeNull();
    expect(pages[1].slips[2]).toBeNull();
    expect(pages[1].slips[3]).toBeNull();
  });

  it('handles 10 employees across 3 pages with 2 blank slots on page 3', () => {
    const list10 = Array.from({ length: 10 }, (_, i) => createMockEmployee(i + 1));
    const pages = paginateEmployeesForA4(list10);

    expect(pages.length).toBe(3);
    expect(pages[2].slips[0]?.name).toBe('Worker 9');
    expect(pages[2].slips[1]?.name).toBe('Worker 10');
    expect(pages[2].slips[2]).toBeNull();
    expect(pages[2].slips[3]).toBeNull();
  });

  it('preserves employee sequence order without reordering', () => {
    const list4 = Array.from({ length: 4 }, (_, i) => createMockEmployee(i + 1));
    const pages = paginateEmployeesForA4(list4);

    expect(pages[0].slips[0]?.serialNumber).toBe(1);
    expect(pages[0].slips[1]?.serialNumber).toBe(2);
    expect(pages[0].slips[2]?.serialNumber).toBe(3);
    expect(pages[0].slips[3]?.serialNumber).toBe(4);
  });
});
