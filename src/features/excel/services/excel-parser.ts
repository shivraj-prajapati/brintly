import * as XLSX from 'xlsx';
import type {
  ParsedWorkbook,
  SheetData,
  SheetColumn,
  SheetSection,
  ColumnMapping,
} from '../types/excel.types';
import { matchHeaderToField } from '../utils/column-definitions';
import { calculateEmployeeRecord } from '../../calculations/salary-engine';
import { getColumnLetter } from '../utils/formatters';

export class ExcelParserService {
  /**
   * Parse an uploaded File object (.xlsx, .xls) into structured salary workbook
   */
  public static async parseFile(file: File): Promise<ParsedWorkbook> {
    const validExtensions = ['.xlsx', '.xls'];
    const lowerName = file.name.toLowerCase();
    const hasValidExt = validExtensions.some((ext) => lowerName.endsWith(ext));

    if (!hasValidExt) {
      throw new Error('Unsupported file format. Please upload an Excel file (.xlsx or .xls).');
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      return this.parseArrayBuffer(arrayBuffer, file.name, file.size, file.lastModified);
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error(err.message || 'Failed to process Excel workbook.');
      }
      throw new Error('An unknown error occurred while parsing the Excel file.');
    }
  }

  /**
   * Parse array buffer directly (used for both file uploads and testing)
   */
  public static parseArrayBuffer(
    buffer: ArrayBuffer,
    fileName: string = 'salary-sheet.xlsx',
    fileSize: number = 0,
    lastModified?: number
  ): ParsedWorkbook {
    const workbook = XLSX.read(buffer, {
      type: 'array',
      cellDates: true,
      cellFormula: true,
    });

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error('The uploaded Excel workbook contains no valid sheets.');
    }

    const sheets: Record<string, SheetData> = {};

    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) continue;

      const sheetData = this.parseWorksheet(worksheet, sheetName);
      sheets[sheetName] = sheetData;
    }

    return {
      meta: {
        fileName,
        fileSize,
        sheetNames: workbook.SheetNames,
        lastModified,
        uploadedAt: new Date(),
      },
      sheets,
      defaultSheet: workbook.SheetNames[0],
    };
  }

  /**
   * Parse a single worksheet into our salary data model
   */
  public static parseWorksheet(worksheet: XLSX.WorkSheet, sheetName: string): SheetData {
    // Convert worksheet to raw 2D array
    const rawRows: unknown[][] = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: '',
      blankrows: true,
    });

    // 1. Detect Company Title (usually in first row)
    let companyTitle: string | undefined = undefined;
    for (let i = 0; i < Math.min(rawRows.length, 3); i++) {
      const r = rawRows[i];
      if (r && r.length > 0 && typeof r[0] === 'string' && r[0].trim().length > 2) {
        const text = r[0].trim();
        if (!text.toLowerCase().includes('sr no') && !text.includes('नाम')) {
          companyTitle = text;
          break;
        }
      }
    }

    // 2. Score rows to find the main Header Row
    let bestHeaderRowIndex = 0;
    let maxMatchCount = 0;

    for (let r = 0; r < Math.min(rawRows.length, 10); r++) {
      const row = rawRows[r] || [];
      let matchCount = 0;
      for (const cell of row) {
        if (cell !== undefined && cell !== null && String(cell).trim() !== '') {
          if (matchHeaderToField(String(cell))) {
            matchCount++;
          }
        }
      }
      if (matchCount > maxMatchCount) {
        maxMatchCount = matchCount;
        bestHeaderRowIndex = r;
      }
    }

    const rawHeaderRow = rawRows[bestHeaderRowIndex] || [];
    const maxCols = rawRows.reduce((max, row) => Math.max(max, row ? row.length : 0), rawHeaderRow.length);

    // 3. Construct headers and auto-map fields
    const headers: SheetColumn[] = [];
    const detectedMapping: ColumnMapping = {
      serialNumber: null,
      employeeName: null,
      dailyRate: null,
      days: null,
      hours: null,
      increase: null,
      grossAmount: null,
      advance: null,
      pf: null,
      netAmount: null,
      signature: null,
    };

    for (let c = 0; c < Math.max(maxCols, 1); c++) {
      const rawHeader = rawHeaderRow[c];
      const headerText =
        rawHeader !== undefined && rawHeader !== null && String(rawHeader).trim() !== ''
          ? String(rawHeader).trim()
          : `Col ${getColumnLetter(c)}`;

      const mappedField = matchHeaderToField(headerText);
      if (mappedField && detectedMapping[mappedField] === null) {
        detectedMapping[mappedField] = c;
      }

      headers.push({
        key: `col_${c}`,
        index: c,
        letter: getColumnLetter(c),
        header: headerText,
        mappedField,
      });
    }

    // Fallback: If employeeName or dailyRate not mapped, check next columns with common positions
    if (detectedMapping.employeeName === null) {
      // Find first column that has text strings and isn't Sr No
      for (let c = 0; c < headers.length; c++) {
        if (c !== detectedMapping.serialNumber) {
          detectedMapping.employeeName = c;
          break;
        }
      }
    }

    // Check if an initial section title exists immediately preceding the header row
    let initialSectionName = '';
    for (let r = 1; r < bestHeaderRowIndex; r++) {
      const row = rawRows[r] || [];
      const nonEmpty = row.filter((c) => c !== '' && c !== null && c !== undefined);
      if (nonEmpty.length === 1 && typeof row[0] === 'string' && isNaN(Number(row[0]))) {
        initialSectionName = row[0].trim();
      }
    }

    // 4. Identify Sections & Employee Rows
    const sections: SheetSection[] = [];
    const rawEmployeeRows: Array<{
      rowIdx: number;
      section: string;
      cells: unknown[];
    }> = [];

    let currentSectionName = initialSectionName;
    let currentSectionStart = bestHeaderRowIndex + 1;
    let currentSectionCount = 0;

    for (let r = bestHeaderRowIndex + 1; r < rawRows.length; r++) {
      const row = rawRows[r] || [];
      if (!row || row.length === 0 || row.every((c) => c === '' || c === null || c === undefined)) {
        continue;
      }

      const firstCell = row[0] !== undefined ? String(row[0]).trim() : '';
      const secondCell = row[1] !== undefined ? String(row[1]).trim() : '';

      // Check for repeat header row (e.g. after a section title)
      const isRepeatHeader = row.some((c) => c && matchHeaderToField(String(c)));
      if (isRepeatHeader) {
        continue;
      }

      // Check for section title row (e.g. [ 'भट्टी का कारीगर ' ] where only col 0 has text or col 1+ are empty)
      const nonEmptyCells = row.filter((c) => c !== '' && c !== null && c !== undefined);
      if (
        nonEmptyCells.length === 1 &&
        typeof row[0] === 'string' &&
        isNaN(Number(row[0])) &&
        !row[0].toLowerCase().includes('total') &&
        !row[0].includes('कुल')
      ) {
        // Close previous section if it had employees
        if (currentSectionName && currentSectionCount > 0) {
          sections.push({
            id: `sec-${sections.length + 1}`,
            title: currentSectionName,
            startRow: currentSectionStart,
            endRow: r - 1,
            employeeCount: currentSectionCount,
          });
        }
        currentSectionName = row[0].trim();
        currentSectionStart = r + 1;
        currentSectionCount = 0;
        continue;
      }

      // Check for summary/TOTAL row
      const isTotalRow =
        firstCell.toLowerCase().includes('total') ||
        secondCell.toLowerCase().includes('total') ||
        firstCell.includes('कुल') ||
        secondCell.includes('कुल');

      if (isTotalRow) {
        continue;
      }

      // Extract employee name candidate
      const nameCol = detectedMapping.employeeName ?? 1;
      const rawName = row[nameCol];
      const nameStr = rawName !== undefined && rawName !== null ? String(rawName).trim() : '';

      // If name is completely blank or is a number without text, skip
      if (!nameStr || nameStr === '—' || nameStr.toLowerCase() === 'total') {
        continue;
      }

      currentSectionCount++;
      rawEmployeeRows.push({
        rowIdx: r + 1,
        section: currentSectionName,
        cells: row,
      });
    }

    // Close the final section
    if (currentSectionName && currentSectionCount > 0) {
      sections.push({
        id: `sec-${sections.length + 1}`,
        title: currentSectionName,
        startRow: currentSectionStart,
        endRow: rawRows.length,
        employeeCount: currentSectionCount,
      });
    }

    // If no distinct section titles were found, treat whole sheet as one section
    if (sections.length === 0 && rawEmployeeRows.length > 0) {
      sections.push({
        id: 'sec-all',
        title: sheetName,
        startRow: bestHeaderRowIndex + 1,
        endRow: rawRows.length,
        employeeCount: rawEmployeeRows.length,
      });
    }

    // Determine the last section for the mandatory exclusion rule
    const lastSection = sections.length > 1 ? sections[sections.length - 1] : null;

    // 5. Convert raw employee rows into CalculatedEmployeeRecord list
    const employees = rawEmployeeRows.map((item, idx) => {
      const row = item.cells;
      const getVal = (colIdx: number | null) => (colIdx !== null && row[colIdx] !== undefined ? row[colIdx] : null);

      const serialVal = getVal(detectedMapping.serialNumber);
      const nameVal = getVal(detectedMapping.employeeName);
      const rateVal = getVal(detectedMapping.dailyRate);
      const daysVal = getVal(detectedMapping.days);
      const hoursVal = getVal(detectedMapping.hours);
      const increaseVal = getVal(detectedMapping.increase);
      const grossVal = getVal(detectedMapping.grossAmount);
      const advanceVal = getVal(detectedMapping.advance);
      const pfVal = getVal(detectedMapping.pf);

      // Check if this employee belongs to the last section
      const isFromLastSection = lastSection ? item.section === lastSection.title : false;

      return calculateEmployeeRecord(
        {
          id: `emp-${sheetName}-${idx + 1}`,
          rowIndex: item.rowIdx,
          serialNumber: serialVal !== null && String(serialVal).trim() !== '' ? serialVal as number | string : idx + 1,
          name: String(nameVal ?? '').trim(),
          sectionName: item.section || '',
          rate: rateVal as number | string | null,
          days: daysVal as number | string | null,
          hours: hoursVal as number | string | null,
          increase: increaseVal as number | string | null,
          excelGrossAmount: grossVal as number | string | null,
          advance: advanceVal as number | string | null,
          pf: pfVal as number | string | null,
        },
        'formula',
        'exact',
        {
          isSelected: true,
          isExcludedByRule: isFromLastSection, // Default: exclude last section if multiple sections exist
        }
      );
    });

    return {
      name: sheetName,
      companyTitle,
      rowCount: rawRows.length,
      columnCount: headers.length,
      headers,
      rawRows,
      headerRowIndex: bestHeaderRowIndex,
      detectedMapping,
      sections,
      employees,
    };
  }
}
