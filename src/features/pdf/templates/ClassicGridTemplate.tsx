import React from 'react';
import { getSlipLabels } from '../utils/pdf-labels';
import type { TemplateProps } from './CorporateCleanTemplate';

/**
 * Template 2: Excel Worksheet Grid ("Excel Ki Tarah")
 * Designed specifically for Black & White laser/deskjet printing.
 * Real spreadsheet table layout with complete cell borders, header fills,
 * and classic accounting double underline.
 */
export const ClassicGridTemplate: React.FC<TemplateProps> = ({
  employee,
  companyTitle = 'GLOBAL ENTERPRISES',
  sheetName = '',
  language = 'en',
}) => {
  const labels = getSlipLabels(language);

  if (!employee) {
    return (
      <div className="w-full h-full p-4 flex items-center justify-center border-2 border-black bg-neutral-100 text-neutral-500 text-xs select-none">
        <span className="tracking-widest uppercase text-[10px] font-black">— EMPTY SPREADSHEET CELL —</span>
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
    <div className="w-full h-full p-2.5 sm:p-3 flex flex-col justify-between border-[2px] border-black bg-white text-black box-border">
      {/* 1. Excel Title Row (Full width header cell) */}
      <div className="border border-black bg-neutral-200 text-center py-1">
        <h2 className="text-[13px] font-black tracking-wider uppercase leading-snug">
          {companyTitle}
        </h2>
        <div className="text-[8px] font-black uppercase text-neutral-800 tracking-wider">
          {labels.slipTitle} • {sheetName || 'SALARY'} • SR #{employee.serialNumber}
        </div>
      </div>

      {/* 2. Employee Info Grid Row */}
      <table className="w-full border-collapse border border-black text-[9px] mt-1">
        <tbody>
          <tr>
            <td className="border border-black bg-neutral-100 p-1 font-bold w-1/4 uppercase text-[8px]">
              {labels.name}:
            </td>
            <td className={`border border-black p-1 font-black text-[12px] ${employee.sectionName?.trim() ? 'w-2/4' : 'w-3/4'}`}>
              {employee.name}
            </td>
            {employee.sectionName?.trim() && (
              <td className="border border-black bg-neutral-100 p-1 font-bold text-center text-[8px] w-1/4">
                {employee.sectionName}
              </td>
            )}
          </tr>
        </tbody>
      </table>

      {/* 3. Real Excel Grid Cells (Field on Left, Value on Right) */}
      <table className="w-full border-collapse border border-black text-[8.5px] mt-1">
        <thead>
          <tr className="bg-neutral-200 text-black font-black uppercase text-[8px]">
            <th className="border border-black p-1 text-left">EXCEL COLUMN</th>
            <th className="border border-black p-1 text-right">VALUE (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black p-1 font-bold">{labels.rate}</td>
            <td className="border border-black p-1 font-mono font-bold text-right">₹{formatNumber(employee.dailyRate)}</td>
          </tr>
          <tr className="bg-neutral-50">
            <td className="border border-black p-1 font-bold">{labels.day}</td>
            <td className="border border-black p-1 font-mono font-bold text-right">{employee.days}</td>
          </tr>
          <tr>
            <td className="border border-black p-1 font-bold">{labels.hour}</td>
            <td className="border border-black p-1 font-mono font-bold text-right">{employee.hours || 0}</td>
          </tr>
          {employee.increase > 0 && (
            <tr className="bg-neutral-100">
              <td className="border border-black p-1 font-bold">{labels.increase}</td>
              <td className="border border-black p-1 font-mono font-bold text-right">+₹{formatNumber(employee.increase)}</td>
            </tr>
          )}
          <tr className="bg-neutral-200 font-black border-t-2 border-black">
            <td className="border border-black p-1 font-black">{labels.amount} (Gross)</td>
            <td className="border border-black p-1 font-mono font-black text-right">₹{formatNumber(grossInt)}</td>
          </tr>
          <tr>
            <td className="border border-black p-1 font-bold">{labels.advance}</td>
            <td className="border border-black p-1 font-mono font-black text-right">
              {advanceInt > 0 ? `-₹${formatNumber(advanceInt)}` : '₹0'}
            </td>
          </tr>
          <tr className="bg-neutral-50">
            <td className="border border-black p-1 font-bold">{labels.pf}</td>
            <td className="border border-black p-1 font-mono font-black text-right">
              {pfInt > 0 ? `-₹${formatNumber(pfInt)}` : '₹0'}
            </td>
          </tr>
        </tbody>
      </table>

      {/* 4. Total Row with Classic Double Accounting Underline */}
      <div className="border-[2px] border-black bg-neutral-100 p-1.5 flex justify-between items-center mt-1">
        <span className="text-[10px] font-black uppercase tracking-wider">
          {labels.totalAmount}
        </span>
        <span className="text-[15px] font-black font-mono border-b-[3px] border-double border-black pb-0.5">
          ₹{formatNumber(netInt)}
        </span>
      </div>

      {/* 5. Signature Cell */}
      <div className="border border-black p-1 flex justify-between items-end text-[8px] mt-1 bg-white">
        <span>DATE: ________________</span>
        <div className="text-right">
          <div className="w-28 border-b border-black mb-0.5" />
          <span className="font-black uppercase">{labels.signatureHint}</span>
        </div>
      </div>
    </div>
  );
};
