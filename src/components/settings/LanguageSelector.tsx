import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { t, getLang, getIsRTL } from "@/i18n";
import { TranslationKeys } from "@/i18n/translations";

interface LanguageSelectorProps {
  onLanguageChange: (langCode: string) => void;
}

const supportedLanguages = [
  { code: "ja", name: "日本語" },
  { code: "en", name: "English" },
  { code: "zh", name: "中文" },
  { code: "ko", name: "한국어" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "pt", name: "Português" },
  { code: "ar", name: "العربية" },
  { code: "hi", name: "हिन्दी" },
];

export function LanguageSelector({ onLanguageChange }: LanguageSelectorProps) {
  const currentLang = getLang();
  const isRTL = getIsRTL();

  return (
    <View style={[styles.container, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
      <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>
        {t("settings_current_language" as TranslationKeys, { language: supportedLanguages.find(l => l.code === currentLang)?.name || currentLang })}
      </Text>
      <View style={[styles.languageButtonsContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {supportedLanguages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageButton,
              currentLang === lang.code && styles.selectedLanguageButton,
            ]}
            onPress={() => onLanguageChange(lang.code)}
          >
            <Text
              style={[
                styles.languageButtonText,
                currentLang === lang.code && styles.selectedLanguageButtonText,
              ]}
            >
              {lang.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 12,
  },
  languageButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10, // Tailwind's gap-2.5
    justifyContent: Platform.OS === 'web' ? 'flex-start' : 'center', // Adjust for web vs native
  },
  languageButton: {
    backgroundColor: '#e0e7ff', // indigo-100
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#c7d2fe', // indigo-200
  },
  selectedLanguageButton: {
    backgroundColor: '#4f46e5', // indigo-600
    borderColor: '#4f46e5',
  },
  languageButtonText: {
    color: '#3730a3', // indigo-800
    fontWeight: 'bold',
    fontSize: 14,
  },
  selectedLanguageButtonText: {
    color: '#fff',
  },
});

