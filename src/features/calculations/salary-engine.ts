/**
 * Salary Calculation Engine & Rounding Rules for Brintly
 * 
 * Implements pure, testable business logic for:
 * 1. Effective Rate Calculation (Rate + Increase)
 * 2. Gross Salary Calculation (Effective Rate * Days + (Effective Rate / 12 * Hours))
 * 3. Excel Amount vs Calculated Amount discrepancy detection
 * 4. Net Salary Calculation (Gross - Advance - PF)
 * 5. Three Configurable Rounding Rules:
 *    - Rule 1: Exact Amount (Default)
 *    - Rule 2: Nearest Ten (> 5 Rounds Up, <= 5 Rounds Down: 10..15 -> 10, 16..19 -> 20, 123 -> 120, 125 -> 120)
 *    - Rule 3: Round Down / Floor Last Digit (11..19 -> 10, 123 -> 120)
 */

export type SalaryCalculationMode = 'formula' | 'excel_amount';

export type SalaryRoundingRule = 'exact' | 'nearest_ten' | 'round_down';

export type PdfLanguage = 'en' | 'hi';

export interface RawEmployeeRow {
  id: string;
  rowIndex: number;
  serialNumber: number | string;
  name: string;
  sectionName?: string;
  rate: number | null | string;
  days: number | null | string;
  hours: number | null | string;
  increase: number | null | string;
  excelGrossAmount: number | null | string;
  advance: number | null | string;
  pf: number | null | string;
  signature?: string;
  rawCells?: Record<string, unknown>;
}

export interface CalculatedEmployeeRecord {
  id: string;
  rowIndex: number;
  serialNumber: number | string;
  name: string;
  sectionName: string;
  
  // Cleaned numeric inputs
  dailyRate: number;
  days: number;
  hours: number;
  increase: number;
  effectiveRate: number;
  
  // Financial outputs
  grossAmount: number;
  excelGrossAmount: number | null;
  advance: number;
  pf: number;
  rawNetAmount: number;
  netAmount: number; // rounded according to selected rule
  
  // Discrepancy & Validation
  hasDiscrepancy: boolean;
  discrepancyDiff?: number;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  
  // Selection & Exclusion status
  isSelected: boolean;
  isExcludedByRule: boolean;
  rawCells?: Record<string, unknown>;
}

/**
 * Safely parse a value into a finite number. Returns null if invalid or blank.
 */
export function parseNumericValue(val: unknown): number | null {
  if (val === null || val === undefined) return null;
  if (typeof val === 'number') {
    return isFinite(val) ? val : null;
  }
  const str = String(val).trim();
  if (str === '' || str === '—' || str === '-') return null;
  
  // Strip commas, spaces, currency symbols
  const cleaned = str.replace(/[,\s₹$]/g, '');
  const num = Number(cleaned);
  return isFinite(num) ? num : null;
}

/**
 * Calculate effective daily rate:
 * Effective Rate = Rate + Increase
 * Blank increment is treated as 0.
 */
export function calculateEffectiveRate(rate: number, increase: number = 0): number {
  const safeRate = isFinite(rate) ? rate : 0;
  const safeIncrease = isFinite(increase) ? increase : 0;
  return safeRate + safeIncrease;
}

/**
 * Gross Amount formula:
 * Gross Amount = Effective Rate × Days + (Effective Rate / 12 × Hours)
 */
export function calculateGrossAmount(
  effectiveRate: number,
  days: number,
  hours: number = 0
): number {
  const safeEffectiveRate = isFinite(effectiveRate) ? effectiveRate : 0;
  const safeDays = isFinite(days) ? days : 0;
  const safeHours = isFinite(hours) ? hours : 0;

  const basePay = safeEffectiveRate * safeDays;
  const hourlyPay = (safeEffectiveRate / 12) * safeHours;
  return basePay + hourlyPay;
}

/**
 * Net Salary formula:
 * Net Amount = Gross Amount − Advance − PF
 */
export function calculateNetAmount(
  grossAmount: number,
  advance: number = 0,
  pf: number = 0
): number {
  const safeGross = isFinite(grossAmount) ? grossAmount : 0;
  const safeAdvance = isFinite(advance) ? advance : 0;
  const safePf = isFinite(pf) ? pf : 0;
  return safeGross - safeAdvance - safePf;
}

/**
 * Apply configurable rounding rules to net salary:
 * 
 * Rule 1 (exact): Unchanged exact integer without decimals.
 * Rule 2 (nearest_ten): Threshold at > 5.
 *   - If last digit is greater than 5 (6, 7, 8, 9) -> round up to next 10.
 *   - If last digit is <= 5 (0, 1, 2, 3, 4, 5) -> round down to 10.
 *   - e.g. 10, 11, 12, 14, 15 -> 10; 16, 17, 18, 19 -> 20; 123 -> 120; 125 -> 120; 126 -> 130
 * Rule 3 (round_down): Floor only the last digit to 0 (affects only the units place, never hundreds: 11..19 -> 10, 123 -> 120, 129 -> 120).
 * 
 * Preserves negative values consistently without clamping to 0.
 */
export function applySalaryRounding(amount: number, rule: SalaryRoundingRule): number {
  if (!isFinite(amount)) return 0;

  const isNegative = amount < 0;
  const absVal = Math.abs(amount);
  const intVal = Math.round(absVal);

  if (rule === 'exact') {
    // Total Amount must NEVER have decimals under any rule - strictly clean integer
    return isNegative ? -intVal : intVal;
  }

  if (rule === 'nearest_ten') {
    // Rule 2: If last digit is > 5 then +10, otherwise 0
    // e.g. 10, 11, 12, 14, 15 -> 10; 16, 17, 18, 19 -> 20; 123 -> 120; 125 -> 120; 126 -> 130
    const lastDigit = intVal % 10;
    const baseTen = Math.floor(intVal / 10) * 10;
    const roundedAbs = lastDigit > 5 ? baseTen + 10 : baseTen;
    return isNegative ? -roundedAbs : roundedAbs;
  }

  if (rule === 'round_down' || (rule as string) === 'round_up') {
    // Rule 3: Only the last digit is floored to 0 (11..19 -> 10, 123 -> 120, 129 -> 120)
    const roundedAbs = Math.floor(intVal / 10) * 10;
    return isNegative ? -roundedAbs : roundedAbs;
  }

  return intVal;
}

/**
 * Complete single employee record calculation
 */
export function calculateEmployeeRecord(
  raw: RawEmployeeRow,
  mode: SalaryCalculationMode = 'formula',
  roundingRule: SalaryRoundingRule = 'exact',
  options: { isSelected?: boolean; isExcludedByRule?: boolean } = {}
): CalculatedEmployeeRecord {
  const errors: string[] = [];
  const warnings: string[] = [];

  const rawRate = parseNumericValue(raw.rate);
  const rawDays = parseNumericValue(raw.days);
  const rawHours = parseNumericValue(raw.hours);
  const rawIncrease = parseNumericValue(raw.increase);
  const rawExcelGross = parseNumericValue(raw.excelGrossAmount);
  const rawAdvance = parseNumericValue(raw.advance);
  const rawPf = parseNumericValue(raw.pf);

  const dailyRate = rawRate ?? 0;
  const days = rawDays ?? 0;
  const hours = rawHours ?? 0;
  const increase = rawIncrease ?? 0;
  const advance = rawAdvance ?? 0;
  const pf = rawPf ?? 0;

  if (rawRate === null) {
    warnings.push('Daily rate is missing or 0.');
  }
  if (rawDays === null) {
    warnings.push('Payable days is missing or 0.');
  }

  // Calculate Effective Rate = Rate + Increase
  const effectiveRate = calculateEffectiveRate(dailyRate, increase);

  // Calculated Gross from formula
  const calculatedGross = calculateGrossAmount(effectiveRate, days, hours);

  let effectiveGross = calculatedGross;
  let hasDiscrepancy = false;
  let discrepancyDiff = 0;

  if (rawExcelGross !== null) {
    const diff = Math.abs(calculatedGross - rawExcelGross);
    if (diff > 0.5) {
      hasDiscrepancy = true;
      discrepancyDiff = Math.round((calculatedGross - rawExcelGross) * 100) / 100;
      if (mode === 'formula') {
        warnings.push(`Excel Amount (₹${rawExcelGross.toLocaleString('en-IN')}) differs from Calculated (₹${calculatedGross.toLocaleString('en-IN', { maximumFractionDigits: 1 })}).`);
      }
    }
  }

  if (mode === 'excel_amount' && rawExcelGross !== null) {
    effectiveGross = rawExcelGross;
  } else if (mode === 'excel_amount' && rawExcelGross === null) {
    warnings.push('Excel Amount mode active, but cell was blank; fell back to calculated formula.');
    effectiveGross = calculatedGross;
  }

  // Net amount before rounding
  const rawNetAmount = calculateNetAmount(effectiveGross, advance, pf);

  // Apply selected rounding rule to final net salary
  const netAmount = applySalaryRounding(rawNetAmount, roundingRule);

  const isValid = errors.length === 0;

  return {
    id: raw.id,
    rowIndex: raw.rowIndex,
    serialNumber: raw.serialNumber,
    name: String(raw.name ?? '').trim(),
    sectionName: raw.sectionName || '',
    dailyRate,
    days,
    hours,
    increase,
    effectiveRate,
    grossAmount: Math.round(effectiveGross * 100) / 100,
    excelGrossAmount: rawExcelGross,
    advance,
    pf,
    rawNetAmount: Math.round(rawNetAmount * 100) / 100,
    netAmount,
    hasDiscrepancy,
    discrepancyDiff,
    isValid,
    errors,
    warnings,
    isSelected: options.isSelected ?? true,
    isExcludedByRule: options.isExcludedByRule ?? false,
    rawCells: raw.rawCells,
  };
}

/**
 * Format currency with Indian / standard numbering
 */
export function formatCurrencyINR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || !isFinite(amount)) return '₹0';
  return '₹' + Math.round(amount).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}
