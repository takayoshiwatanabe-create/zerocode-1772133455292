import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { LanguageSelector } from './LanguageSelector';
import { I18nProvider } from '@/i18n/I18nProvider';
import { describe, it, expect, jest } from '@jest/globals';
import i18n from 'i18next'; // Import actual i18next instance

// Mock i18n
jest.mock('@/i18n', () => ({
  t: jest.fn((key) => key),
  getIsRTL: jest.fn(() => false),
  getLang: jest.fn(() => 'en'), // Default language
  changeLanguage: jest.fn(),
}));

describe('LanguageSelector', () => {
  const mockOnLanguageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset i18n language to 'en' for each test
    (require('@/i18n').getLang as jest.Mock).mockReturnValue('en');
  });

  it('renders the current language correctly', () => {
    render(
      <I18nProvider>
        <LanguageSelector onLanguageChange={mockOnLanguageChange} />
      </I18nProvider>
    );

    expect(screen.getByText('language_en')).toBeTruthy();
  });

  it('shows language options when dropdown is pressed', async () => {
    render(
      <I18nProvider>
        <LanguageSelector onLanguageChange={mockOnLanguageChange} />
      </I18nProvider>
    );

    fireEvent.press(screen.getByText('language_en')); // Press the current language button

    await waitFor(() => {
      expect(screen.getByText('language_ja')).toBeTruthy();
      expect(screen.getByText('language_es')).toBeTruthy();
      expect(screen.getByText('language_ar')).toBeTruthy();
    });
  });

  it('calls onLanguageChange and updates language when an option is selected', async () => {
    render(
      <I18nProvider>
        <LanguageSelector onLanguageChange={mockOnLanguageChange} />
      </I18nProvider>
    );

    fireEvent.press(screen.getByText('language_en')); // Open dropdown
    fireEvent.press(screen.getByText('language_ja')); // Select Japanese

    await waitFor(() => {
      expect(mockOnLanguageChange).toHaveBeenCalledWith('ja');
      // Simulate language change in mock
      (require('@/i18n').getLang as jest.Mock).mockReturnValue('ja');
    });

    // Rerender to reflect the change
    const { rerender } = render(
      <I18nProvider>
        <LanguageSelector onLanguageChange={mockOnLanguageChange} />
      </I18nProvider>
    );
    rerender(
      <I18nProvider>
        <LanguageSelector onLanguageChange={mockOnLanguageChange} />
      </I18nProvider>
    );

    expect(screen.getByText('language_ja')).toBeTruthy(); // New language should be displayed
    expect(screen.queryByText('language_en')).toBeNull(); // Old language should not be the main display
  });

  it('closes dropdown when an option is selected', async () => {
    render(
      <I18nProvider>
        <LanguageSelector onLanguageChange={mockOnLanguageChange} />
      </I18nProvider>
    );

    fireEvent.press(screen.getByText('language_en')); // Open dropdown
    expect(screen.getByText('language_ja')).toBeTruthy(); // Verify dropdown is open

    fireEvent.press(screen.getByText('language_ja')); // Select Japanese

    await waitFor(() => {
      expect(screen.queryByText('language_es')).toBeNull(); // Dropdown should be closed
    });
  });

  it('adjusts layout for RTL languages', async () => {
    (require('@/i18n').getIsRTL as jest.Mock).mockReturnValue(true);
    (require('@/i18n').getLang as jest.Mock).mockReturnValue('ar'); // Simulate Arabic as current language

    const { getByText } = render(
      <I18nProvider>
        <LanguageSelector onLanguageChange={mockOnLanguageChange} />
      </I18nProvider>
    );

    const currentLangButton = getByText('language_ar');
    expect(currentLangButton.parent?.props.style).toContainEqual(expect.objectContaining({ alignSelf: 'flex-end' }));

    fireEvent.press(currentLangButton); // Open dropdown

    await waitFor(() => {
      const dropdownItem = getByText('language_ja').parent;
      expect(dropdownItem?.props.style).toContainEqual(expect.objectContaining({ alignItems: 'flex-end' }));
    });
  });

  it('adjusts layout for LTR languages', async () => {
    (require('@/i18n').getIsRTL as jest.Mock).mockReturnValue(false);
    (require('@/i18n').getLang as jest.Mock).mockReturnValue('en');

    const { getByText } = render(
      <I18nProvider>
        <LanguageSelector onLanguageChange={mockOnLanguageChange} />
      </I18nProvider>
    );

    const currentLangButton = getByText('language_en');
    expect(currentLangButton.parent?.props.style).toContainEqual(expect.objectContaining({ alignSelf: 'flex-start' }));

    fireEvent.press(currentLangButton); // Open dropdown

    await waitFor(() => {
      const dropdownItem = getByText('language_ja').parent;
      expect(dropdownItem?.props.style).toContainEqual(expect.objectContaining({ alignItems: 'flex-start' }));
    });
  });
});
