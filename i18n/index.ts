import * as Localization from "expo-localization";
import { translations, type Language } from "./translations";
import i18n from "i18next"; // Import i18n instance

const SUPPORTED_LANGUAGES: Language[] = ["ja", "en", "zh", "ko", "es", "fr", "de", "pt", "ar", "hi"];

export function getLang(): Language {
  try {
    // Use i18n.language if initialized and available, otherwise use expo-localization
    if (i18n.isInitialized && i18n.language) {
      const i18nLang = i18n.language.split('-')[0]; // Take primary language code
      if (SUPPORTED_LANGUAGES.includes(i18nLang as Language)) {
        return i18nLang as Language;
      }
    }

    const locales = Localization.getLocales();
    const deviceLang = locales[0]?.languageCode ?? "ja";
    if (SUPPORTED_LANGUAGES.includes(deviceLang as Language)) return deviceLang as Language;
    return "ja";
  } catch {
    return "ja";
  }
}

export function getIsRTL(language: Language): boolean {
  return ["ar"].includes(language);
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

