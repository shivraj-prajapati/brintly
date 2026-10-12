/**
 * Calculation rules and financial metrics engine placeholder
 */
export interface FinancialCalculationRule {
  id: string;
  name: string;
  formula: string;
  description?: string;
}

export const INITIAL_CALCULATION_RULES: FinancialCalculationRule[] = [
  { id: 'gross_margin', name: 'Gross Margin %', formula: '(Gross Profit / Total Revenue) * 100' },
  { id: 'ebitda', name: 'EBITDA', formula: 'Operating Income + Depreciation + Amortization' },
  { id: 'quick_ratio', name: 'Quick Ratio', formula: '(Cash + Accounts Receivable) / Current Liabilities' },
];
