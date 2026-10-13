import React from 'react';
import { getSlipLabels } from '../utils/pdf-labels';
import type { TemplateProps } from './CorporateCleanTemplate';

/**
 * Template 5: Monospace Minimalist Ledger
 * Pure Black & White hairline layout with monospace accounting typography,
 * stark white background, and minimalist precision.
 */
export const ExecutiveFormalTemplate: React.FC<TemplateProps> = ({
  employee,
  companyTitle = 'GLOBAL ENTERPRISES',
  sheetName = '',
  language = 'en',
}) => {
  const labels = getSlipLabels(language);

  if (!employee) {
    return (
      <div className="w-full h-full p-4 flex items-center justify-center border border-dashed border-slate-300 bg-white text-slate-400 text-xs select-none">
        <span className="tracking-widest uppercase text-[10px] font-mono">— BLANK RECORD —</span>
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
    <div className="w-full h-full p-3 sm:p-3.5 flex flex-col justify-between border border-slate-900 bg-white text-slate-950 box-border font-mono">
      {/* 1. Monospace Centered Header */}
      <div className="text-center pb-1.5 border-b border-slate-900">
        <h2 className="text-[12.5px] font-black tracking-widest uppercase leading-snug">
          {companyTitle}
        </h2>
        <div className="text-[8px] text-slate-700 tracking-wider uppercase mt-0.5 font-bold">
          {labels.slipTitle} // {sheetName || 'SALARY'} // #{employee.serialNumber}
        </div>
      </div>

      {/* 2. Employee Profile Row */}
      <div className="border-b border-slate-400 py-1 flex justify-between items-center text-[9px]">
        <div>
          <span className="text-[7.5px] uppercase text-slate-500 block font-sans">{labels.name}</span>
          <span className="text-[12px] font-black leading-snug">{employee.name}</span>
        </div>
        {employee.sectionName?.trim() && (
          <div className="text-right">
            <span className="text-[7.5px] uppercase text-slate-500 block font-sans">{labels.section}</span>
            <span className="font-bold text-[9px]">{employee.sectionName}</span>
          </div>
        )}
      </div>

      {/* 3. Hairline Monospace Itemized Rows */}
      <div className="text-[8.5px] divide-y divide-slate-200">
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-600 font-sans">{labels.rate}</span>
          <span className="font-bold text-slate-950">₹{formatNumber(employee.dailyRate)}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-600 font-sans">{labels.day}</span>
          <span className="font-bold text-slate-950">{employee.days}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-600 font-sans">{labels.hour}</span>
          <span className="font-bold text-slate-950">{employee.hours || 0}</span>
        </div>
        {employee.increase > 0 && (
          <div className="flex justify-between items-center py-1 font-bold">
            <span className="font-sans">{labels.increase}</span>
            <span>+₹{formatNumber(employee.increase)}</span>
          </div>
        )}
        <div className="flex justify-between items-center py-1 font-black border-t border-slate-900">
          <span className="font-sans">{labels.amount} (Gross)</span>
          <span className="text-[9.5px]">₹{formatNumber(grossInt)}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-600 font-sans">{labels.advance}</span>
          <span className="font-bold">
            {advanceInt > 0 ? `-₹${formatNumber(advanceInt)}` : '₹0'}
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-600 font-sans">{labels.pf}</span>
          <span className="font-bold">
            {pfInt > 0 ? `-₹${formatNumber(pfInt)}` : '₹0'}
          </span>
        </div>
      </div>

      {/* 4. Stark Minimal Total Box */}
      <div className="border border-slate-900 p-2 flex justify-between items-center bg-white">
        <span className="text-[9.5px] font-black uppercase tracking-wider font-sans">
          {labels.totalAmount}
        </span>
        <span className="text-[14px] font-black tracking-tight border-b-2 border-slate-900 pb-0.5">
          ₹{formatNumber(netInt)}
        </span>
      </div>

      {/* 5. Minimal Signature Footer */}
      <div className="border-t border-slate-400 pt-1.5 flex justify-between items-end text-[8px] text-slate-600">
        <div>
          <span>DATE: ____________</span>
        </div>
        <div className="text-right">
          <div className="w-28 border-b border-slate-900 mb-0.5" />
          <span className="font-bold font-sans">{labels.signatureHint}</span>
        </div>
      </div>
    </div>
  );
};
