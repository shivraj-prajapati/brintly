import type { PdfLanguage } from '../../calculations/salary-engine';

export interface SlipLabels {
  slipTitle: string;
  srNo: string;
  name: string;
  rate: string;
  day: string;
  hour: string;
  increase: string;
  amount: string;
  advance: string;
  pf: string;
  totalAmount: string;
  signature: string;
  signatureHint: string;
  section: string;
  cutGuide: string;
}

export const PDF_LABELS: Record<PdfLanguage, SlipLabels> = {
  en: {
    slipTitle: 'SALARY SLIP',
    srNo: 'Sr. No.',
    name: 'Name',
    rate: 'Rate',
    day: 'Day',
    hour: 'Hour',
    increase: 'Increase',
    amount: 'Amount',
    advance: 'Advance',
    pf: 'PF',
    totalAmount: 'Total Amount',
    signature: 'Signature',
    signatureHint: 'Employee Signature',
    section: 'Section',
    cutGuide: 'CUT HERE',
  },
  hi: {
    slipTitle: 'वेतन पर्ची',
    srNo: 'क्रम संख्या',
    name: 'नाम',
    rate: 'रेट',
    day: 'दिन',
    hour: 'घंटा',
    increase: 'बढ़ाया',
    amount: 'पगार',
    advance: 'उपाढ़',
    pf: 'PF',
    totalAmount: 'कुल पगार',
    signature: 'साइन',
    signatureHint: 'कर्मचारी के हस्ताक्षर',
    section: 'सेक्शन',
    cutGuide: 'यहाँ से काटें',
  },
};

export function getSlipLabels(lang: PdfLanguage): SlipLabels {
  return PDF_LABELS[lang] || PDF_LABELS.en;
}
