import * as Localization from "expo-localization";
import { translations, type Language } from "./translations";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { Platform } from "react-native";

const SUPPORTED_LANGUAGES: Language[] = ["ja", "en", "zh", "ko", "es", "fr", "de", "pt", "ar", "hi"];

export function getLang(): Language {
  try {
    // Use i18n.language if initialized and available
    if (i18n.isInitialized && i18n.language) {
      const i18nLang = i18n.language.split('-')[0]; // Take primary language code
      if (SUPPORTED_LANGUAGES.includes(i18nLang as Language)) {
        return i18nLang as Language;
      }
    }

    if (Platform.OS === 'web') {
      // Client-side (web): use LanguageDetector
      // Ensure LanguageDetector is initialized before calling detect
      // The LanguageDetector is initialized in I18nProvider, so it should be ready here.
      const detector = new LanguageDetector(null, {
        order: ['navigator', 'htmlTag', 'path', 'subdomain'],
        caches: ['localStorage'],
      });
      const browserLang = detector.detect();
      if (browserLang && SUPPORTED_LANGUAGES.includes(browserLang as Language)) {
        return browserLang as Language;
      }
    } else {
      // React Native: use expo-localization
      const locales = Localization.getLocales();
      const deviceLang = locales[0]?.languageCode ?? "ja";
      if (SUPPORTED_LANGUAGES.includes(deviceLang as Language)) return deviceLang as Language;
    }
    return "ja"; // Fallback
  } catch {
    return "ja";
  }
}

export function getIsRTL(language?: Language): boolean {
  const currentLanguage = language || i18n.language.split('-')[0];
  return ["ar"].includes(currentLanguage);
}

export function t(key: string, vars?: Record<string, string | number>): string {
  // Use i18n's t function if initialized, otherwise fallback to direct lookup
  if (i18n.isInitialized) {
    return i18n.t(key, vars as Record<string, string>);
  }

  // Fallback for cases where i18n might not be fully initialized (e.g., very early in app load)
  const currentLang = getLang();
  const dict = translations[currentLang] ?? translations.ja;
  let text = dict[key] ?? translations.ja[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(new RegExp(`{{\\s*${k}\\s*}}`, "g"), String(v));
    }
  }
  return text;
}

export { I18nProvider } from "./I18nProvider";
