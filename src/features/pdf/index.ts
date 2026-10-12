/**
 * PDF generator module interface placeholder ready for real rendering integration
 */
export interface PdfExportOptions {
  theme: 'formal' | 'executive' | 'modern';
  pageSize: 'A4' | 'Letter';
  orientation: 'portrait' | 'landscape';
  includeMetadata: boolean;
  confidentialWatermark: boolean;
}

export const DEFAULT_PDF_OPTIONS: PdfExportOptions = {
  theme: 'executive',
  pageSize: 'A4',
  orientation: 'landscape',
  includeMetadata: true,
  confidentialWatermark: false,
};
