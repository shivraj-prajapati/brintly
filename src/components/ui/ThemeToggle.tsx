import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme, applyThemeToDom, type ThemeMode } from '../../lib/theme.tsx';

export interface ThemeToggleProps {
  className?: string;
  showLabels?: boolean;
}

/**
 * Enterprise Minimal Theme Toggle Component
 * Segmented pill control supporting:
 * - System (Auto-syncs with user's OS preference)
 * - Light Mode
 * - Dark Mode
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabels = false }) => {
  const { theme, effectiveTheme, setTheme } = useTheme();

  const handleSelectTheme = (mode: ThemeMode) => {
    // 1. Immediately apply to DOM synchronously without waiting for React state cycle
    applyThemeToDom(mode);
    // 2. Persist to storage and update React Context state
    setTheme(mode);
  };

  const options: Array<{
    id: ThemeMode;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    tooltip: string;
  }> = [
    {
      id: 'system',
      label: 'System',
      icon: Laptop,
      tooltip: `System Theme (${effectiveTheme === 'dark' ? 'currently Dark' : 'currently Light'})`,
    },
    {
      id: 'light',
      label: 'Light',
      icon: Sun,
      tooltip: 'Light Mode',
    },
    {
      id: 'dark',
      label: 'Dark',
      icon: Moon,
      tooltip: 'Dark Mode',
    },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Color Theme Selection"
      className={`inline-flex items-center p-0.5 rounded-xl border transition-colors bg-surface-100/90 dark:bg-slate-900/90 border-surface-200 dark:border-slate-800 shadow-2xs ${className}`}
    >
      {options.map((opt) => {
        const isSelected = theme === opt.id;
        const IconComponent = opt.icon;

        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => handleSelectTheme(opt.id)}
            title={opt.tooltip}
            className={`relative flex items-center justify-center space-x-1.5 px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              isSelected
                ? 'bg-white text-surface-900 shadow-2xs dark:bg-slate-800 dark:text-emerald-400 dark:shadow-sm'
                : 'text-surface-400 hover:text-surface-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <IconComponent
              className={`w-3.5 h-3.5 transition-transform ${
                isSelected ? 'scale-105' : 'opacity-80'
              }`}
            />
            {showLabels && <span className="text-[11px] font-medium">{opt.label}</span>}
          </button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;
