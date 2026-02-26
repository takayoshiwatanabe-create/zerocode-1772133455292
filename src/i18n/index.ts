import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { translations, type Language } from "./translations";

const SUPPORTED_LANGUAGES: Language[] = ["ja", "en", "zh", "ko", "es", "fr", "de", "pt", "ar", "hi"];

// Function to get language, works on both server and client
export function getLang(): Language {
  if (typeof window !== 'undefined') {
    // Client-side: use LanguageDetector
    const detector = new LanguageDetector(null, {
      order: ['navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
    });
    const browserLang = detector.detect();
    if (browserLang && SUPPORTED_LANGUAGES.includes(browserLang as Language)) {
      return browserLang as Language;
    }
  } else {
    // Server-side: default to 'ja' or implement server-side detection if needed
    // For Next.js, you might get this from headers or a cookie in a real app
    // For now, we'll default to 'ja' on the server for initial render
    return "ja";
  }
  return "ja"; // Fallback
}

export function getIsRTL(language: Language): boolean {
  return ["ar"].includes(language);
}

export function t(key: string, vars?: Record<string, string | number>): string {
  // Ensure i18n is initialized before using its t function
  if (i18n.isInitialized) {
    return i18n.t(key, vars as Record<string, string>);
  }

  // Fallback for server-side rendering or before i18n is initialized on client
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

