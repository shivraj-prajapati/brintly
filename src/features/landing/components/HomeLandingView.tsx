import React from 'react';
import {
  FileSpreadsheet,
  Scissors,
  Palette,
} from 'lucide-react';
import { ExcelUploader } from '../../excel/components/ExcelUploader';
import { PDF_TEMPLATES } from '../../pdf/types/template.types';

export interface HomeLandingViewProps {
  onFileUpload: (file: File) => void;
  onLoadDemo: () => void;
  isLoading: boolean;
  error: string | null;
}

export const HomeLandingView: React.FC<HomeLandingViewProps> = ({
  onFileUpload,
  onLoadDemo,
  isLoading,
  error,
}) => {
  return (
    <div className="space-y-12 sm:space-y-16 py-1 relative overflow-hidden">
      {/* Soft Ambient Light Glow in Hero Background */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[380px] bg-gradient-to-b from-emerald-100/50 via-teal-50/20 to-transparent dark:from-emerald-950/30 dark:via-teal-950/15 blur-3xl -z-10 pointer-events-none rounded-full" />

      {/* =========================================================================
          1. HERO SECTION: Payway-Inspired Editorial Aesthetic with Floating 3D Elements
          (Optimized to sit higher up & fit completely above the fold even at 125% zoom)
          ========================================================================= */}
      <section className="relative text-center max-w-4xl mx-auto px-4 pt-1 sm:pt-2">
        {/* Headline Container with Floating 3D Elements (Framing the text cleanly) */}
        <div className="relative py-1 sm:py-2">
          {/* FLOATING 3D ELEMENT 1: Bank Card (Left) */}
          <div className="hidden sm:block absolute -left-4 md:-left-10 top-0 -rotate-12 animate-float-gentle z-10 pointer-events-none select-none">
            <img
              src="/icons3d/card.png"
              alt="Salary Card"
              className="w-14 md:w-20 h-auto drop-shadow-2xl"
            />
          </div>

          {/* FLOATING 3D ELEMENT 2: Money Bills (Far Left Behind) */}
          <div className="hidden lg:block absolute -left-16 top-16 rotate-12 animate-float-slow z-0 pointer-events-none select-none opacity-85">
            <img
              src="/icons3d/money.png"
              alt="Salary Cash"
              className="w-16 h-auto drop-shadow-xl"
            />
          </div>

          {/* FLOATING SVG CURSOR (Clicking on Card / Text - Exactly like Payway) */}
          <div className="hidden sm:block absolute left-8 md:left-12 top-12 md:top-14 z-20 pointer-events-none select-none animate-float-reverse">
            <svg className="w-6 h-6 md:w-7 md:h-7 drop-shadow-lg" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 3L10.07 20.97L13.58 13.58L20.97 10.07L3 3Z"
                fill="#0f172a"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* FLOATING 3D ELEMENT 3: Calculator (Top Right) */}
          <div className="hidden sm:block absolute -right-4 md:-right-10 -top-2 rotate-12 animate-float-slow z-10 pointer-events-none select-none">
            <img
              src="/icons3d/calculator.png"
              alt="Salary Calculation"
              className="w-14 md:w-20 h-auto drop-shadow-2xl"
            />
          </div>

          {/* FLOATING TOGGLE SWITCH (Top Right of Text - Exactly like Payway) */}
          <div className="hidden md:flex absolute right-12 top-8 z-20 pointer-events-none select-none items-center animate-float-gentle">
            <div className="w-11 h-6 bg-emerald-500 rounded-full p-0.5 shadow-lg flex items-center justify-end border border-emerald-400">
              <div className="w-4.5 h-4.5 bg-white rounded-full shadow-md" />
            </div>
          </div>

          {/* FLOATING 3D ELEMENT 4: Lock / Security (Bottom Right - Confidentiality) */}
          <div className="hidden sm:block absolute right-2 md:right-6 bottom-0 -rotate-6 animate-float-reverse z-10 pointer-events-none select-none">
            <img
              src="/icons3d/lock.png"
              alt="100% In-Browser Privacy"
              className="w-12 md:w-16 h-auto drop-shadow-2xl"
            />
          </div>

          {/* FLOATING 3D ELEMENT 5: Coins (Bottom Left) */}
          <div className="hidden lg:block absolute left-6 -bottom-2 rotate-6 animate-float-slow z-10 pointer-events-none select-none">
            <img
              src="/icons3d/coins.png"
              alt="Salary Earnings"
              className="w-14 h-auto drop-shadow-xl"
            />
          </div>

          {/* MAIN EDITORIAL HEADLINE (High-contrast, bold display typography - Compact & crisp for 125% zoom) */}
          <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-surface-900 dark:text-slate-100 tracking-tight leading-[1.08] mb-2 sm:mb-2.5 transition-colors">
            Salary Slips <br />
            <span className="text-surface-900 dark:text-slate-100">that feel </span>
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-500 bg-clip-text text-transparent italic font-serif sm:font-display sm:not-italic">
              effortless.
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-surface-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed mb-4 sm:mb-5 font-medium transition-colors">
          Transform messy spreadsheets into clean, 4-in-1 print-ready salary vouchers in seconds. Built for precision, confidentiality, and zero printer waste.
        </p>

        {/* Interactive Upload & Demo Action Zone (Compact, Minimal & Aesthetic - Fits Above the Fold) */}
        <div className="max-w-xl mx-auto space-y-2.5">
          <ExcelUploader
            onFileUpload={onFileUpload}
            isLoading={isLoading}
            error={error}
          />

          {/* 1-Click Demo Sheet (Generic demo.xlsx - Safe & Private) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-0.5">
            <span className="text-xs text-surface-500 dark:text-slate-400 font-medium">
              Want to test immediately?
            </span>
            <button
              type="button"
              onClick={onLoadDemo}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shadow-2xs hover:shadow-xs font-bold text-xs transition-all cursor-pointer group"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Try Demo Sheet (demo.xlsx)</span>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.2 rounded-full font-extrabold border border-emerald-200 dark:border-emerald-800">
                1-Click
              </span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-1 text-[11px] text-surface-500 dark:text-slate-400 font-medium">
            <span>🔒 100% Client-Side Privacy</span>
            <span>•</span>
            <span>✂️ Pre-calibrated Cutting Lines</span>
            <span>•</span>
            <span>🌐 English & Hindi</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. FIVE PDF TEMPLATES SHOWCASE
          ========================================================================= */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-6 space-y-1.5">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            <Palette className="w-3.5 h-3.5" />
            <span>5 Minimal PDF Slip Templates</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-surface-900 dark:text-slate-100 tracking-tight">
            Designed for Every Organization
          </h2>
          <p className="text-xs text-surface-500 dark:text-slate-400">
            Pick your preferred style in the navigation bar; it stays saved in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {PDF_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-surface-200 dark:border-slate-800 p-4 shadow-2xs hover:shadow-card hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-100 dark:bg-slate-800 text-surface-700 dark:text-slate-300 font-mono border border-surface-200 dark:border-slate-700">
                    {tmpl.badge}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-surface-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {tmpl.name}
                </h3>
                <p className="text-[11px] text-surface-500 dark:text-slate-400 leading-snug">
                  {tmpl.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-surface-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                <span>4 Slips / Page</span>
                <Scissors className="w-3.5 h-3.5 text-surface-400 dark:text-slate-500" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          3. HOW IT WORKS (3 Simple Steps)
          ========================================================================= */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-emerald-900 to-slate-900 dark:from-emerald-950 dark:to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-card border border-emerald-900/40 dark:border-slate-800">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1.5">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Fast 3-Step Workflow
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Ready in Under 30 Seconds
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 space-y-1.5">
              <div className="text-emerald-400 font-mono text-xs font-bold">01</div>
              <h4 className="text-sm font-bold text-white">Upload Excel File</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Drop your spreadsheet (.xlsx, .xls) or click the 1-click demo button.
              </p>
            </div>

            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 space-y-1.5">
              <div className="text-emerald-400 font-mono text-xs font-bold">02</div>
              <h4 className="text-sm font-bold text-white">Review & Configure</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Check employee calculations, switch Hindi/English labels, and select your template.
              </p>
            </div>

            <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 space-y-1.5">
              <div className="text-emerald-400 font-mono text-xs font-bold">03</div>
              <h4 className="text-sm font-bold text-white">Download or Print</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Export crisp A4 PDF or trigger browser print. Cut along the dashed scissor lines!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. FREQUENTLY ASKED QUESTIONS
          ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-6 space-y-1">
          <h2 className="text-xl font-bold text-surface-900 dark:text-slate-100">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-surface-500 dark:text-slate-400">
            Common questions about sheet format, calculations, and printing.
          </p>
        </div>

        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-surface-200 dark:border-slate-800 p-4 space-y-1 shadow-2xs transition-colors">
            <h4 className="font-bold text-surface-900 dark:text-slate-100">
              How does the 4-in-1 cutting guide work?
            </h4>
            <p className="text-surface-600 dark:text-slate-400 leading-relaxed text-xs">
              Every A4 page is divided into a 2×2 grid with centered dashed scissor guidelines. After printing, slice along the horizontal and vertical center lines to get 4 neat, identical salary slips.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-surface-200 dark:border-slate-800 p-4 space-y-1 shadow-2xs transition-colors">
            <h4 className="font-bold text-surface-900 dark:text-slate-100">
              Why is the Total Amount always an integer without decimals?
            </h4>
            <p className="text-surface-600 dark:text-slate-400 leading-relaxed text-xs">
              Payroll slips for cash or standard disbursements require clean whole rupee amounts. Brintly applies rigorous rounding logic ensuring net amounts never display paisa fractions or messy decimals.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-surface-200 dark:border-slate-800 p-4 space-y-1 shadow-2xs transition-colors">
            <h4 className="font-bold text-surface-900 dark:text-slate-100">
              Does this work on mobile phones?
            </h4>
            <p className="text-surface-600 dark:text-slate-400 leading-relaxed text-xs">
              Yes. The interface is responsive and adapts cleanly to smartphone screens, allowing mobile data inspection, template selection, and PDF generation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
