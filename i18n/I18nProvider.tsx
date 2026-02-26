import React, { ReactNode, useEffect } from "react";
import { I18nManager } from "react-native";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { translations } from "./translations";
import { getLang, getIsRTL } from "./index"; // Import functions

interface I18nProviderProps {
  children: ReactNode;
}

// Initialize i18next for React Native
i18n
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
  });

export function I18nProvider({ children }: I18nProviderProps) {
  const currentLang = getLang();
  const isRTL = getIsRTL(currentLang);

  useEffect(() => {
    // Set RTL for the entire app based on detected language
    // This check prevents unnecessary re-renders or re-applications of RTL settings
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL);
      I18nManager.allowRTL(isRTL);
      // Note: Forcing RTL might require a reload for some components to fully adjust.
      // In a real app, you might want to prompt the user to restart or handle this more gracefully.
      // For simplicity in this example, we just force it.
    }
    // Update i18n instance language if it changes (e.g., user changes language in settings)
    if (i18n.language !== currentLang) {
      i18n.changeLanguage(currentLang);
    }
  }, [isRTL, currentLang]);

  return <>{children}</>;
}

