import type { FieldDefinition, SalaryInternalField } from '../types/excel.types';

export const SALARY_FIELD_DEFINITIONS: FieldDefinition[] = [
  {
    field: 'serialNumber',
    labelEn: 'Sr. No.',
    labelHi: 'क्रम संख्या',
    required: false,
    aliases: [
      'sr no',
      'sr no.',
      'sr. no.',
      'sr.no.',
      'serial no',
      'serial no.',
      'sl no',
      's.no',
      's no',
      'क्रम संख्या',
      'क्र. सं.',
      'क्र सं',
      'क्र.सं.',
      'क्र०सं०',
    ],
  },
  {
    field: 'employeeName',
    labelEn: 'Name',
    labelHi: 'नाम',
    required: true,
    aliases: [
      'name',
      'employee name',
      'worker name',
      'emp name',
      'full name',
      'नाम',
      'कर्मचारी नाम',
      'कारीगर का नाम',
    ],
  },
  {
    field: 'dailyRate',
    labelEn: 'Rate',
    labelHi: 'रेट',
    required: true,
    aliases: [
      'rate',
      'daily rate',
      'day rate',
      'wage',
      'daily wage',
      'रेट',
      'दर',
      'दैनिक रेट',
    ],
  },
  {
    field: 'days',
    labelEn: 'Day',
    labelHi: 'दिन',
    required: true,
    aliases: [
      'day',
      'days',
      'working days',
      'work days',
      'present days',
      'दिन',
      'कुल दिन',
    ],
  },
  {
    field: 'hours',
    labelEn: 'Hour',
    labelHi: 'घंटा',
    required: false,
    aliases: [
      'hour',
      'hours',
      'ot',
      'overtime',
      'extra hours',
      'ot hour',
      'घंटा',
      'घण्टा',
      'ओटी',
    ],
  },
  {
    field: 'increase',
    labelEn: 'Increase',
    labelHi: 'बढ़ाया',
    required: false,
    aliases: [
      'increase',
      'increment',
      'rate increase',
      'incr',
      'raise',
      'बढ़ाया',
      'बढाया',
      'बढ़ोतरी',
      'वृद्धि',
    ],
  },
  {
    field: 'grossAmount',
    labelEn: 'Amount',
    labelHi: 'पगार',
    required: false,
    aliases: [
      'amount',
      'salary',
      'pagar',
      'gross',
      'gross amount',
      'gross salary',
      'पगार',
      'राशि',
      'सकल वेतन',
    ],
  },
  {
    field: 'advance',
    labelEn: 'Advance',
    labelHi: 'उपाढ़',
    required: false,
    aliases: [
      'upadh',
      'advance',
      'adv',
      'upadh/advance',
      'उपाढ़',
      'उपाढ़',
      'उपाढ',
      'उपाड़',
      'अग्रिम',
    ],
  },
  {
    field: 'pf',
    labelEn: 'PF',
    labelHi: 'PF',
    required: false,
    aliases: [
      'pf',
      'p.f.',
      'p.f',
      'provident fund',
      'पीएफ',
      'पी.एफ.',
      'भविष्य निधि',
    ],
  },
  {
    field: 'netAmount',
    labelEn: 'Total Amount',
    labelHi: 'कुल पगार',
    required: false,
    aliases: [
      'total amount',
      'net amount',
      'net salary',
      'take home',
      'final amount',
      'net pagar',
      'total',
      'कुल पगार',
      'शुद्ध पगार',
      'कुल राशि',
    ],
  },
  {
    field: 'signature',
    labelEn: 'Signature',
    labelHi: 'साइन',
    required: false,
    aliases: [
      'signature',
      'sign',
      'emp sign',
      'साइन',
      'हस्ताक्षर',
      'दस्तखत',
    ],
  },
];

/**
 * Normalizes text for header alias comparison:
 * Lowercases, strips punctuation, normalizes Devanagari nukta characters, trims.
 */
export function normalizeHeaderText(text: unknown): string {
  if (text === null || text === undefined) return '';
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/[._\-–—()]/g, ' ')
    // Normalize nukta in Devanagari (e.g. ढ़ U+095C vs ढ+़ U+0922+U+093C)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Match a header string to one of our internal salary fields
 */
export function matchHeaderToField(headerName: string): SalaryInternalField | null {
  const normalized = normalizeHeaderText(headerName);
  if (!normalized) return null;

  for (const def of SALARY_FIELD_DEFINITIONS) {
    for (const alias of def.aliases) {
      const normalizedAlias = normalizeHeaderText(alias);
      if (
        normalized === normalizedAlias ||
        normalized === normalizedAlias + 's' ||
        normalized.replace(/\s/g, '') === normalizedAlias.replace(/\s/g, '')
      ) {
        return def.field;
      }
    }
  }

  return null;
}
