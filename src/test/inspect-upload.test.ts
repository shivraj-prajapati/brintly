import { describe, it } from 'vitest';
import * as XLSX from 'xlsx';
import { readFileSync } from 'fs';

describe('Inspect Sky_Metal_Satish_Bhai.xlsx', () => {
  it('prints sheet structure', () => {
    const buf = readFileSync('C:/Users/hp/.gemini/antigravity/brain/5a0b6510-8b46-48ca-b0c8-2d5c78f66452/.user_uploaded/media_1794324352584_b6c8dce4.xlsx');
    const wb = XLSX.read(buf, { type: 'buffer', cellDates: true });
    console.log('\n=== SHEETS:', JSON.stringify(wb.SheetNames));

    for (const sheetName of wb.SheetNames) {
      const ws = wb.Sheets[sheetName];
      const rows: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', blankrows: true });
      console.log(`\n--- Sheet: "${sheetName}" | Total rows: ${rows.length} ---`);
      for (let i = 0; i < Math.min(rows.length, 20); i++) {
        const r = rows[i] as unknown[];
        if (r && r.some(c => c !== '')) {
          console.log(`Row ${i}: ${JSON.stringify(r.slice(0, 15))}`);
        }
      }
    }
  });
});

