import i18next from 'i18next';
import { t, getLang, getIsRTL, changeLanguage } from './index';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock the i18next instance
jest.mock('i18next', () => ({
  t: jest.fn((key) => key), // Simple mock for t function
  language: 'en', // Default mock language
  dir: jest.fn(() => 'ltr'), // Default mock direction
  changeLanguage: jest.fn(),
}));

describe('i18n utility functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (i18next.t as jest.Mock).mockImplementation((key) => key);
    (i18next as any).language = 'en';
    (i18next.dir as jest.Mock).mockReturnValue('ltr');
  });

  it('t function should call i18next.t', () => {
    const result = t('test_key', { value: '123' });
    expect(i18next.t).toHaveBeenCalledWith('test_key', { value: '123' });
    expect(result).toBe('test_key');
  });

  it('getLang should return the current i18next language', () => {
    (i18next as any).language = 'ja';
    expect(getLang()).toBe('ja');

    (i18next as any).language = 'ar';
    expect(getLang()).toBe('ar');
  });

  it('getIsRTL should return true for RTL languages', () => {
    (i18next as any).language = 'ar';
    (i18next.dir as jest.Mock).mockReturnValue('rtl');
    expect(getIsRTL()).toBe(true);
  });

  it('getIsRTL should return false for LTR languages', () => {
    (i18next as any).language = 'en';
    (i18next.dir as jest.Mock).mockReturnValue('ltr');
    expect(getIsRTL()).toBe(false);

    (i18next as any).language = 'ja';
    (i18next.dir as jest.Mock).mockReturnValue('ltr');
    expect(getIsRTL()).toBe(false);
  });

  it('getIsRTL should correctly determine direction based on provided langCode', () => {
    // Test with explicit langCode
    expect(getIsRTL('ar')).toBe(true);
    expect(getIsRTL('en')).toBe(false);
    expect(getIsRTL('ja')).toBe(false);

    // Ensure it doesn't change the global i18next.language
    expect(i18next.language).toBe('en');
  });

  it('changeLanguage should call i18next.changeLanguage', async () => {
    await changeLanguage('fr');
    expect(i18next.changeLanguage).toHaveBeenCalledWith('fr');
  });
});
