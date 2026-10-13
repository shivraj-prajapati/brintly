import type { CalculatedEmployeeRecord } from '../../calculations/salary-engine';

export interface A4PageGroup {
  pageNumber: number;
  totalPages: number;
  slips: Array<CalculatedEmployeeRecord | null>; // Exactly 4 slots (null for empty slip)
}

/**
 * Calculates total A4 pages for given employee count (4 employees per page)
 */
export function calculateA4PageCount(employeeCount: number): number {
  if (employeeCount <= 0) return 1;
  return Math.ceil(employeeCount / 4);
}

/**
 * Splits a list of employees into 4-per-page A4 groups, padding partial pages with null slots
 */
export function paginateEmployeesForA4(
  employees: CalculatedEmployeeRecord[]
): A4PageGroup[] {
  const totalEmployees = employees.length;
  const totalPages = calculateA4PageCount(totalEmployees);
  const pages: A4PageGroup[] = [];

  for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
    const startIndex = pageIdx * 4;
    const pageSlips: Array<CalculatedEmployeeRecord | null> = [];

    for (let slot = 0; slot < 4; slot++) {
      const empIndex = startIndex + slot;
      if (empIndex < totalEmployees) {
        pageSlips.push(employees[empIndex]);
      } else {
        pageSlips.push(null); // Blank quadrant to preserve cutting guides
      }
    }

    pages.push({
      pageNumber: pageIdx + 1,
      totalPages,
      slips: pageSlips,
    });
  }

  return pages;
}
