import React from 'react';
import { Calculator, Coins, Globe, Info } from 'lucide-react';
import type {
  SalaryCalculationMode,
  SalaryRoundingRule,
  PdfLanguage,
} from '../salary-engine';

export interface CalculationSettingsBarProps {
  calculationMode: SalaryCalculationMode;
  onCalculationModeChange: (mode: SalaryCalculationMode) => void;
  roundingRule: SalaryRoundingRule;
  onRoundingRuleChange: (rule: SalaryRoundingRule) => void;
  pdfLanguage: PdfLanguage;
  onPdfLanguageChange: (lang: PdfLanguage) => void;
}

export const CalculationSettingsBar: React.FC<CalculationSettingsBarProps> = ({
  calculationMode,
  onCalculationModeChange,
  roundingRule,
  onRoundingRuleChange,
  pdfLanguage,
  onPdfLanguageChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-5 shadow-subtle space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Salary Calculation Mode */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Calculator className="w-4 h-4 text-emerald-700" />
            <label className="text-xs font-bold text-surface-900 uppercase tracking-wider">
              Calculation Mode / गणना मोड
            </label>
          </div>
          <p className="text-[11px] text-surface-500 leading-normal">
            Select gross salary source formula or uploaded cell value:
          </p>

          <div className="space-y-1.5 pt-1">
            <label
              className={`flex items-start space-x-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                calculationMode === 'formula'
                  ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600/20'
                  : 'border-surface-200 hover:bg-surface-50 bg-white'
              }`}
            >
              <input
                type="radio"
                name="calcMode"
                value="formula"
                checked={calculationMode === 'formula'}
                onChange={() => onCalculationModeChange('formula')}
                className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="font-semibold text-surface-900 block">
                  Calculate from Rate, Days & Hours
                </span>
                <span className="text-[10px] text-surface-500 block mt-0.5">
                  Formula: (Rate + Increase) × Days + ((Rate + Increase)/12 × Hours)
                </span>
              </div>
            </label>

            <label
              className={`flex items-start space-x-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                calculationMode === 'excel_amount'
                  ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600/20'
                  : 'border-surface-200 hover:bg-surface-50 bg-white'
              }`}
            >
              <input
                type="radio"
                name="calcMode"
                value="excel_amount"
                checked={calculationMode === 'excel_amount'}
                onChange={() => onCalculationModeChange('excel_amount')}
                className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="font-semibold text-surface-900 block">
                  Use Excel Amount Column
                </span>
                <span className="text-[10px] text-surface-500 block mt-0.5">
                  Uses uploaded Amount/Pagar column directly as gross
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* 2. Salary Rounding Rule */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Coins className="w-4 h-4 text-emerald-700" />
            <label className="text-xs font-bold text-surface-900 uppercase tracking-wider">
              Salary Rounding Rule / वेतन राउंडिंग नियम
            </label>
          </div>
          <p className="text-[11px] text-surface-500 leading-normal">
            Applies to final Net Salary (Total Amount / कुल पगार):
          </p>

          <div className="space-y-1.5 pt-1">
            <label
              className={`flex items-start space-x-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                roundingRule === 'exact'
                  ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600/20'
                  : 'border-surface-200 hover:bg-surface-50 bg-white'
              }`}
            >
              <input
                type="radio"
                name="roundRule"
                value="exact"
                checked={roundingRule === 'exact'}
                onChange={() => onRoundingRuleChange('exact')}
                className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="font-semibold text-surface-900 block">
                  Rule 1: Exact Amount (Default)
                </span>
                <span className="text-[10px] text-surface-500 block mt-0.5">
                  Keep net salary unchanged (e.g. ₹34,002 → ₹34,002)
                </span>
              </div>
            </label>

            <label
              className={`flex items-start space-x-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                roundingRule === 'nearest_ten'
                  ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600/20'
                  : 'border-surface-200 hover:bg-surface-50 bg-white'
              }`}
            >
              <input
                type="radio"
                name="roundRule"
                value="nearest_ten"
                checked={roundingRule === 'nearest_ten'}
                onChange={() => onRoundingRuleChange('nearest_ten')}
                className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="font-semibold text-surface-900 block">
                  Rule 2: Nearest Ten (5-and-Above)
                </span>
                <span className="text-[10px] text-surface-500 block mt-0.5">
                  0–4 down, 5–9 up (e.g. ₹34,002 → ₹34,000; ₹34,005 → ₹34,010)
                </span>
              </div>
            </label>

            <label
              className={`flex items-start space-x-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                roundingRule === 'round_up'
                  ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600/20'
                  : 'border-surface-200 hover:bg-surface-50 bg-white'
              }`}
            >
              <input
                type="radio"
                name="roundRule"
                value="round_up"
                checked={roundingRule === 'round_up'}
                onChange={() => onRoundingRuleChange('round_up')}
                className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="font-semibold text-surface-900 block">
                  Rule 3: Round Non-Zero Digit Up
                </span>
                <span className="text-[10px] text-surface-500 block mt-0.5">
                  Any non-zero last digit rounds up to 10 (e.g. ₹34,001 → ₹34,010)
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* 3. PDF Column Language */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-emerald-700" />
            <label className="text-xs font-bold text-surface-900 uppercase tracking-wider">
              PDF Column Language / PDF भाषा
            </label>
          </div>
          <p className="text-[11px] text-surface-500 leading-normal">
            Controls header labels printed on the salary slips:
          </p>

          <div className="space-y-1.5 pt-1">
            <label
              className={`flex items-start space-x-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                pdfLanguage === 'en'
                  ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600/20'
                  : 'border-surface-200 hover:bg-surface-50 bg-white'
              }`}
            >
              <input
                type="radio"
                name="pdfLang"
                value="en"
                checked={pdfLanguage === 'en'}
                onChange={() => onPdfLanguageChange('en')}
                className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="font-semibold text-surface-900 block">
                  English Column Labels (Default)
                </span>
                <span className="text-[10px] text-surface-500 block mt-0.5">
                  Sr. No., Name, Rate, Day, Hour, Amount, Advance, Total Amount
                </span>
              </div>
            </label>

            <label
              className={`flex items-start space-x-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                pdfLanguage === 'hi'
                  ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600/20'
                  : 'border-surface-200 hover:bg-surface-50 bg-white'
              }`}
            >
              <input
                type="radio"
                name="pdfLang"
                value="hi"
                checked={pdfLanguage === 'hi'}
                onChange={() => onPdfLanguageChange('hi')}
                className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <span className="font-semibold text-surface-900 block">
                  हिंदी (Hindi) Column Labels
                </span>
                <span className="text-[10px] text-surface-500 block mt-0.5">
                  क्रम संख्या, नाम, रेट, दिन, घंटा, पगार, उपाढ़, कुल पगार
                </span>
              </div>
            </label>

            <div className="p-2.5 rounded-lg bg-surface-50 text-[11px] text-surface-600 flex items-start space-x-2">
              <Info className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>
                Employee names in Hindi or English are always preserved exactly as imported.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
