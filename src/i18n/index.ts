import i18n from "i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, I18nManager } from "react-native";
import { TranslationKeys } from "./translations"; // Import TranslationKeys

const LANGUAGE_STORAGE_KEY = "user_language";

export const t = (key: TranslationKeys, options?: any): string => {
  return i18n.t(key, options);
};

export const getLang = (): string => {
  return i18n.language;
};

export const changeLanguage = async (langCode: string) => {
  await i18n.changeLanguage(langCode);
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, langCode);

  if (Platform.OS !== 'web') {
    const isRTL = getIsRTL(langCode);
    if (I18nManager.isRTL !== isRTL) {
      // I18nManager.forceRTL(isRTL);
      // I18nManager.allowRTL(isRTL);
      // console.warn("Language direction changed. Please restart the app for full UI adaptation.");
      // Forcing RTL on native requires a reload to fully apply.
      // The _layout.tsx handles the initial setting.
      // For dynamic changes, a full app reload is often needed.
    }
  }
};

export const getIsRTL = (lang?: string): boolean => {
  const currentLang = lang || i18n.language;
  // RULE-TECH-004: RTL language (Arabic) full layout reversal support
  return currentLang === "ar"; // Arabic is the only RTL language in our supported list
};

export default i18n;
