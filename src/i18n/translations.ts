import en from "./locales/en.json";
import ja from "./locales/ja.json";
import zh from "./locales/zh.json";
import ko from "./locales/ko.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";
import pt from "./locales/pt.json";
import ar from "./locales/ar.json";
import hi from "./locales/hi.json";

export type Language = "ja" | "en" | "zh" | "ko" | "es" | "fr" | "de" | "pt" | "ar" | "hi";

export const translations = {
  ja,
  en,
  zh,
  ko,
  es,
  fr,
  de,
  pt,
  ar,
  hi,
};

export type TranslationKeys = keyof typeof en; // Assuming 'en' has all keys
