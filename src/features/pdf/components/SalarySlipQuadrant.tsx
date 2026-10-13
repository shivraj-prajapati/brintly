import React from 'react';
import type { CalculatedEmployeeRecord, PdfLanguage } from '../../calculations/salary-engine';
import type { PdfTemplateId } from '../types/template.types';
import {
  CorporateCleanTemplate,
  ClassicGridTemplate,
  ModernEmeraldTemplate,
  IndustrialCompactTemplate,
  ExecutiveFormalTemplate,
} from '../templates';

export interface SalarySlipQuadrantProps {
  employee: CalculatedEmployeeRecord | null;
  companyTitle?: string;
  sheetName?: string;
  language: PdfLanguage;
  template?: PdfTemplateId;
}

/**
 * Renders an individual salary slip quadrant on an A4 sheet.
 * Delegates rendering directly to dedicated modular template components.
 */
export const SalarySlipQuadrant: React.FC<SalarySlipQuadrantProps> = ({
  employee,
  companyTitle = 'GLOBAL ENTERPRISES',
  sheetName = '',
  language = 'en',
  template = 'corporate',
}) => {
  const commonProps = {
    employee,
    companyTitle,
    sheetName,
    language,
  };

  switch (template) {
    case 'classic':
      return <ClassicGridTemplate {...commonProps} />;
    case 'modern':
      return <ModernEmeraldTemplate {...commonProps} />;
    case 'industrial':
      return <IndustrialCompactTemplate {...commonProps} />;
    case 'formal':
      return <ExecutiveFormalTemplate {...commonProps} />;
    case 'corporate':
    default:
      return <CorporateCleanTemplate {...commonProps} />;
  }
};
