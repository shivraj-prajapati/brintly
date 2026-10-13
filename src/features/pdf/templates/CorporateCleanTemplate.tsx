import React from 'react';
import type { CalculatedEmployeeRecord, PdfLanguage } from '../../calculations/salary-engine';
import { getSlipLabels } from '../utils/pdf-labels';

export interface TemplateProps {
  employee: CalculatedEmployeeRecord | null;
  companyTitle?: string;
  sheetName?: string;
  language: PdfLanguage;
}

/**
 * Template 1: Corporate Minimal
 * Clean single-row itemized list, centered from top, solid total bar,
 * optimized for crisp Black & White printing.
 */
export const CorporateCleanTemplate: React.FC<TemplateProps> = ({
  employee,
  companyTitle = 'GLOBAL ENTERPRISES',
  sheetName = '',
  language = 'en',
}) => {
  const labels = getSlipLabels(language);

  if (!employee) {
    return (
      <div className="w-full h-full p-4 flex items-center justify-center border border-dashed border-slate-400 bg-slate-50/40 text-slate-500 text-xs select-none rounded-lg">
        <span className="tracking-widest uppercase text-[10px] font-semibold">— BLANK SLIP AREA —</span>
      </div>
    );
  }

  const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined || !isFinite(num)) return '0';
    return Math.round(num).toLocaleString('en-IN', { maximumFractionDigits: 0 });
  };

  const netInt = Math.round(employee.netAmount);
  const grossInt = Math.round(employee.grossAmount);
  const advanceInt = Math.round(employee.advance);
  const pfInt = Math.round(employee.pf);

  return (
    <div className="w-full h-full p-3 sm:p-3.5 flex flex-col justify-between border-2 border-slate-900 bg-white text-slate-950 box-border rounded-lg">
      {/* 1. Header (Centered Company Name & Metadata) */}
      <div className="text-center border-b border-slate-300 pb-1.5">
        <h2 className="text-[13px] font-black tracking-wider uppercase text-slate-950 leading-snug">
          {companyTitle}
        </h2>
        <div className="flex items-center justify-center space-x-1.5 text-[8.5px] text-slate-600 font-semibold uppercase mt-0.5">
          <span>{labels.slipTitle}</span>
          <span>•</span>
          <span>{sheetName || 'SALARY'}</span>
          <span>•</span>
          <span className="font-mono font-bold text-slate-950">#{employee.serialNumber}</span>
        </div>
      </div>

      {/* 2. Employee Profile Banner */}
      <div className="bg-slate-100/70 border border-slate-300 px-3 py-1.5 rounded-md flex items-center justify-between">
        <div>
          <span className="text-[7.5px] font-bold text-slate-600 uppercase tracking-wider block">
            {labels.name}
          </span>
          <span className="text-[12.5px] font-black text-slate-950 tracking-tight leading-snug">
            {employee.name}
          </span>
        </div>
        {employee.sectionName?.trim() && (
          <div className="text-right">
            <span className="text-[7.5px] font-bold text-slate-600 uppercase tracking-wider block">
              {labels.section}
            </span>
            <span className="text-[9px] font-bold text-slate-900">
              {employee.sectionName}
            </span>
          </div>
        )}
      </div>

      {/* 3. Minimal Single-Row List (Top to Bottom, Only Exact Sheet Fields) */}
      <div className="border border-slate-300 rounded-md overflow-hidden text-[9px] divide-y divide-slate-200 bg-white">
        <div className="flex justify-between items-center px-3 py-1">
          <span className="text-slate-700 font-medium">{labels.rate}</span>
          <span className="font-mono font-bold text-slate-950">₹{formatNumber(employee.dailyRate)}</span>
        </div>
        <div className="flex justify-between items-center px-3 py-1 bg-slate-50/60">
          <span className="text-slate-700 font-medium">{labels.day}</span>
          <span className="font-mono font-bold text-slate-950">{employee.days}</span>
        </div>
        <div className="flex justify-between items-center px-3 py-1">
          <span className="text-slate-700 font-medium">{labels.hour}</span>
          <span className="font-mono font-bold text-slate-950">{employee.hours || 0}</span>
        </div>
        {employee.increase > 0 && (
          <div className="flex justify-between items-center px-3 py-1 bg-slate-50/60 font-semibold">
            <span>{labels.increase}</span>
            <span className="font-mono font-bold">+₹{formatNumber(employee.increase)}</span>
          </div>
        )}
        <div className="flex justify-between items-center px-3 py-1 font-black text-slate-950 bg-slate-100 border-t border-slate-300">
          <span>{labels.amount}</span>
          <span className="font-mono text-[9.5px]">₹{formatNumber(grossInt)}</span>
        </div>
        <div className="flex justify-between items-center px-3 py-1 text-slate-800">
          <span>{labels.advance}</span>
          <span className="font-mono font-bold">
            {advanceInt > 0 ? `-₹${formatNumber(advanceInt)}` : '₹0'}
          </span>
        </div>
        <div className="flex justify-between items-center px-3 py-1 text-slate-800 bg-slate-50/60">
          <span>{labels.pf}</span>
          <span className="font-mono font-bold">
            {pfInt > 0 ? `-₹${formatNumber(pfInt)}` : '₹0'}
          </span>
        </div>
      </div>

      {/* 4. Solid Black Total Amount Bar */}
      <div className="bg-slate-950 text-white px-3 py-2 rounded-md flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-200">
          {labels.totalAmount}
        </span>
        <span className="text-[14px] font-black font-mono text-white tracking-tight">
          ₹{formatNumber(netInt)}
        </span>
      </div>

      {/* 5. Clean Signature Footer */}
      <div className="border-t border-slate-300 pt-1.5 flex items-end justify-between text-[8px] text-slate-600">
        <div>
          <span>Date: ________________</span>
        </div>
        <div className="text-right">
          <div className="w-28 border-b border-slate-900 mb-0.5" />
          <span className="text-[8px] font-bold text-slate-900 block">
            {labels.signatureHint}
          </span>
        </div>
      </div>
    </div>
  );
};
