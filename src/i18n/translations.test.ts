import { resources } from './translations';
import { describe, it, expect } from '@jest/globals';

describe('i18n translations', () => {
  const languages = Object.keys(resources);
  const defaultLanguage = 'en'; // Assuming English is the most complete or reference language

  it('should have at least one language defined', () => {
    expect(languages.length).toBeGreaterThan(0);
  });

  it('should have a translation object for each language', () => {
    languages.forEach(lang => {
      expect(resources[lang]).toHaveProperty('translation');
      expect(typeof resources[lang].translation).toBe('object');
    });
  });

  it('should have consistent keys across all languages (comparing to English)', () => {
    if (!resources[defaultLanguage]) {
      throw new Error(`Default language "${defaultLanguage}" not found in resources.`);
    }

    const defaultKeys = Object.keys(resources[defaultLanguage].translation);

    languages.forEach(lang => {
      if (lang === defaultLanguage) return; // Skip self-comparison

      const currentKeys = Object.keys(resources[lang].translation);

      // Check for missing keys in current language
      const missingKeys = defaultKeys.filter(key => !currentKeys.includes(key));
      expect(missingKeys).toEqual([], `Missing keys in ${lang}: ${missingKeys.join(', ')}`);

      // Check for extra keys in current language (optional, but good for consistency)
      const extraKeys = currentKeys.filter(key => !defaultKeys.includes(key));
      expect(extraKeys).toEqual([], `Extra keys in ${lang}: ${extraKeys.join(', ')}`);
    });
  });

  it('should have non-empty translations for all keys in English', () => {
    const enTranslations = resources.en.translation;
    for (const key in enTranslations) {
      if (Object.prototype.hasOwnProperty.call(enTranslations, key)) {
        const value = enTranslations[key];
        expect(value).not.toBeUndefined();
        expect(value).not.toBeNull();
        expect(value).not.toBe('');
      }
    }
  });

  it('should have correct locale_code for each language', () => {
    expect(resources.ja.translation.locale_code).toBe('ja-JP');
    expect(resources.en.translation.locale_code).toBe('en-US');
    expect(resources.zh.translation.locale_code).toBe('zh-CN');
    expect(resources.ko.translation.locale_code).toBe('ko-KR');
    expect(resources.es.translation.locale_code).toBe('es-ES');
    expect(resources.fr.translation.locale_code).toBe('fr-FR');
    expect(resources.de.translation.locale_code).toBe('de-DE');
    expect(resources.pt.translation.locale_code).toBe('pt-BR');
    expect(resources.ar.translation.locale_code).toBe('ar-SA');
    expect(resources.hi.translation.locale_code).toBe('hi-IN');
  });

  it('should define app_name for all languages', () => {
    languages.forEach(lang => {
      expect(resources[lang].translation).toHaveProperty('app_name');
      expect(resources[lang].translation.app_name).not.toBe('');
    });
  });

  it('should define welcome_message for all languages', () => {
    languages.forEach(lang => {
      expect(resources[lang].translation).toHaveProperty('welcome_message');
      expect(resources[lang].translation.welcome_message).not.toBe('');
    });
  });

  it('should define chat_phrase_hello for all languages', () => {
    languages.forEach(lang => {
      expect(resources[lang].translation).toHaveProperty('chat_phrase_hello');
      expect(resources[lang].translation.chat_phrase_hello).not.toBe('');
    });
  });

  it('should define job_farmer_title for all languages', () => {
    languages.forEach(lang => {
      expect(resources[lang].translation).toHaveProperty('job_farmer_title');
      expect(resources[lang].translation.job_farmer_title).not.toBe('');
    });
  });
});
