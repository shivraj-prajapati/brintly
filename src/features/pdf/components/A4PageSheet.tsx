import React from 'react';
import type { CalculatedEmployeeRecord, PdfLanguage } from '../../calculations/salary-engine';
import { SalarySlipQuadrant } from './SalarySlipQuadrant';
import type { PdfTemplateId } from '../types/template.types';

export interface A4PageSheetProps {
  slips: Array<CalculatedEmployeeRecord | null>; // Exactly 4 elements
  pageNumber: number;
  totalPages: number;
  companyTitle?: string;
  sheetName?: string;
  language: PdfLanguage;
  template?: PdfTemplateId;
}

export const A4PageSheet: React.FC<A4PageSheetProps> = ({
  slips,
  pageNumber,
  totalPages,
  companyTitle,
  sheetName,
  language,
  template = 'corporate',
}) => {
  // Ensure exactly 4 slots
  const quad0 = slips[0] ?? null;
  const quad1 = slips[1] ?? null;
  const quad2 = slips[2] ?? null;
  const quad3 = slips[3] ?? null;

  return (
    <div
      className="a4-print-sheet pdf-light-isolate relative bg-white text-slate-950 mx-auto shadow-paper print:shadow-none border border-slate-200 print:border-none box-border select-none"
      style={{
        width: '198mm',
        height: '284mm',
        maxWidth: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
        colorScheme: 'light',
      }}
    >
      {/* 2x2 Grid of Slips with balanced margins & padding */}
      <div className="w-full h-full grid grid-cols-2 grid-rows-2 p-3.5 sm:p-4 gap-2.5 sm:gap-3 relative box-border">
        {/* Quadrant 1 (Top Left) */}
        <div className="w-full h-full box-border">
          <SalarySlipQuadrant
            employee={quad0}
            companyTitle={companyTitle}
            sheetName={sheetName}
            language={language}
            template={template}
          />
        </div>

        {/* Quadrant 2 (Top Right) */}
        <div className="w-full h-full box-border">
          <SalarySlipQuadrant
            employee={quad1}
            companyTitle={companyTitle}
            sheetName={sheetName}
            language={language}
            template={template}
          />
        </div>

        {/* Quadrant 3 (Bottom Left) */}
        <div className="w-full h-full box-border">
          <SalarySlipQuadrant
            employee={quad2}
            companyTitle={companyTitle}
            sheetName={sheetName}
            language={language}
            template={template}
          />
        </div>

        {/* Quadrant 4 (Bottom Right) */}
        <div className="w-full h-full box-border">
          <SalarySlipQuadrant
            employee={quad3}
            companyTitle={companyTitle}
            sheetName={sheetName}
            language={language}
            template={template}
          />
        </div>

        {/* =========================================================
            CUTTING GUIDES: Clear Central Horizontal and Vertical Boundaries
            ========================================================= */}
        {/* Vertical Cutting Line (Center) */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0 border-l border-dashed border-slate-400 pointer-events-none z-10 flex flex-col justify-between py-2 text-[10px] text-slate-400 select-none">
          <span className="bg-white px-0.5 -translate-x-1/2">✂</span>
          <span className="bg-white px-0.5 -translate-x-1/2">✂</span>
          <span className="bg-white px-0.5 -translate-x-1/2">✂</span>
        </div>

        {/* Horizontal Cutting Line (Center) */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0 border-t border-dashed border-slate-400 pointer-events-none z-10 flex justify-between px-2 text-[10px] text-slate-400 select-none">
          <span className="bg-white py-0.5 -translate-y-1/2">✂</span>
          <span className="bg-white py-0.5 -translate-y-1/2">✂</span>
          <span className="bg-white py-0.5 -translate-y-1/2">✂</span>
        </div>
      </div>

      {/* Subtle Bottom Page Stamp */}
      <div className="absolute bottom-1 right-3 text-[8px] text-slate-400 tracking-wider pointer-events-none print:hidden">
        PAGE {pageNumber} OF {totalPages}
      </div>
    </div>
  );
};
