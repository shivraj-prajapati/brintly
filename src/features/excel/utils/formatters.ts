/**
 * Converts a 0-based column index to an Excel column letter (e.g. 0 -> A, 25 -> Z, 26 -> AA)
 */
export function getColumnLetter(colIndex: number): string {
  let temp: number;
  let letter = '';
  let col = colIndex + 1;
  while (col > 0) {
    temp = (col - 1) % 26;
    letter = String.fromCharCode(65 + temp) + letter;
    col = Math.floor((col - temp) / 26);
  }
  return letter;
}

/**
 * Format bytes into human readable format (e.g. 1.2 MB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Detect value type and return a clean formatted representation for financial preview
 */
export function formatFinancialCell(val: unknown): {
  formatted: string;
  type: 'string' | 'number' | 'currency' | 'date' | 'boolean' | 'empty';
} {
  if (val === null || val === undefined || val === '') {
    return { formatted: '—', type: 'empty' };
  }

  if (typeof val === 'boolean') {
    return { formatted: val ? 'TRUE' : 'FALSE', type: 'boolean' };
  }

  if (typeof val === 'number') {
    // Check if looks like integer vs float
    const isCurrencyLike = Math.abs(val) >= 1000 || val.toString().includes('.');
    if (isCurrencyLike) {
      return {
        formatted: new Intl.NumberFormat('en-US', {
          minimumFractionDigits: Number.isInteger(val) ? 0 : 2,
          maximumFractionDigits: 2,
        }).format(val),
        type: 'number',
      };
    }
    return { formatted: val.toLocaleString('en-US'), type: 'number' };
  }

  const str = String(val).trim();

  // If looks like ISO date or date string
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    return { formatted: str, type: 'date' };
  }

  // Currency string $1,234.50
  if (/^\$?\s?-?\$?\d+([,\.]\d+)?/.test(str) && (str.startsWith('$') || str.endsWith(' USD'))) {
    return { formatted: str, type: 'currency' };
  }

  return { formatted: str, type: 'string' };
}
