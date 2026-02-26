"use client";

import React, { useEffect, useState } from "react";
import i18n from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, I18nManager } from "react-native";
import { getIsRTL } from "./index"; // Import getIsRTL from index

// Import all translation files
import translation_ja from "../../locales/ja.json";
import translation_en from "../../locales/en.json";
import translation_zh from "../../locales/zh.json";
import translation_ko from "../../locales/ko.json";
import translation_es from "../../locales/es.json";
import translation_fr from "../../locales/fr.json";
import translation_de from "../../locales/de.json";
import translation_pt from "../../locales/pt.json";
import translation_ar from "../../locales/ar.json";
import translation_hi from "../../locales/hi.json";

const resources = {
  ja: { translation: translation_ja },
  en: { translation: translation_en },
  zh: { translation: translation_zh },
  ko: { translation: translation_ko },
  es: { translation: translation_es },
  fr: { translation: translation_fr },
  de: { translation: translation_de },
  pt: { translation: translation_pt },
  ar: { translation: translation_ar },
  hi: { translation: translation_hi },
};

const LANGUAGE_STORAGE_KEY = "user_language";

const initI18n = async () => {
  let initialLanguage = "ja"; // Default language

  try {
    const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage) {
      initialLanguage = storedLanguage;
    } else {
      // Use expo-localization for native, browser-languagedetector for web
      if (Platform.OS !== 'web') {
        const locale = Localization.getLocales()[0];
        initialLanguage = locale?.languageCode || "ja";
      }
    }
  } catch (error) {
    console.error("Failed to load language from storage:", error);
  }

  i18n
    .use(Platform.OS === 'web' ? LanguageDetector : null as any) // Use LanguageDetector only for web
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "ja",
      lng: initialLanguage,
      interpolation: {
        escapeValue: false, // react already escapes by default
      },
      detection: {
        order: ['localStorage', 'navigator'], // Order for web detection
        caches: ['localStorage'],
      },
      react: {
        useSuspense: false, // Disable suspense for easier integration
      },
    });

  // Set HTML dir attribute for web
  if (Platform.OS === 'web') {
    document.documentElement.setAttribute('dir', getIsRTL(i18n.language) ? 'rtl' : 'ltr');
  }
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);

  useEffect(() => {
    initI18n().then(() => {
      setIsI18nInitialized(true);
    });

    // Listen for language changes and update HTML dir attribute for web
    const handleLanguageChanged = (lng: string) => {
      if (Platform.OS === 'web') {
        document.documentElement.setAttribute('dir', getIsRTL(lng) ? 'rtl' : 'ltr');
      } else {
        // For native, forceRTL needs to be handled carefully and often requires a reload
        // This is handled in _layout.tsx for the root I18nManager.forceRTL call.
        // For components, ensure styles adapt to I18nManager.isRTL.
        if (I18nManager.isRTL !== getIsRTL(lng)) {
          // console.warn("Language direction changed. Consider restarting the app for full native UI adaptation.");
          // I18nManager.forceRTL(getIsRTL(lng));
          // I18nManager.allowRTL(getIsRTL(lng));
          // Reload the app if necessary for a complete RTL switch on native
          // Updates to I18nManager.isRTL do not take effect until the app is reloaded.
        }
      }
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  if (!isI18nInitialized) {
    return null; // Or a loading spinner
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
