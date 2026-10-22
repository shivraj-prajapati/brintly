import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

export interface LoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'brand' | 'neutral' | 'white';
  className?: string;
  withGlow?: boolean;
}

/**
 * Enterprise Minimal Circular Spinner Primitive
 * Designed with a precision dual-track SVG, rounded terminal caps, and optional glowing core.
 */
export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'brand',
  className = '',
  withGlow = false,
}) => {
  const sizeMap = {
    xs: { dim: 'w-3.5 h-3.5', stroke: 2.5, dot: 'w-1 h-1' },
    sm: { dim: 'w-4 h-4', stroke: 2.5, dot: 'w-1 h-1' },
    md: { dim: 'w-6 h-6', stroke: 2.5, dot: 'w-1.5 h-1.5' },
    lg: { dim: 'w-10 h-10', stroke: 2.5, dot: 'w-2 h-2' },
    xl: { dim: 'w-12 h-12', stroke: 2.5, dot: 'w-2.5 h-2.5' },
  };

  const colorVariants = {
    brand: {
      track: 'text-surface-200',
      spin: 'text-emerald-600',
      dot: 'bg-emerald-600 shadow-[0_0_8px_rgba(22,163,74,0.6)]',
      glow: 'bg-emerald-500/15',
    },
    neutral: {
      track: 'text-surface-200',
      spin: 'text-surface-600',
      dot: 'bg-surface-700 shadow-[0_0_8px_rgba(71,85,105,0.4)]',
      glow: 'bg-surface-400/10',
    },
    white: {
      track: 'text-white/20',
      spin: 'text-white',
      dot: 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]',
      glow: 'bg-white/20',
    },
  };

  const currentSize = sizeMap[size];
  const colors = colorVariants[variant];

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {withGlow && (
        <div
          className={`absolute inset-0 rounded-full blur-md animate-pulse ${colors.glow}`}
          aria-hidden="true"
        />
      )}
      <svg
        className={`animate-spin ${currentSize.dim} ${colors.spin}`}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Background Track */}
        <circle
          cx="24"
          cy="24"
          r="20"
          stroke="currentColor"
          strokeWidth={currentSize.stroke}
          className={colors.track}
        />
        {/* High-Precision Active Arc */}
        <circle
          cx="24"
          cy="24"
          r="20"
          stroke="currentColor"
          strokeWidth={currentSize.stroke}
          strokeDasharray="34 96"
          strokeLinecap="round"
        />
      </svg>
      {/* Central Pulsing Micro-Core for larger sizes */}
      {(size === 'lg' || size === 'xl') && (
        <div
          className={`absolute rounded-full animate-pulse ${currentSize.dot} ${colors.dot}`}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export interface ProcessingLoaderProps {
  title?: string;
  description?: string;
  steps?: string[];
  showPrivacyBadge?: boolean;
  className?: string;
}

const DEFAULT_PROCESSING_STEPS = [
  'Detecting Hindi & English headers and salary columns...',
  'Parsing formula boundaries, earnings & deduction rows...',
  'Compiling verified employee payroll records...',
  'Validating layout matrix & calculations...',
];

/**
 * Enterprise Processing Loader Component
 * Minimal, high-craft processing card designed for enterprise payroll applications.
 * Features live status pill, high-precision circular loader, indeterminate micro-progress beam,
 * dynamic stage ticker, and privacy verification footnote.
 */
export const ProcessingLoader: React.FC<ProcessingLoaderProps> = ({
  title = 'Processing Excel Workbook',
  description,
  steps = DEFAULT_PROCESSING_STEPS,
  showPrivacyBadge = true,
  className = '',
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'fade-in' | 'fade-out'>('fade-in');

  useEffect(() => {
    if (description || !steps || steps.length <= 1) return;

    const interval = setInterval(() => {
      setFadeState('fade-out');
      setTimeout(() => {
        setCurrentStepIndex((prev) => (prev + 1) % steps.length);
        setFadeState('fade-in');
      }, 200);
    }, 2200);

    return () => clearInterval(interval);
  }, [description, steps]);

  const activeDescription = description || steps[currentStepIndex] || '';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`max-w-md w-full mx-auto my-8 p-7 sm:p-9 rounded-2xl bg-white border border-surface-200/90 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06),0_1px_3px_0_rgba(15,23,42,0.04)] text-center flex flex-col items-center justify-center transition-all ${className}`}
    >

      {/* Minimal Enterprise Dual-Track Spinner */}
      <Loader size="xl" variant="brand" withGlow className="my-1" />

      {/* Main Title */}
      <h3 className="text-sm sm:text-base font-semibold text-surface-900 tracking-tight mt-4">
        {title}
      </h3>

      {/* Indeterminate Micro-Progress Track */}
      <div className="w-44 sm:w-52 h-1 bg-surface-100 rounded-full overflow-hidden relative my-3">
        <div className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-emerald-500 to-transparent rounded-full animate-indeterminate-slide" />
      </div>

      {/* Dynamic Processing Status Description */}
      <p
        className={`text-xs text-surface-500 font-medium min-h-[20px] max-w-xs leading-relaxed transition-opacity duration-200 ${
          fadeState === 'fade-out' ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {activeDescription}
      </p>

      {/* Enterprise Security & Privacy Footnote */}
      {showPrivacyBadge && (
        <div className="mt-5 pt-4 w-full border-t border-surface-100 flex items-center justify-center gap-1.5 text-[11px] text-surface-400 font-medium select-none">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600/90 shrink-0" />
          <span>Client-Side Sandbox • Zero data leaves your browser</span>
        </div>
      )}
    </div>
  );
};

// Aliases for intuitive imports
export const EnterpriseLoader = ProcessingLoader;
export default ProcessingLoader;
