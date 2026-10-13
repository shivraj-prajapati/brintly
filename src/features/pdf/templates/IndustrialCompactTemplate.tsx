import React from 'react';
import { getSlipLabels } from '../utils/pdf-labels';
import type { TemplateProps } from './CorporateCleanTemplate';

/**
 * Template 4: Traditional Pay Voucher (Salary Parchi)
 * Traditional perforated slip with dashed borders, receipt stamp box,
 * clean ruled lines, and pure Black & White contrast.
 */
export const IndustrialCompactTemplate: React.FC<TemplateProps> = ({
  employee,
  companyTitle = 'GLOBAL ENTERPRISES',
  sheetName = '',
  language = 'en',
}) => {
  const labels = getSlipLabels(language);

  if (!employee) {
    return (
      <div className="w-full h-full p-4 flex items-center justify-center border-2 border-dashed border-black bg-neutral-100 text-neutral-500 text-xs select-none">
        <span className="tracking-widest uppercase text-[10px] font-black">— EMPTY VOUCHER PARCHI —</span>
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
    <div className="w-full h-full p-3 sm:p-3.5 flex flex-col justify-between border-2 border-dashed border-black bg-white text-black box-border">
      {/* 1. Traditional Parchi Header with Receipt Stamp Box */}
      <div className="border-b border-black pb-1.5 flex justify-between items-start">
        <div>
          <span className="text-[7.5px] font-black tracking-widest uppercase border border-black px-1.5 py-0.2 inline-block mb-0.5">
            PAYMENT VOUCHER / पर्ची
          </span>
          <h2 className="text-[13px] font-black tracking-wider uppercase leading-snug">
            {companyTitle}
          </h2>
          <span className="text-[8px] font-bold uppercase text-neutral-700 block">
            {sheetName || 'SALARY'} • SR NO #{employee.serialNumber}
          </span>
        </div>

        <div className="border border-black px-2 py-1 text-center bg-neutral-100">
          <span className="text-[7px] font-black uppercase block">SLIP ID</span>
          <span className="font-mono text-[11px] font-black">#{employee.serialNumber}</span>
        </div>
      </div>

      {/* 2. Employee Details Banner */}
      <div className="border-b border-dotted border-black py-1 flex justify-between items-center text-[9px]">
        <div>
          <span className="text-[7.5px] font-bold uppercase text-neutral-600 block">{labels.name}</span>
          <span className="text-[12.5px] font-black leading-snug">{employee.name}</span>
        </div>
        {employee.sectionName?.trim() && (
          <div className="text-right">
            <span className="text-[7.5px] font-bold uppercase text-neutral-600 block">{labels.section}</span>
            <span className="font-bold text-[9px]">{employee.sectionName}</span>
          </div>
        )}
      </div>

      {/* 3. Ruled Itemized List (Top-to-Bottom Ruled Parchi Lines) */}
      <div className="text-[9px] divide-y divide-dotted divide-black">
        <div className="flex justify-between items-center py-1">
          <span className="font-semibold text-neutral-700">{labels.rate}</span>
          <span className="font-mono font-black">₹{formatNumber(employee.dailyRate)}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="font-semibold text-neutral-700">{labels.day}</span>
          <span className="font-mono font-black">{employee.days} Days</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="font-semibold text-neutral-700">{labels.hour}</span>
          <span className="font-mono font-black">{employee.hours || 0} Hours</span>
        </div>
        {employee.increase > 0 && (
          <div className="flex justify-between items-center py-1 font-bold">
            <span>{labels.increase}</span>
            <span className="font-mono">+₹{formatNumber(employee.increase)}</span>
          </div>
        )}
        <div className="flex justify-between items-center py-1 font-black bg-neutral-100 px-1 border-t border-black">
          <span>{labels.amount} (Gross)</span>
          <span className="font-mono text-[9.5px]">₹{formatNumber(grossInt)}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="font-semibold text-neutral-700">{labels.advance}</span>
          <span className="font-mono font-black">
            {advanceInt > 0 ? `-₹${formatNumber(advanceInt)}` : '₹0'}
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="font-semibold text-neutral-700">{labels.pf}</span>
          <span className="font-mono font-black">
            {pfInt > 0 ? `-₹${formatNumber(pfInt)}` : '₹0'}
          </span>
        </div>
      </div>

      {/* 4. Bold Total Amount Box with Heavy Border */}
      <div className="border-[2px] border-black bg-neutral-100 p-2 flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-wider">
          {labels.totalAmount}
        </span>
        <span className="text-[15px] font-black font-mono">
          ₹{formatNumber(netInt)}
        </span>
      </div>

      {/* 5. Signature Footer */}
      <div className="border-t border-black pt-1 flex justify-between items-end text-[8px] font-bold">
        <span>DATE: ________________</span>
        <div className="text-right">
          <div className="w-28 border-b border-black mb-0.5" />
          <span>{labels.signatureHint}</span>
        </div>
      </div>
    </div>
  );
};
