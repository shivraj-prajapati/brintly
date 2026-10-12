import * as XLSX from 'xlsx';
import type { ParsedWorkbook, SheetData, SheetRow, SheetColumn } from '../types/excel.types';
import { getColumnLetter, formatFinancialCell } from '../utils/formatters';

/**
 * Service to parse uploaded Excel files (.xlsx, .xls) into structured preview data
 */
export class ExcelParserService {
  /**
   * Parse a File object into a ParsedWorkbook
   */
  public static async parseFile(file: File): Promise<ParsedWorkbook> {
    const validExtensions = ['.xlsx', '.xls'];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExt) {
      throw new Error('Unsupported file format. Please upload an Excel file (.xlsx or .xls).');
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });

      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error('The uploaded Excel workbook contains no valid sheets.');
      }

      const sheets: Record<string, SheetData> = {};

      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) continue;

        // Convert worksheet to 2D array of raw values
        const rawRows: unknown[][] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: '',
          blankrows: true,
        });

        // Determine column count
        const maxCols = rawRows.reduce((max, row) => Math.max(max, row ? row.length : 0), 0);
        
        // Find first non-empty row as header candidate or default to row 0
        let headerRowIndex = 0;
        for (let i = 0; i < Math.min(rawRows.length, 5); i++) {
          const row = rawRows[i];
          if (row && row.some((cell) => cell !== '' && cell !== null && cell !== undefined)) {
            headerRowIndex = i;
            break;
          }
        }

        const rawHeaderRow = rawRows[headerRowIndex] || [];
        const headers: SheetColumn[] = [];

        for (let c = 0; c < Math.max(maxCols, 1); c++) {
          const rawHeader = rawHeaderRow[c];
          const headerName = rawHeader !== undefined && rawHeader !== null && String(rawHeader).trim() !== ''
            ? String(rawHeader).trim()
            : `Column ${getColumnLetter(c)}`;

          headers.push({
            key: `col_${c}`,
            index: c,
            letter: getColumnLetter(c),
            header: headerName,
          });
        }

        // Format data rows
        const parsedRows: SheetRow[] = [];
        for (let r = 0; r < rawRows.length; r++) {
          const rowData = rawRows[r] || [];
          const cells = headers.map((_, colIndex) => {
            const rawVal = rowData[colIndex] ?? '';
            const { formatted, type } = formatFinancialCell(rawVal);
            return {
              raw: rawVal as string | number | boolean | null,
              formatted,
              type,
            };
          });

          parsedRows.push({
            rowIndex: r + 1,
            cells,
          });
        }

        sheets[sheetName] = {
          name: sheetName,
          rowCount: parsedRows.length,
          columnCount: headers.length,
          headers,
          rows: parsedRows,
        };
      }

      const defaultSheet = workbook.SheetNames[0];

      return {
        meta: {
          fileName: file.name,
          fileSize: file.size,
          sheetNames: workbook.SheetNames,
          lastModified: file.lastModified,
          uploadedAt: new Date(),
        },
        sheets,
        defaultSheet,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error(err.message || 'Failed to process Excel workbook.');
      }
      throw new Error('An unknown error occurred while parsing the Excel file.');
    }
  }

  /**
   * Generates a realistic mock financial model workbook for instant demonstration
   */
  public static getMockFinancialWorkbook(): ParsedWorkbook {
    const incomeStatementHeaders: SheetColumn[] = [
      { key: 'col_0', index: 0, letter: 'A', header: 'Financial Line Item' },
      { key: 'col_1', index: 1, letter: 'B', header: 'Account Code' },
      { key: 'col_2', index: 2, letter: 'C', header: 'Q1 2025 (USD)' },
      { key: 'col_3', index: 3, letter: 'D', header: 'Q2 2025 (USD)' },
      { key: 'col_4', index: 4, letter: 'E', header: 'Q3 2025 (USD)' },
      { key: 'col_5', index: 5, letter: 'F', header: 'Q4 2025 (USD)' },
      { key: 'col_6', index: 6, letter: 'G', header: 'FY 2025 Total' },
      { key: 'col_7', index: 7, letter: 'H', header: 'YoY Growth (%)' },
    ];

    const incomeRowsData = [
      ['Gross Revenue (SaaS Subscriptions)', '4100-REV', '$1,245,000.00', '$1,380,500.00', '$1,520,000.00', '$1,710,200.00', '$5,855,700.00', '+37.4%'],
      ['Enterprise Professional Services', '4200-REV', '$180,000.00', '$195,000.00', '$210,500.00', '$245,000.00', '$830,500.00', '+22.1%'],
      ['Discounts & Allowances', '4900-REV', '($45,200.00)', '($48,100.00)', '($52,000.00)', '($59,400.00)', '($204,700.00)', '+15.2%'],
      ['Net Operating Revenue', '4000-TOT', '$1,379,800.00', '$1,527,400.00', '$1,678,500.00', '$1,895,800.00', '$6,481,500.00', '+35.1%'],
      ['Cost of Goods Sold (Hosting & Cloud)', '5100-COGS', '$195,400.00', '$210,000.00', '$225,800.00', '$248,000.00', '$879,200.00', '+18.5%'],
      ['Customer Support Personnel', '5200-COGS', '$112,000.00', '$118,500.00', '$124,000.00', '$135,200.00', '$489,700.00', '+14.2%'],
      ['Gross Profit Margin', '5000-TOT', '$1,072,400.00', '$1,198,900.00', '$1,328,700.00', '$1,512,600.00', '$5,112,600.00', '+39.4%'],
      ['Research & Development (Engineering)', '6100-OPEX', '$385,000.00', '$405,000.00', '$428,000.00', '$460,000.00', '$1,678,000.00', '+24.6%'],
      ['Sales & Marketing Acquisition', '6200-OPEX', '$290,000.00', '$320,000.00', '$355,000.00', '$390,000.00', '$1,355,000.00', '+31.0%'],
      ['General & Administrative', '6300-OPEX', '$145,000.00', '$150,000.00', '$156,000.00', '$165,000.00', '$616,000.00', '+9.5%'],
      ['Depreciation & Amortization', '6800-DA', '$28,400.00', '$28,400.00', '$29,200.00', '$30,100.00', '$116,100.00', '+4.1%'],
      ['Operating Income (EBIT)', '6900-TOT', '$224,000.00', '$295,500.00', '$360,500.00', '$467,500.00', '$1,347,500.00', '+78.2%'],
      ['Interest & Financing Expense', '7100-FIN', '($12,500.00)', '($11,800.00)', '($10,500.00)', '($9,200.00)', '($44,000.00)', '-18.5%'],
      ['Provision for Corporate Taxes', '8100-TAX', '$44,415.00', '$59,577.00', '$73,500.00', '$96,243.00', '$273,735.00', '+68.4%'],
      ['Net Net Income (GAAP)', '9000-NET', '$167,085.00', '$224,123.00', '$276,500.00', '$362,057.00', '$1,029,765.00', '+84.5%'],
    ];

    const incomeRows: SheetRow[] = incomeRowsData.map((row, idx) => ({
      rowIndex: idx + 1,
      cells: row.map((cell) => {
        const { formatted, type } = formatFinancialCell(cell);
        return {
          raw: cell,
          formatted,
          type,
        };
      }),
    }));

    // Sheet 2: Balance Sheet
    const balanceHeaders: SheetColumn[] = [
      { key: 'col_0', index: 0, letter: 'A', header: 'Balance Sheet Category' },
      { key: 'col_1', index: 1, letter: 'B', header: 'Account No' },
      { key: 'col_2', index: 2, letter: 'C', header: 'As of Dec 31, 2024' },
      { key: 'col_3', index: 3, letter: 'D', header: 'As of Dec 31, 2025' },
      { key: 'col_4', index: 4, letter: 'E', header: 'Variance' },
    ];

    const balanceRowsData = [
      ['Cash and Cash Equivalents', '1010-CASH', '$2,450,000.00', '$3,890,000.00', '+$1,440,000.00'],
      ['Short-term Treasury Yields', '1020-SEC', '$500,000.00', '$750,000.00', '+$250,000.00'],
      ['Accounts Receivable (Net)', '1100-AR', '$380,000.00', '$495,000.00', '+$115,000.00'],
      ['Prepaid Software & Expenses', '1200-PRE', '$65,000.00', '$82,000.00', '+$17,000.00'],
      ['Total Current Assets', '1000-TOT', '$3,395,000.00', '$5,217,000.00', '+$1,822,000.00'],
      ['Property, Plant & Server HW', '1500-PPE', '$340,000.00', '$410,000.00', '+$70,000.00'],
      ['Capitalized Software Assets', '1600-INT', '$820,000.00', '$1,150,000.00', '+$330,000.00'],
      ['Total Assets', '1999-TOT', '$4,555,000.00', '$6,777,000.00', '+$2,222,000.00'],
      ['Accounts Payable', '2010-AP', '$145,000.00', '$180,000.00', '+$35,000.00'],
      ['Deferred Revenue (Annual)', '2100-DEF', '$1,120,000.00', '$1,650,000.00', '+$530,000.00'],
      ['Total Liabilities', '2999-TOT', '$1,485,000.00', '$2,090,000.00', '+$605,000.00'],
      ['Common Stock & Additional Capital', '3010-EQ', '$2,100,000.00', '$2,450,000.00', '+$350,000.00'],
      ['Retained Earnings', '3050-EQ', '$970,000.00', '$2,237,000.00', '+$1,267,000.00'],
      ['Total Liabilities & Stockholder Equity', '3999-TOT', '$4,555,000.00', '$6,777,000.00', '+$2,222,000.00'],
    ];

    const balanceRows: SheetRow[] = balanceRowsData.map((row, idx) => ({
      rowIndex: idx + 1,
      cells: row.map((cell) => {
        const { formatted, type } = formatFinancialCell(cell);
        return {
          raw: cell,
          formatted,
          type,
        };
      }),
    }));

    // Sheet 3: Key Ratios
    const ratioHeaders: SheetColumn[] = [
      { key: 'col_0', index: 0, letter: 'A', header: 'Financial KPI' },
      { key: 'col_1', index: 1, letter: 'B', header: 'Formula' },
      { key: 'col_2', index: 2, letter: 'C', header: 'Industry Benchmark' },
      { key: 'col_3', index: 3, letter: 'D', header: 'Brintly Actual' },
      { key: 'col_4', index: 4, letter: 'E', header: 'Status' },
    ];

    const ratioRowsData = [
      ['Gross Profit Margin', 'Gross Profit / Net Revenue', '> 75.0%', '78.8%', 'Healthy'],
      ['Net Profit Margin', 'Net Income / Net Revenue', '> 12.0%', '15.9%', 'Outperforming'],
      ['Current Ratio', 'Current Assets / Current Liab', '> 1.50x', '2.50x', 'High Liquidity'],
      ['Quick Ratio (Acid Test)', '(Cash + AR) / Current Liab', '> 1.20x', '2.14x', 'Exceptional'],
      ['CAC Payback Period', 'CAC / (ARPU * Gross Margin)', '< 14 mos', '8.2 mos', 'Top Quartile'],
      ['Net Revenue Retention (NRR)', '(Starting MRR + Exp - Churn) / Start', '> 110%', '122.4%', 'Best in Class'],
    ];

    const ratioRows: SheetRow[] = ratioRowsData.map((row, idx) => ({
      rowIndex: idx + 1,
      cells: row.map((cell) => {
        const { formatted, type } = formatFinancialCell(cell);
        return {
          raw: cell,
          formatted,
          type,
        };
      }),
    }));

    return {
      meta: {
        fileName: 'Brintly_Q4_Audited_Financials.xlsx',
        fileSize: 48520,
        sheetNames: ['Income Statement', 'Balance Sheet', 'Financial Ratios & KPIs'],
        lastModified: Date.now() - 3600000 * 2,
        uploadedAt: new Date(),
      },
      sheets: {
        'Income Statement': {
          name: 'Income Statement',
          rowCount: incomeRows.length,
          columnCount: incomeStatementHeaders.length,
          headers: incomeStatementHeaders,
          rows: incomeRows,
        },
        'Balance Sheet': {
          name: 'Balance Sheet',
          rowCount: balanceRows.length,
          columnCount: balanceHeaders.length,
          headers: balanceHeaders,
          rows: balanceRows,
        },
        'Financial Ratios & KPIs': {
          name: 'Financial Ratios & KPIs',
          rowCount: ratioRows.length,
          columnCount: ratioHeaders.length,
          headers: ratioHeaders,
          rows: ratioRows,
        },
      },
      defaultSheet: 'Income Statement',
    };
  }
}
