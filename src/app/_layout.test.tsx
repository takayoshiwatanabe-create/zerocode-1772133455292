import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import RootLayout from './_layout';
import { I18nProvider } from '@/i18n/I18nProvider';
import { AuthProvider } from '@/hooks/useAuth';
import { GameEconomyProvider } from '@/hooks/useGameEconomy';
import { describe, it, expect, jest } from '@jest/globals';
import { Platform, I18nManager } from 'react-native';

// Mock expo-router
jest.mock('expo-router', () => ({
  Stack: {
    Screen: ({ name, options }: any) => <>{name}</>,
  },
  useRouter: jest.fn(() => ({
    replace: jest.fn(),
  })),
}));

// Mock i18n
jest.mock('@/i18n', () => ({
  t: jest.fn((key) => key),
  getIsRTL: jest.fn(() => false), // Default to LTR
  getLang: jest.fn(() => 'en'),
}));

// Mock I18nManager for native
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Platform: {
      ...RN.Platform,
      OS: 'ios', // Default to native for I18nManager tests
    },
    I18nManager: {
      isRTL: false,
      forceRTL: jest.fn(),
      allowRTL: jest.fn(),
    },
  };
});

// Mock SafeAreaProvider and StatusBar
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: any) => <>{children}</>,
}));
jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

// Mock AuthProvider and GameEconomyProvider to render children directly
jest.mock('@/hooks/useAuth', () => ({
  AuthProvider: ({ children }: any) => <>{children}</>,
  useAuth: jest.fn(() => ({
    isAuthenticated: false,
    isLoading: false,
    user: null,
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
    verifyMfa: jest.fn(),
    mfaRequired: false,
  })),
}));
jest.mock('@/hooks/useGameEconomy', () => ({
  GameEconomyProvider: ({ children }: any) => <>{children}</>,
  useGameEconomy: jest.fn(() => ({
    playerPoints: 0,
    updatePlayerPoints: jest.fn(),
    adsWatchedToday: 0,
    canWatchAd: true,
    watchAd: jest.fn(),
    isLoading: false,
  })),
}));

describe('RootLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (I18nManager.forceRTL as jest.Mock).mockClear();
    (I18nManager.allowRTL as jest.Mock).mockClear();
    (I18nManager as any).isRTL = false; // Reset I18nManager state
  });

  it('renders all providers and stack screens', async () => {
    const { getByText } = render(<RootLayout />);

    await waitFor(() => {
      expect(getByText('index')).toBeTruthy();
      expect(getByText('page')).toBeTruthy();
      expect(getByText('(parent)')).toBeTruthy();
      expect(getByText('(game)')).toBeTruthy();
      expect(getByText('(settings)')).toBeTruthy();
    });
  });

  it('calls I18nManager.forceRTL and allowRTL when isRTL changes on native', async () => {
    Platform.OS = 'ios';
    (require('@/i18n').getIsRTL as jest.Mock).mockReturnValue(false); // Initial LTR
    const { rerender } = render(<RootLayout />);

    expect(I18nManager.forceRTL).not.toHaveBeenCalled();
    expect(I18nManager.allowRTL).not.toHaveBeenCalled();

    // Simulate language change to RTL
    (require('@/i18n').getIsRTL as jest.Mock).mockReturnValue(true);
    rerender(<RootLayout />);

    await waitFor(() => {
      expect(I18nManager.forceRTL).toHaveBeenCalledWith(true);
      expect(I18nManager.allowRTL).toHaveBeenCalledWith(true);
    });
  });

  it('does not call I18nManager functions if isRTL is already correct on native', async () => {
    Platform.OS = 'ios';
    (I18nManager as any).isRTL = true; // Simulate initial RTL
    (require('@/i18n').getIsRTL as jest.Mock).mockReturnValue(true);
    render(<RootLayout />);

    await waitFor(() => {
      expect(I18nManager.forceRTL).not.toHaveBeenCalled();
      expect(I18nManager.allowRTL).not.toHaveBeenCalled();
    });
  });

  it('does not call I18nManager functions on web', async () => {
    Platform.OS = 'web';
    (require('@/i18n').getIsRTL as jest.Mock).mockReturnValue(true);
    render(<RootLayout />);

    await waitFor(() => {
      expect(I18nManager.forceRTL).not.toHaveBeenCalled();
      expect(I18nManager.allowRTL).not.toHaveBeenCalled();
    });
  });
});

