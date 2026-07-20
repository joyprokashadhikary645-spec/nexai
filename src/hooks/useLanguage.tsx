// src/hooks/useLanguage.tsx
//
// পুরো ড্যাশবোর্ডের UI ভাষা এক জায়গা থেকে নিয়ন্ত্রণ করার জন্য Context।
// এখন পর্যন্ত সম্পূর্ণ অনুবাদ আছে: English (en), Bengali (bn)।
// অন্য কোনো ভাষা সিলেক্ট করা হলে UI-এর জন্য ইংরেজিতে fallback হবে
// (AI জেনারেশনের আউটপুট ভাষা এতে প্রভাবিত হবে না, সেটা আলাদাভাবে হ্যান্ডেল হয়)।

'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translate, translateTool, TranslationKey, LanguageCode } from '@/lib/i18n';

interface LanguageContextType {
  language: LanguageCode;
  rawLanguage: string;
  setLanguage: (lang: string) => void;
  t: (key: TranslationKey) => string;
  tTool: (toolId: string, field: 'name' | 'desc', fallback: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const UI_SUPPORTED: LanguageCode[] = ['en', 'bn'];

function toUiLanguage(lang: string | undefined | null): LanguageCode {
  return UI_SUPPORTED.includes(lang as LanguageCode) ? (lang as LanguageCode) : 'en';
}

export const LanguageProvider = ({
  children,
  initialLanguage,
}: {
  children: React.ReactNode;
  initialLanguage?: string;
}) => {
  const [rawLanguage, setRawLanguage] = useState<string>(initialLanguage || 'en');

  // পেজ রিফ্রেশ হলেও যেন সিলেক্ট করা ভাষা মনে থাকে
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('uiLanguage') : null;
    if (stored) setRawLanguage(stored);
  }, []);

  // ইউজার লোড হওয়ার পর তার সেভ করা ভাষা প্রাধান্য পাবে
  useEffect(() => {
    if (initialLanguage) setRawLanguage(initialLanguage);
  }, [initialLanguage]);

  const setLanguage = useCallback((lang: string) => {
    setRawLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('uiLanguage', lang);
    }
  }, []);

  const language = toUiLanguage(rawLanguage);
  const t = useCallback((key: TranslationKey) => translate(key, language), [language]);
  const tTool = useCallback(
    (toolId: string, field: 'name' | 'desc', fallback: string) => translateTool(toolId, field, language, fallback),
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, rawLanguage, setLanguage, t, tTool }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
