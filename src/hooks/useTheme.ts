// src/hooks/useTheme.ts

'use client';

import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // প্রাথমিক থিম লোড করুন (localStorage অথবা ডিফল্ট ডার্ক থিম)
  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    const initialTheme = stored || 'dark'; // ডিফল্ট ডার্ক থিম (প্রিমিয়াম লুকের জন্য)

    setThemeState(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme, mounted };
};
