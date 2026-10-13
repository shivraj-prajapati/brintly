export type PdfTemplateId = 'corporate' | 'classic' | 'modern' | 'industrial' | 'formal';

export interface PdfTemplateInfo {
  id: PdfTemplateId;
  name: string;
  nameHi: string;
  badge: string;
  description: string;
}

export const PDF_TEMPLATES: PdfTemplateInfo[] = [
  {
    id: 'corporate',
    name: 'Corporate Minimal',
    nameHi: 'कॉरपोरेट मिनिमल',
    badge: 'Card List',
    description: 'Clean single-row itemized list with solid total bar, minimal and centered',
  },
  {
    id: 'classic',
    name: 'Excel Worksheet Grid',
    nameHi: 'एक्सेल ग्रिड',
    badge: 'Excel Grid',
    description: 'Real spreadsheet table with complete black & white cell borders and double underline',
  },
  {
    id: 'modern',
    name: 'Columnar Matrix',
    nameHi: 'कॉलम मैट्रिक्स',
    badge: 'Columns',
    description: 'All column headers aligned together with values directly underneath in clean blocks',
  },
  {
    id: 'industrial',
    name: 'Traditional Pay Voucher',
    nameHi: 'वेतन पर्ची',
    badge: 'Parchi',
    description: 'Traditional payslip parchi format with ruled guidelines and receipt stamp',
  },
  {
    id: 'formal',
    name: 'Monospace Minimalist',
    nameHi: 'मोनोस्पेस मिनिमल',
    badge: 'Clean B&W',
    description: 'Pure black & white hairline layout with crisp accounting typography',
  },
];
