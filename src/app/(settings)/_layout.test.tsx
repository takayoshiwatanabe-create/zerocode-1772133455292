import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import SettingsLayout from './_layout';
import { I18nProvider } from '@/i18n/I18nProvider';
import { describe, it, expect, jest } from '@jest/globals';
import { Platform, I18nManager } from 'react-native';

// Mock expo-router
jest.mock('expo-router', () => ({
  Stack: {
    Screen: ({ name, options }: any) => <>{name}</>,
    Group: ({ children }: any) => <>{children}</>,
  },
  Redirect: jest.fn(() => null), // Mock Redirect component
  useRouter: jest.fn(() => ({
    replace: jest.fn(),
  })),
}));

// Mock useAuth hook
jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

// Mock i18n
jest.mock('@/i18n', () => ({
  t: jest.fn((key) => key),
  getIsRTL: jest.fn(() => false), // Default to LTR
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

describe('SettingsLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (I18nManager.forceRTL as jest.Mock).mockClear();
    (I18nManager.allowRTL as jest.Mock).mockClear();
    (I18nManager as any).isRTL = false; // Reset I18nManager state
  });

  it('renders loading indicator when auth is loading', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
    });

    const { getByText, getByTestId } = render(
      <I18nProvider>
        <SettingsLayout />
      </I18nProvider>
    );

    expect(getByText('loading')).toBeTruthy();
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('redirects to login if not authenticated (native)', async () => {
    Platform.OS = 'ios'; // Simulate native
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });

    render(
      <I18nProvider>
        <SettingsLayout />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(Redirect).toHaveBeenCalledWith(expect.objectContaining({ href: '/' }), {});
    });
  });

  it('redirects to login if not authenticated (web)', async () => {
    Platform.OS = 'web'; // Simulate web
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });

    render(
      <I18nProvider>
        <SettingsLayout />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(Redirect).toHaveBeenCalledWith(expect.objectContaining({ href: '/page' }), {});
    });
  });

  it('renders settings stack screen if authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: 'user-1', nickname: 'TestUser' },
    });

    const { getByText } = render(
      <I18nProvider>
        <SettingsLayout />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(getByText('settings')).toBeTruthy();
    });
  });

  it('calls I18nManager.forceRTL and allowRTL when isRTL changes on native', async () => {
    Platform.OS = 'ios';
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: 'user-1', nickname: 'TestUser' },
    });

    // Simulate initial render with LTR
    (I18nManager as any).isRTL = false;
    (require('@/i18n').getIsRTL as jest.Mock).mockReturnValue(false);
    const { rerender } = render(
      <I18nProvider>
        <SettingsLayout />
      </I18nProvider>
    );

    expect(I18nManager.forceRTL).not.toHaveBeenCalled();
    expect(I18nManager.allowRTL).not.toHaveBeenCalled();

    // Simulate language change to RTL
    (require('@/i18n').getIsRTL as jest.Mock).mockReturnValue(true);
    rerender(
      <I18nProvider>
        <SettingsLayout />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(I18nManager.forceRTL).toHaveBeenCalledWith(true);
      expect(I18nManager.allowRTL).toHaveBeenCalledWith(true);
    });
  });

  it('does not call I18nManager functions if isRTL is already correct on native', async () => {
    Platform.OS = 'ios';
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: 'user-1', nickname: 'TestUser' },
    });

    // Simulate initial render with RTL
    (I18nManager as any).isRTL = true;
    (require('@/i18n').getIsRTL as jest.Mock).mockReturnValue(true);
    render(
      <I18nProvider>
        <SettingsLayout />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(I18nManager.forceRTL).not.toHaveBeenCalled();
      expect(I18nManager.allowRTL).not.toHaveBeenCalled();
    });
  });

  it('does not call I18nManager functions on web', async () => {
    Platform.OS = 'web';
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: 'user-1', nickname: 'TestUser' },
    });

    render(
      <I18nProvider>
        <SettingsLayout />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(I18nManager.forceRTL).not.toHaveBeenCalled();
      expect(I18nManager.allowRTL).not.toHaveBeenCalled();
    });
  });
});

