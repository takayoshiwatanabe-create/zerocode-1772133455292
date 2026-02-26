"use client";

import React, { ReactNode, useEffect } from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { translations } from "./translations";
import { getLang, getIsRTL } from "./index"; // Import functions for client-side

interface I18nProviderProps {
  children: ReactNode;
}

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: Object.entries(translations).reduce((acc, [key, value]) => {
      acc[key] = { translation: value };
      return acc;
    }, {} as Record<string, { translation: Record<string, string> }>),
    fallbackLng: "ja",
    lng: getLang(), // Use the detected language from index.ts
    debug: false,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      order: ['navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
    },
  });

export function I18nProvider({ children }: I18nProviderProps) {
  const currentLang = getLang();
  const isRTL = getIsRTL(currentLang);

  useEffect(() => {
    // Set HTML dir attribute based on RTL status
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', currentLang);
  }, [isRTL, currentLang]);

  return <>{children}</>;
}

