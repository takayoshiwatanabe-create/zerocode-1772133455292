import i18n from "i18next";
import { fallbackLng, LanguageCode, languages, TranslationKeys } from "./translations";
import { I18nManager, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const t = (key: TranslationKeys, options?: any): string => {
  return i18n.t(key, options);
};

export const getLang = (): LanguageCode => {
  return (i18n.language || fallbackLng) as LanguageCode;
};

export const getIsRTL = (langCode?: LanguageCode): boolean => {
  const currentLang = langCode || getLang();
  const rtlLanguages = ["ar"]; // Arabic is RTL
  return rtlLanguages.includes(currentLang);
};

export const changeLanguage = async (langCode: LanguageCode) => {
  if (!languages.includes(langCode)) {
    console.warn(`Attempted to set unsupported language: ${langCode}`);
    return;
  }

  await i18n.changeLanguage(langCode);
  await AsyncStorage.setItem("user-language", langCode);

  if (Platform.OS !== 'web') {
    const isRTL = getIsRTL(langCode);
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL);
      I18nManager.allowRTL(isRTL);
      // On React Native, for a full layout refresh, a reload might be necessary.
      // This is often handled by prompting the user to restart the app.
      // For development, Expo's fast refresh might handle some changes.
      console.log(`I18nManager.forceRTL(${isRTL}) applied. App restart may be required for full effect.`);
    }
  } else {
    // For web, update the HTML dir attribute
    document.documentElement.setAttribute('lang', langCode);
    document.documentElement.setAttribute('dir', getIsRTL(langCode) ? 'rtl' : 'ltr');
  }
};

export default i18n;

