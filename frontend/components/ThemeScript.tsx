'use client';

import { useThemeStore } from '@/store/useThemeStore';
import { useEffect } from 'react';

/** Syncs theme from store to document on mount (avoids flash). */
export function ThemeScript() {
  const theme = useThemeStore((s) => s.theme);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  return null;
}
