import { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from 'react';
import { StorageKeys, getStoredConfig, setStoredConfig } from './storage';

export type ThemeMode = 'system' | 'light' | 'dark';
export type EffectiveTheme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: ThemeMode;
  effectiveTheme: EffectiveTheme;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

/**
 * Returns system's preferred color scheme
 */
export function getSystemTheme(): EffectiveTheme {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Resolves effective theme based on user preference ('system' | 'light' | 'dark')
 */
export function resolveEffectiveTheme(mode: ThemeMode): EffectiveTheme {
  if (mode === 'system') {
    return getSystemTheme();
  }
  return mode;
}

/**
 * Applies the effective theme class (.dark / .light) to document.documentElement and body
 */
export function applyThemeToDom(mode: ThemeMode): EffectiveTheme {
  if (typeof window === 'undefined') return 'light';
  const effective = resolveEffectiveTheme(mode);
  const root = document.documentElement;
  const body = document.body;

  if (effective === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
    if (body) {
      body.classList.add('dark');
      body.classList.remove('light');
    }
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
    if (body) {
      body.classList.remove('dark');
      body.classList.add('light');
    }
  }

  root.style.colorScheme = effective;
  root.setAttribute('data-theme', effective);
  if (body) {
    body.style.colorScheme = effective;
    body.setAttribute('data-theme', effective);
  }

  return effective;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(() =>
    getStoredConfig<ThemeMode>(StorageKeys.THEME, 'system')
  );

  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>(() =>
    resolveEffectiveTheme(getStoredConfig<ThemeMode>(StorageKeys.THEME, 'system'))
  );

  // Set theme & persist to localStorage
  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    setStoredConfig(StorageKeys.THEME, newTheme);
    const resolved = applyThemeToDom(newTheme);
    setEffectiveTheme(resolved);
  };

  // Quick toggle between light and dark (or back to system)
  const toggleTheme = () => {
    if (theme === 'system') {
      // Toggle to opposite of current system theme
      setTheme(effectiveTheme === 'dark' ? 'light' : 'dark');
    } else if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  // Sync with DOM on mount and listen to system theme changes
  useEffect(() => {
    const resolved = applyThemeToDom(theme);
    setEffectiveTheme(resolved);

    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      // Only react if user is in 'system' mode
      const currentStored = getStoredConfig<ThemeMode>(StorageKeys.THEME, 'system');
      if (currentStored === 'system') {
        const newEffective = mediaQuery.matches ? 'dark' : 'light';
        applyThemeToDom('system');
        setEffectiveTheme(newEffective);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      // Safari / older browser fallback
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      effectiveTheme,
      setTheme,
      toggleTheme,
    }),
    [theme, effectiveTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
