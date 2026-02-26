import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import ParentLayout from './_layout';
import { I18nProvider } from '@/i18n/I18nProvider';
import { describe, it, expect, jest } from '@jest/globals';
import { Platform } from 'react-native';

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
  getIsRTL: jest.fn(() => false),
}));

describe('ParentLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading indicator when auth is loading', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
    });

    const { getByText, getByTestId } = render(
      <I18nProvider>
        <ParentLayout />
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
        <ParentLayout />
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
        <ParentLayout />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(Redirect).toHaveBeenCalledWith(expect.objectContaining({ href: '/page' }), {});
    });
  });

  it('renders parent stack screens if authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: 'parent-1', nickname: 'TestParent' },
    });

    const { getByText } = render(
      <I18nProvider>
        <ParentLayout />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(getByText('dashboard')).toBeTruthy();
      expect(getByText('child-details/[id]')).toBeTruthy();
    });
  });
});
