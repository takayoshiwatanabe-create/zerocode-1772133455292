import React from 'react';
import { render, screen } from '@testing-library/react-native';
import HomePage from './index';
import { I18nProvider } from '@/i18n/I18nProvider';
import { AuthProvider } from '@/hooks/useAuth';
import { describe, it, expect, jest } from '@jest/globals';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock useSafeAreaInsets
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
}));

// Mock AuthForm
jest.mock('@/components/auth/AuthForm', () => ({
  AuthForm: () => <></>, // Render nothing for AuthForm in this test
}));

// Mock i18n
jest.mock('@/i18n', () => ({
  t: jest.fn((key) => key),
  getIsRTL: jest.fn(() => false),
  getLang: jest.fn(() => 'en'),
}));

describe('HomePage (Native)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSafeAreaInsets as jest.Mock).mockReturnValue({ top: 10, bottom: 20, left: 0, right: 0 });
  });

  it('renders app name and welcome message', () => {
    render(
      <I18nProvider>
        <AuthProvider>
          <HomePage />
        </AuthProvider>
      </I18nProvider>
    );

    expect(screen.getByText('app_name')).toBeTruthy();
    expect(screen.getByText('welcome_message')).toBeTruthy();
  });

  it('applies safe area insets', () => {
    const { getByTestId } = render(
      <I18nProvider>
        <AuthProvider>
          <HomePage />
        </AuthProvider>
      </I18nProvider>
    );

    // The root View doesn't have a testID, so we'll check the styles applied to the container.
    // This is a bit indirect, but for native, style objects are usually merged.
    // We can check if the style prop contains the expected padding values.
    const rootContainer = screen.getByTestId('home-page-container'); // Add testID to the root View in index.tsx
    expect(rootContainer.props.style).toContainEqual(expect.objectContaining({ paddingTop: 10 }));
    expect(rootContainer.props.style).toContainEqual(expect.objectContaining({ paddingBottom: 20 }));
  });

  it('adjusts text alignment for RTL languages', () => {
    (require('@/i18n').getIsRTL as jest.Mock).mockReturnValue(true);

    const { getByText } = render(
      <I18nProvider>
        <AuthProvider>
          <HomePage />
        </AuthProvider>
      </I18nProvider>
    );

    const title = getByText('app_name');
    const subtitle = getByText('welcome_message');

    expect(title.props.style).toContainEqual(expect.objectContaining({ textAlign: 'right' }));
    expect(subtitle.props.style).toContainEqual(expect.objectContaining({ textAlign: 'right' }));
  });

  it('adjusts text alignment for LTR languages', () => {
    (require('@/i18n').getIsRTL as jest.Mock).mockReturnValue(false);

    const { getByText } = render(
      <I18nProvider>
        <AuthProvider>
          <HomePage />
        </AuthProvider>
      </I18nProvider>
    );

    const title = getByText('app_name');
    const subtitle = getByText('welcome_message');

    expect(title.props.style).toContainEqual(expect.objectContaining({ textAlign: 'left' }));
    expect(subtitle.props.style).toContainEqual(expect.objectContaining({ textAlign: 'left' }));
  });
});
