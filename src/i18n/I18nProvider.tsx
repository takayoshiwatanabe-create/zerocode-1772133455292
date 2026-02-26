"use client";

import React, { useEffect, useState } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, I18nManager } from 'react-native';
import { TranslationKeys } from './translations';

// Import all translation files
import en from '../../locales/en.json';
import ja from '../../locales/ja.json';
import zh from '../../locales/zh.json';
import ko from '../../locales/ko.json';
import es from '../../locales/es.json';
import fr from '../../locales/fr.json';
import de from '../../locales/de.json';
import pt from '../../locales/pt.json';
import ar from '../../locales/ar.json';
import hi from '../../locales/hi.json';

const resources = {
  en: { translation: en },
  ja: { translation: ja },
  zh: { translation: zh },
  ko: { translation: ko },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  pt: { translation: pt },
  ar: { translation: ar },
  hi: { translation: hi },
};

const supportedLanguages = Object.keys(resources);
const defaultLanguage = 'ja'; // Default language: Japanese

// Function to get the initial language
const getInitialLanguage = async () => {
  let storedLang = null;
  if (Platform.OS !== 'web') {
    // For React Native, use AsyncStorage
    storedLang = await AsyncStorage.getItem('app-language');
  } else {
    // For web, use localStorage
    if (typeof window !== 'undefined') {
      storedLang = localStorage.getItem('app-language');
    }
  }

  if (storedLang && supportedLanguages.includes(storedLang)) {
    return storedLang;
  }

  // Auto-detect device language via expo-localization
  const deviceLocale = Localization.getLocales()[0]?.languageCode;
  if (deviceLocale && supportedLanguages.includes(deviceLocale)) {
    return deviceLocale;
  }

  return defaultLanguage;
};

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: defaultLanguage,
    supportedLngs: supportedLanguages,
    interpolation: {
      escapeValue: false, // react already escapes by default
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false, // Set to false for easier integration with existing code
    },
  });

// Set initial language and RTL status
getInitialLanguage().then(initialLang => {
  i18n.changeLanguage(initialLang);
  if (Platform.OS !== 'web') {
    const isRTL = ['ar'].includes(initialLang);
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL);
      I18nManager.allowRTL(isRTL);
      // A reload might be needed for full effect on native
    }
  }
});

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const initialLang = await getInitialLanguage();
      await i18n.changeLanguage(initialLang);
      setIsInitialized(true);
    };

    if (!isInitialized) {
      initialize();
    }

    // Update HTML dir attribute for web
    if (Platform.OS === 'web') {
      const updateHtmlDir = () => {
        const currentLang = i18n.language;
        const isRTL = ['ar'].includes(currentLang);
        document.documentElement.setAttribute('lang', currentLang);
        document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
      };
      i18n.on('languageChanged', updateHtmlDir);
      updateHtmlDir(); // Call initially
      return () => {
        i18n.off('languageChanged', updateHtmlDir);
      };
    }
  }, [isInitialized]);

  if (!isInitialized) {
    return null; // Or a loading spinner
  }

  return <React.Fragment>{children}</React.Fragment>;
}

// Helper functions for use throughout the app
export const t = (key: TranslationKeys, options?: any): string => i18n.t(key, options);
export const getLang = (): string => i18n.language;
export const changeLanguage = async (langCode: string) => {
  if (Platform.OS !== 'web') {
    await AsyncStorage.setItem('app-language', langCode);
  } else {
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-language', langCode);
    }
  }
  await i18n.changeLanguage(langCode);

  if (Platform.OS !== 'web') {
    const isRTL = ['ar'].includes(langCode);
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL);
      I18nManager.allowRTL(isRTL);
      // On native, a full app reload might be needed for some components to fully adapt.
      // For Expo Router, this might mean `router.replace('/')` or a more robust solution.
    }
  }
};

export const getIsRTL = (langCode?: string): boolean => {
  const currentLang = langCode || i18n.language;
  return ['ar'].includes(currentLang);
};
