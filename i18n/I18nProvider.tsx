import React, { ReactNode, useEffect } from "react";
import { I18nManager, Platform } from "react-native"; // Import Platform
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { translations } from "./translations";
import { getLang, getIsRTL } from "./index"; // Import functions
import LanguageDetector from "i18next-browser-languagedetector"; // Import for web detection

interface I18nProviderProps {
  children: ReactNode;
}

// Initialize i18next for React Native
i18n
  .use(LanguageDetector) // Add LanguageDetector for consistency, though its detection methods might differ on native
  .use(initReactI18next)
  .init({
    resources: Object.entries(translations).reduce((acc, [key, value]) => {
      acc[key] = { translation: value };
      return acc;
    }, {} as Record<string, { translation: Record<string, string> }>),
    fallbackLng: "ja",
    lng: getLang(), // Use the detected language
    debug: false,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      order: ['navigator', 'htmlTag', 'path', 'subdomain'], // Order for web
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
        // For simplicity in this example, we just force it.
      }
    }
    // Update i18n instance language if it changes (e.g., user changes language in settings)
    if (i18n.language !== currentLang) {
      i18n.changeLanguage(currentLang);
    }
  }, [isRTL, currentLang]);

  return <>{children}</>;
}
