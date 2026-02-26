import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all translation files
import en from "./locales/en.json";
import ja from "./locales/ja.json";
import zh from "./locales/zh.json";
import ko from "./locales/ko.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";
import pt from "./locales/pt.json";
import ar from "./locales/ar.json"; // Arabic
import hi from "./locales/hi.json"; // Hindi
import { TranslationKeys } from "./translations";

// Define resources
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

// Supported languages and their RTL status
const supportedLanguages = {
  ja: { rtl: false },
  en: { rtl: false },
  zh: { rtl: false },
  ko: { rtl: false },
  es: { rtl: false },
  fr: { rtl: false },
  de: { rtl: false },
  pt: { rtl: false },
  ar: { rtl: true }, // Arabic is RTL
  hi: { rtl: false },
};

// Get device language
const getDeviceLanguage = (): string => {
  const locale = Localization.getLocales()[0];
  const languageCode = locale ? locale.split('-')[0] : 'en';
  return Object.keys(supportedLanguages).includes(languageCode) ? languageCode : 'en';
};

const defaultLanguage = getDeviceLanguage(); // Use device language as default

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: defaultLanguage, // Set initial language
    fallbackLng: "en", // fallback language if a translation is not found
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false, // Set to false for Expo Router compatibility
    },
  });

export const t = (key: TranslationKeys, options?: Record<string, unknown>): string => {
  return i18n.t(key, options);
};

export const getLang = (): string => {
  return i18n.language;
};

export const getIsRTL = (lang?: string): boolean => {
  const currentLang = lang || i18n.language;
  return supportedLanguages[currentLang as keyof typeof supportedLanguages]?.rtl || false;
};

export default i18n;

