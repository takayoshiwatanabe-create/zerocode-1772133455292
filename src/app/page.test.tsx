import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from './page';
import { I18nProvider } from '@/i18n/I18nProvider';
import { AuthProvider } from '@/hooks/useAuth';
import { describe, it, expect, jest } from '@jest/globals';

// Mock AuthForm
jest.mock('@/components/auth/AuthForm', () => ({
  AuthForm: () => <div data-testid="auth-form" />,
}));

// Mock i18n
jest.mock('@/i18n', () => ({
  t: jest.fn((key) => key),
  getIsRTL: jest.fn(() => false),
  getLang: jest.fn(() => 'en'),
}));

describe('HomePage (Web)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders app name and welcome message', () => {
    render(
      <I18nProvider>
        <AuthProvider>
          <HomePage />
        </AuthProvider>
      </I18nProvider>
    );

    expect(screen.getByText('app_name')).toBeInTheDocument();
    expect(screen.getByText('welcome_message')).toBeInTheDocument();
    expect(screen.getByTestId('auth-form')).toBeInTheDocument();
  });

  it('applies text-right class for RTL languages', () => {
    (require('@/i18n').getIsRTL as jest.Mock).mockReturnValue(true);

    render(
      <I18nProvider>
        <AuthProvider>
          <HomePage />
        </AuthProvider>
      </I18nProvider>
    );

    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass('text-right');
    expect(mainElement).not.toHaveClass('text-left');
  });

  it('applies text-left class for LTR languages', () => {
    (require('@/i18n').getIsRTL as jest.Mock).mockReturnValue(false);

    render(
      <I18nProvider>
        <AuthProvider>
          <HomePage />
        </AuthProvider>
      </I18nProvider>
    );

    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass('text-left');
    expect(mainElement).not.toHaveClass('text-right');
  });
});
