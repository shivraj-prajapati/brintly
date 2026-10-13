import React from 'react';
import type { CalculatedEmployeeRecord, PdfLanguage } from '../../calculations/salary-engine';
import { paginateEmployeesForA4 } from '../utils/pagination';
import { A4PageSheet } from './A4PageSheet';
import type { PdfTemplateId } from '../types/template.types';

export interface PrintableDocumentProps {
  employees: CalculatedEmployeeRecord[];
  companyTitle?: string;
  sheetName?: string;
  language: PdfLanguage;
  template?: PdfTemplateId;
}

export const PrintableDocument: React.FC<PrintableDocumentProps> = ({
  employees,
  companyTitle,
  sheetName,
  language,
  template = 'corporate',
}) => {
  const pages = paginateEmployeesForA4(employees);

  return (
    <div className="print-only hidden print:block bg-white text-black p-0 m-0">
      {pages.map((p) => (
        <A4PageSheet
          key={`print-page-${p.pageNumber}`}
          slips={p.slips}
          pageNumber={p.pageNumber}
          totalPages={p.totalPages}
          companyTitle={companyTitle}
          sheetName={sheetName}
          language={language}
          template={template}
        />
      ))}
    </div>
  );
};
