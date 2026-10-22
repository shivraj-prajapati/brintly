/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'var(--color-brand-50, #f0fdf4)',
          100: 'var(--color-brand-100, #dcfce7)',
          200: 'var(--color-brand-200, #bbf7d0)',
          300: 'var(--color-brand-300, #86efac)',
          400: 'var(--color-brand-400, #4ade80)',
          500: 'var(--color-brand-500, #22c55e)',
          600: 'var(--color-brand-600, #16a34a)',
          700: 'var(--color-brand-700, #15803d)',
          800: 'var(--color-brand-800, #166534)',
          900: 'var(--color-brand-900, #14532d)',
          primary: 'var(--color-brand-primary, #15803d)',
          'primary-hover': 'var(--color-brand-primary-hover, #166534)',
        },
        surface: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: 'var(--color-surface-border, #e2e8f0)',
          300: 'var(--color-surface-border-strong, #cbd5e1)',
          400: '#a3a3a3',
          500: 'var(--color-text-subtle, #64748b)',
          600: 'var(--color-text-muted, #475569)',
          700: '#334155',
          800: '#1e293b',
          900: 'var(--color-text-main, #0f172a)',
          bg: 'var(--color-surface-bg, #f8fafc)',
          card: 'var(--color-surface-card, #ffffff)',
          subtle: 'var(--color-surface-subtle, #f1f5f9)',
        }
      },
      fontFamily: {
        logo: [
          '"Space Grotesk"',
          'Plus Jakarta Sans',
          'Outfit',
          '-apple-system',
          'sans-serif',
        ],
        display: [
          'Plus Jakarta Sans',
          'Outfit',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
        sans: [
          'Inter',
          'Noto Sans Devanagari',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        hindi: [
          'Noto Sans Devanagari',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        elevated: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        paper: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}