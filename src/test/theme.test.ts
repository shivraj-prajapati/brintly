import { describe, it, expect, beforeEach } from 'vitest';
import { resolveEffectiveTheme, applyThemeToDom, type ThemeMode } from '../lib/theme.tsx';
import { StorageKeys } from '../lib/storage';

describe('Dark Mode & Theme System', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    document.body.className = '';
  });

  it('1. Default Theme: Theme key is registered in StorageKeys', () => {
    expect(StorageKeys.THEME).toBe('brintly_theme_mode');
  });

  it('2. Theme Resolution: Explicit light mode resolves to light', () => {
    const effective = resolveEffectiveTheme('light');
    expect(effective).toBe('light');
  });

  it('3. Theme Resolution: Explicit dark mode resolves to dark', () => {
    const effective = resolveEffectiveTheme('dark');
    expect(effective).toBe('dark');
  });

  it('4. Theme Resolution: System mode fallback defaults gracefully', () => {
    const effective = resolveEffectiveTheme('system');
    // In node/vitest environment, resolves to 'light' (or 'dark' if simulated)
    expect(['light', 'dark']).toContain(effective);
  });

  it('5. applyThemeToDom removes dark class on light mode', () => {
    document.documentElement.classList.add('dark');
    const effective = applyThemeToDom('light');
    expect(effective).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe('light');
  });

  it('6. applyThemeToDom adds dark class on dark mode', () => {
    const effective = applyThemeToDom('dark');
    expect(effective).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });
});
