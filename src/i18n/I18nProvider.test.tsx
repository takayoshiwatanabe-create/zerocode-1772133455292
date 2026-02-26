import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { I18nProvider } from './I18nProvider';
import i18next from 'i18next';
import { getLang, getIsRTL } from './index';
import { describe, it, expect, jest } from '@jest/globals';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock i18next and expo-localization
jest.mock('i18next', () => ({
  use: jest.fn().mockReturnThis(),
  init: jest.fn(() => Promise.resolve()),
  changeLanguage: jest.fn(() => Promise.resolve()),
  t: jest.fn((key) => key),
  language: 'en', // Default language for mocks
  dir: jest.fn((lang) => (lang === 'ar' ? 'rtl' : 'ltr')),
}));

jest.mock('i18next-browser-languagedetector', () => {
  class MockLanguageDetector {
    type = 'languageDetector';
    async = true;
    init() {}
    detect() {
      return 'en'; // Default detected language
    }
    cacheUserLanguage() {}
  }
  return MockLanguageDetector;
});

jest.mock('expo-localization', () => ({
  getLocales: jest.fn(() => [
    { languageCode: 'en', textDirection: 'ltr', regionCode: 'US' },
  ]),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock the actual `getLang` and `getIsRTL` from `src/i18n/index.ts`
// to ensure they reflect the mocked i18next state.
jest.mock('./index', () => {
  const actual = jest.requireActual('./index');
  return {
    ...actual,
    getLang: jest.fn(() => i18next.language),
    getIsRTL: jest.fn((lang?: string) => i18next.dir(lang || i18next.language) === 'rtl'),
    changeLanguage: jest.fn(async (lng: string) => {
      await i18next.changeLanguage(lng);
      (i18next as any).language = lng; // Update mock i18next language
    }),
  };
});

describe('I18nProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset i18next mocks for each test
    (i18next.init as jest.Mock).mockClear().mockResolvedValue({});
    (i18next.changeLanguage as jest.Mock).mockClear().mockResolvedValue({});
    (i18next.t as jest.Mock).mockClear().mockImplementation((key) => key);
    (i18next as any).language = 'en'; // Reset to default
    (i18next.dir as jest.Mock).mockImplementation((lang) => (lang === 'ar' ? 'rtl' : 'ltr'));

    // Reset expo-localization mock
    (Localization.getLocales as jest.Mock).mockReturnValue([
      { languageCode: 'en', textDirection: 'ltr', regionCode: 'US' },
    ]);

    // Reset AsyncStorage mocks
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(null);
  });

  it('initializes i18next with default language if no stored language', async () => {
    render(
      <I18nProvider>
        <></>
      </I18nProvider>
    );

    await waitFor(() => {
      expect(i18next.init).toHaveBeenCalledTimes(1);
      const initOptions = (i18next.init as jest.Mock).mock.calls[0][0];
      expect(initOptions.lng).toBe('en'); // Default from expo-localization mock
      expect(initOptions.fallbackLng).toBe('en');
      expect(initOptions.debug).toBe(false);
      expect(initOptions.interpolation.escapeValue).toBe(false);
      expect(initOptions.resources.en.translation.app_name).toBe('Mystery Adventure');
    });
  });

  it('initializes i18next with stored language if available', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('ja');

    render(
      <I18nProvider>
        <></>
      </I18nProvider>
    );

    await waitFor(() => {
      expect(i18next.init).toHaveBeenCalledTimes(1);
      const initOptions = (i18next.init as jest.Mock).mock.calls[0][0];
      expect(initOptions.lng).toBe('ja');
    });
  });

  it('provides the `t` function to children', async () => {
    const TestComponent = () => <Text>{getLang()}</Text>;
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('en')).toBeTruthy(); // Initial language from mock
    });
  });

  it('updates language when changeLanguage is called', async () => {
    const TestComponent = () => {
      const lang = getLang();
      const isRTL = getIsRTL();
      return (
        <Text>
          {lang}-{isRTL ? 'rtl' : 'ltr'}
        </Text>
      );
    };

    const { rerender } = render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('en-ltr')).toBeTruthy();
    });

    // Simulate language change
    await (require('./index').changeLanguage as jest.Mock)('ar');
    rerender(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    ); // Rerender to reflect context change

    await waitFor(() => {
      expect(i18next.changeLanguage).toHaveBeenCalledWith('ar');
      expect(screen.getByText('ar-rtl')).toBeTruthy();
    });
  });

  it('stores the new language in AsyncStorage when changed', async () => {
    render(
      <I18nProvider>
        <></>
      </I18nProvider>
    );

    await (require('./index').changeLanguage as jest.Mock)('de');

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('user-language', 'de');
    });
  });

  it('handles i18next initialization errors gracefully', async () => {
    (i18next.init as jest.Mock).mockRejectedValueOnce(new Error('i18n init failed'));
    // Suppress console error for this test
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <I18nProvider>
        <></>
      </I18nProvider>
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error initializing i18next:', expect.any(Error));
    });
    consoleErrorSpy.mockRestore();
  });
});
