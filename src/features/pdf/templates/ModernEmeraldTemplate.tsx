import React from 'react';
import { getSlipLabels } from '../utils/pdf-labels';
import type { TemplateProps } from './CorporateCleanTemplate';

/**
 * Template 3: Columnar Matrix ("Sabhi column ek tarah, sabhi value ek tarah")
 * Multi-column matrix where all column headers are aligned uniformly
 * and all values are positioned directly underneath in structured data blocks.
 * Pure Black & White print ready.
 */
export const ModernEmeraldTemplate: React.FC<TemplateProps> = ({
  employee,
  companyTitle = 'GLOBAL ENTERPRISES',
  sheetName = '',
  language = 'en',
}) => {
  const labels = getSlipLabels(language);

  if (!employee) {
    return (
      <div className="w-full h-full p-4 flex items-center justify-center border border-dashed border-black bg-neutral-100 text-neutral-500 text-xs select-none">
        <span className="tracking-widest uppercase text-[10px] font-bold">— BLANK MATRIX —</span>
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
    <div className="w-full h-full p-3 sm:p-3.5 flex flex-col justify-between border-2 border-black bg-white text-black box-border">
      {/* 1. Header Bar */}
      <div className="border-b-2 border-black pb-1.5 flex justify-between items-start">
        <div>
          <h2 className="text-[13px] font-black tracking-wider uppercase leading-snug">
            {companyTitle}
          </h2>
          <div className="text-[8.5px] font-bold text-neutral-800 uppercase mt-0.5">
            {labels.slipTitle} • {sheetName || 'SALARY'}
          </div>
        </div>
        <div className="text-right">
          <span className="text-[8px] font-bold uppercase block text-neutral-600">SLIP NO</span>
          <span className="font-mono text-[12px] font-black">#{employee.serialNumber}</span>
        </div>
      </div>

      {/* 2. Employee Profile Strip */}
      <div className="border border-black p-1.5 bg-neutral-100 flex justify-between items-center text-[9px]">
        <div>
          <span className="text-[7.5px] font-bold uppercase text-neutral-600 block">{labels.name}</span>
          <span className="text-[12.5px] font-black leading-snug">{employee.name}</span>
        </div>
        {employee.sectionName?.trim() && (
          <div className="text-right">
            <span className="text-[7.5px] font-bold uppercase text-neutral-600 block">{labels.section}</span>
            <span className="font-bold">{employee.sectionName}</span>
          </div>
        )}
      </div>

      {/* 3. Columnar Matrix: Block 1 (Earnings Columns) */}
      <div>
        <div className="text-[8px] font-black uppercase tracking-wider text-neutral-700 mb-0.5">
          ATTENDANCE & EARNINGS COLUMNS
        </div>
        <div className="grid grid-cols-4 border border-black text-center divide-x divide-black bg-white">
          <div className="bg-neutral-100 p-1 font-bold text-[8px] uppercase border-b border-black">{labels.rate}</div>
          <div className="bg-neutral-100 p-1 font-bold text-[8px] uppercase border-b border-black">{labels.day}</div>
          <div className="bg-neutral-100 p-1 font-bold text-[8px] uppercase border-b border-black">{labels.hour}</div>
          <div className="bg-neutral-200 p-1 font-black text-[8px] uppercase border-b border-black">{labels.amount}</div>

          <div className="p-1.5 font-mono font-bold text-[9px]">₹{formatNumber(employee.dailyRate)}</div>
          <div className="p-1.5 font-mono font-bold text-[9px]">{employee.days}</div>
          <div className="p-1.5 font-mono font-bold text-[9px]">{employee.hours || 0}</div>
          <div className="p-1.5 font-mono font-black text-[9px] bg-neutral-50">₹{formatNumber(grossInt)}</div>
        </div>
      </div>

      {/* 4. Columnar Matrix: Block 2 (Deductions & Increase Columns) */}
      <div>
        <div className="text-[8px] font-black uppercase tracking-wider text-neutral-700 mb-0.5">
          DEDUCTIONS & ADJUSTMENTS COLUMNS
        </div>
        <div className="grid grid-cols-3 border border-black text-center divide-x divide-black bg-white">
          <div className="bg-neutral-100 p-1 font-bold text-[8px] uppercase border-b border-black">{labels.advance}</div>
          <div className="bg-neutral-100 p-1 font-bold text-[8px] uppercase border-b border-black">{labels.pf}</div>
          <div className="bg-neutral-100 p-1 font-bold text-[8px] uppercase border-b border-black">{labels.increase}</div>

          <div className="p-1.5 font-mono font-bold text-[9px] text-red-950">
            {advanceInt > 0 ? `-₹${formatNumber(advanceInt)}` : '₹0'}
          </div>
          <div className="p-1.5 font-mono font-bold text-[9px]">
            {pfInt > 0 ? `-₹${formatNumber(pfInt)}` : '₹0'}
          </div>
          <div className="p-1.5 font-mono font-bold text-[9px]">
            {employee.increase > 0 ? `+₹${formatNumber(employee.increase)}` : '₹0'}
          </div>
        </div>
      </div>

      {/* 5. Centered Total Amount Box */}
      <div className="border-[2px] border-black bg-black text-white p-2 flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-wider">
          {labels.totalAmount}
        </span>
        <span className="text-[15px] font-black font-mono tracking-tight text-white">
          ₹{formatNumber(netInt)}
        </span>
      </div>

      {/* 6. Footer Signature */}
      <div className="border-t border-black pt-1 flex justify-between items-end text-[8px] text-neutral-800">
        <span>DATE: ________________</span>
        <div className="text-right">
          <div className="w-28 border-b border-black mb-0.5" />
          <span className="font-bold">{labels.signatureHint}</span>
        </div>
      </div>
    </div>
  );
};
