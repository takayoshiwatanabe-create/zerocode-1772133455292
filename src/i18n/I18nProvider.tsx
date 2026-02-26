"use client";

import React, { ReactNode, useEffect } from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { translations, TranslationContent } from "./translations"; // Import TranslationContent
import { getLang, getIsRTL } from "./index";
import { I18nManager, Platform } from "react-native";

interface I18nProviderProps {
  children: ReactNode;
}

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: Object.entries(translations).reduce((acc, [key, value]) => {
      acc[key] = { translation: value as TranslationContent }; // Cast value to TranslationContent
      return acc;
    }, {} as Record<string, { translation: TranslationContent }>), // Use TranslationContent here
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
    if (Platform.OS === 'web') {
      // Set HTML dir attribute based on RTL status for web
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', currentLang);
      }
    } else {
      // For React Native, use I18nManager
      // Only forceRTL if it's different to avoid unnecessary reloads/re-renders
      if (I18nManager.isRTL !== isRTL) {
        I18nManager.forceRTL(isRTL);
        I18nManager.allowRTL(isRTL);
        // Note: Forcing RTL might require a reload for some components to fully adjust.
        // In a real app, you might want to prompt the user to restart or handle this more gracefully.
        // For this mock, we assume a restart or full re-render is handled by the framework/app lifecycle.
      }
    }
    // Update i18n instance language if it changes (e.g., user changes language in settings)
    if (i18n.language !== currentLang) {
      i18n.changeLanguage(currentLang);
    }
  }, [isRTL, currentLang]);

  return <>{children}</>;
}
