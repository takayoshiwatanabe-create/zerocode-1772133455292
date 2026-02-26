import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { t, getLang, getIsRTL } from "@/i18n";
import { TranslationKeys } from "@/i18n/translations";

interface LanguageSelectorProps {
  onLanguageChange: (langCode: string) => void;
}

const supportedLanguages = [
  { code: "ja", nameKey: "language_japanese" },
  { code: "en", nameKey: "language_english" },
  { code: "zh", nameKey: "language_chinese" },
  { code: "ko", nameKey: "language_korean" },
  { code: "es", nameKey: "language_spanish" },
  { code: "fr", nameKey: "language_french" },
  { code: "de", nameKey: "language_german" },
  { code: "pt", nameKey: "language_portuguese" },
  { code: "ar", nameKey: "language_arabic" },
  { code: "hi", nameKey: "language_hindi" },
];

export function LanguageSelector({ onLanguageChange }: LanguageSelectorProps) {
  const currentLang = getLang();
  const isRTL = getIsRTL();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectLanguage = (langCode: string) => {
    onLanguageChange(langCode);
    setIsOpen(false);
  };

  const currentLangName = supportedLanguages.find(
    (lang) => lang.code === currentLang
  )?.nameKey;

  return (
    <View style={[styles.container, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
      <TouchableOpacity
        style={[styles.dropdownHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={[styles.selectedLanguageText, { textAlign: isRTL ? 'right' : 'left' }]}>
          {currentLangName ? t(currentLangName as TranslationKeys) : currentLang}
        </Text>
        <Text style={styles.dropdownArrow}>{isOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={[styles.dropdownList, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          {supportedLanguages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.dropdownItem,
                currentLang === lang.code && styles.selectedItem,
              ]}
              onPress={() => handleSelectLanguage(lang.code)}
            >
              <Text style={[styles.dropdownItemText, { textAlign: isRTL ? 'right' : 'left' }]}>
                {t(lang.nameKey as TranslationKeys)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  dropdownHeader: {
    backgroundColor: '#e2e8f0', // slate-200
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1', // slate-300
  },
  selectedLanguageText: {
    fontSize: 16,
    color: '#1e293b', // slate-800
    fontWeight: '600',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#475569', // slate-600
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: '100%',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9', // slate-100
  },
  selectedItem: {
    backgroundColor: '#e0f2fe', // blue-50
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#334155', // slate-700
  },
});

