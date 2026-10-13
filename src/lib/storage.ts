/**
 * LocalStorage persistent settings manager for Brintly payroll application.
 * Safely persists and restores user preferences across sessions.
 */

export const StorageKeys = {
  TEMPLATE: 'brintly_selected_template',
  LANGUAGE: 'brintly_pdf_language',
  CALC_MODE: 'brintly_calculation_mode',
  ROUNDING: 'brintly_rounding_rule',
  EXCLUSION: 'brintly_exclusion_enabled',
} as const;

export function getStoredConfig<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return defaultValue;
    }
    const stored = window.localStorage.getItem(key);
    if (stored === null) return defaultValue;

    if (typeof defaultValue === 'boolean') {
      return (stored === 'true') as unknown as T;
    }
    return stored as unknown as T;
  } catch (err) {
    console.warn(`Failed to read ${key} from localStorage:`, err);
    return defaultValue;
  }
}

export function setStoredConfig(key: string, value: string | boolean): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, String(value));
    }
  } catch (err) {
    console.warn(`Failed to write ${key} to localStorage:`, err);
  }
}
