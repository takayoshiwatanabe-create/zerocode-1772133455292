import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { AuthForm } from './AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { I18nProvider } from '@/i18n/I18nProvider';
import { describe, it, expect, jest } from '@jest/globals';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

// Mock useAuth hook
jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

// Mock i18n
jest.mock('@/i18n', () => ({
  t: jest.fn((key) => key),
  getIsRTL: jest.fn(() => false),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    replace: jest.fn(),
  })),
}));

describe('AuthForm', () => {
  const mockLogin = jest.fn();
  const mockSignup = jest.fn();
  const mockVerifyMfa = jest.fn();
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      signup: mockSignup,
      verifyMfa: mockVerifyMfa,
      isLoading: false,
      isAuthenticated: false,
      user: null,
      mfaRequired: false,
    });
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
    });
  });

  it('renders login form by default', () => {
    render(
      <I18nProvider>
        <AuthForm />
      </I18nProvider>
    );

    expect(screen.getByText('login_title')).toBeTruthy();
    expect(screen.getByLabelText('email_label')).toBeTruthy();
    expect(screen.getByLabelText('password_label')).toBeTruthy();
    expect(screen.getByText('login_button')).toBeTruthy();
    expect(screen.getByText('no_account_signup')).toBeTruthy();
  });

  it('switches to signup mode when "no_account_signup" is pressed', () => {
    render(
      <I18nProvider>
        <AuthForm />
      </I18nProvider>
    );

    fireEvent.press(screen.getByText('no_account_signup'));

    expect(screen.getByText('signup_title')).toBeTruthy();
    expect(screen.getByText('signup_button')).toBeTruthy();
    expect(screen.getByText('have_account_login')).toBeTruthy();
  });

  it('handles successful login and redirects game user', async () => {
    mockLogin.mockResolvedValueOnce({});
    (useAuth as jest.Mock).mockReturnValueOnce({
      login: mockLogin,
      signup: mockSignup,
      verifyMfa: mockVerifyMfa,
      isLoading: false,
      isAuthenticated: true,
      user: { id: 'child-1', nickname: 'TestChild' },
      mfaRequired: false,
    });

    render(
      <I18nProvider>
        <AuthForm />
      </I18nProvider>
    );

    fireEvent.changeText(screen.getByLabelText('email_label'), 'child@example.com');
    fireEvent.changeText(screen.getByLabelText('password_label'), 'password123');
    fireEvent.press(screen.getByText('login_button'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('child@example.com', 'password123');
      expect(screen.getByText('auth_success_welcome')).toBeTruthy();
      expect(mockReplace).toHaveBeenCalledWith('/(game)/home');
    });
  });

  it('handles successful login and redirects parent user', async () => {
    mockLogin.mockResolvedValueOnce({});
    (useAuth as jest.Mock).mockReturnValueOnce({
      login: mockLogin,
      signup: mockSignup,
      verifyMfa: mockVerifyMfa,
      isLoading: false,
      isAuthenticated: true,
      user: { id: 'parent-1', nickname: 'TestParent' },
      mfaRequired: false,
    });

    render(
      <I18nProvider>
        <AuthForm />
      </I18nProvider>
    );

    fireEvent.changeText(screen.getByLabelText('email_label'), 'parent@example.com');
    fireEvent.changeText(screen.getByLabelText('password_label'), 'password123');
    fireEvent.press(screen.getByText('login_button'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('parent@example.com', 'password123');
      expect(screen.getByText('auth_success_welcome')).toBeTruthy();
      expect(mockReplace).toHaveBeenCalledWith('/(parent)/dashboard');
    });
  });

  it('handles login error', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));

    render(
      <I18nProvider>
        <AuthForm />
      </I18nProvider>
    );

    fireEvent.changeText(screen.getByLabelText('email_label'), 'test@example.com');
    fireEvent.changeText(screen.getByLabelText('password_label'), 'wrongpassword');
    fireEvent.press(screen.getByText('login_button'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
      expect(screen.getByText('Invalid credentials')).toBeTruthy();
    });
  });

  it('handles successful signup', async () => {
    mockSignup.mockResolvedValueOnce({});
    render(
      <I18nProvider>
        <AuthForm />
      </I18nProvider>
    );

    fireEvent.press(screen.getByText('no_account_signup'));
    fireEvent.changeText(screen.getByLabelText('email_label'), 'new@example.com');
    fireEvent.changeText(screen.getByLabelText('password_label'), 'newpassword');
    fireEvent.press(screen.getByText('signup_button'));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith('new@example.com', 'newpassword');
      expect(screen.getByText('signup_success')).toBeTruthy();
      expect(screen.getByText('login_title')).toBeTruthy(); // Should switch back to login
    });
  });

  it('handles signup error', async () => {
    mockSignup.mockRejectedValueOnce(new Error('Email already in use'));
    render(
      <I18nProvider>
        <AuthForm />
      </I18nProvider>
    );

    fireEvent.press(screen.getByText('no_account_signup'));
    fireEvent.changeText(screen.getByLabelText('email_label'), 'existing@example.com');
    fireEvent.changeText(screen.getByLabelText('password_label'), 'password');
    fireEvent.press(screen.getByText('signup_button'));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith('existing@example.com', 'password');
      expect(screen.getByText('Email already in use')).toBeTruthy();
    });
  });

  it('switches to MFA mode when mfaRequired is true', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      signup: mockSignup,
      verifyMfa: mockVerifyMfa,
      isLoading: false,
      isAuthenticated: false,
      user: null,
      mfaRequired: true,
    });

    render(
      <I18nProvider>
        <AuthForm />
      </I18nProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('mfa_title')).toBeTruthy();
      expect(screen.getByLabelText('mfa_code_label')).toBeTruthy();
      expect(screen.getByText('mfa_verify_button')).toBeTruthy();
      expect(screen.getByText('mfa_prompt_code')).toBeTruthy();
    });
  });

  it('handles successful MFA verification', async () => {
    mockVerifyMfa.mockResolvedValueOnce({});
    (useAuth as jest.Mock).mockReturnValueOnce({
      login: mockLogin,
      signup: mockSignup,
      verifyMfa: mockVerifyMfa,
      isLoading: false,
      isAuthenticated: false,
      user: null,
      mfaRequired: true,
    }).mockReturnValueOnce({ // Simulate post-MFA state
      login: mockLogin,
      signup: mockSignup,
      verifyMfa: mockVerifyMfa,
      isLoading: false,
      isAuthenticated: true,
      user: { id: 'child-1', nickname: 'TestChild' },
      mfaRequired: false,
    });

    render(
      <I18nProvider>
        <AuthForm />
      </I18nProvider>
    );

    fireEvent.changeText(screen.getByLabelText('mfa_code_label'), '123456');
    fireEvent.press(screen.getByText('mfa_verify_button'));

    await waitFor(() => {
      expect(mockVerifyMfa).toHaveBeenCalledWith(expect.any(String), '123456'); // Email is passed implicitly
      expect(screen.getByText('mfa_success')).toBeTruthy();
      expect(mockReplace).toHaveBeenCalledWith('/(game)/home');
    });
  });

  it('handles MFA verification error', async () => {
    mockVerifyMfa.mockRejectedValueOnce(new Error('Invalid MFA code'));
    (useAuth as jest.Mock).mockReturnValueOnce({
      login: mockLogin,
      signup: mockSignup,
      verifyMfa: mockVerifyMfa,
      isLoading: false,
      isAuthenticated: false,
      user: null,
      mfaRequired: true,
    });

    render(
      <I18nProvider>
        <AuthForm />
      </I18nProvider>
    );

    fireEvent.changeText(screen.getByLabelText('mfa_code_label'), '000000');
    fireEvent.press(screen.getByText('mfa_verify_button'));

    await waitFor(() => {
      expect(mockVerifyMfa).toHaveBeenCalledWith(expect.any(String), '000000');
      expect(screen.getByText('Invalid MFA code')).toBeTruthy();
    });
  });

  it('disables buttons and inputs when loading', () => {
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      signup: mockSignup,
      verifyMfa: mockVerifyMfa,
      isLoading: true,
      isAuthenticated: false,
      user: null,
      mfaRequired: false,
    });

    render(
      <I18nProvider>
        <AuthForm />
      </I18nProvider>
    );

    expect(screen.getByLabelText('email_label')).toBeDisabled();
    expect(screen.getByLabelText('password_label')).toBeDisabled();
    expect(screen.getByText('login_button')).toBeDisabled();
    expect(screen.getByText('no_account_signup')).toBeDisabled();
  });

  it('adjusts text alignment for RTL languages', () => {
    (require('@/i18n').getIsRTL as jest.Mock).mockReturnValue(true);

    const { getByText, getByLabelText } = render(
      <I18nProvider>
        <AuthForm />
      </I18nProvider>
    );

    expect(getByText('login_title').props.style).toContainEqual(expect.objectContaining({ textAlign: 'right' }));
    expect(getByLabelText('email_label').props.style).toContainEqual(expect.objectContaining({ textAlign: 'right' }));
    expect(getByLabelText('password_label').props.style).toContainEqual(expect.objectContaining({ textAlign: 'right' }));
    expect(getByText('email_label').props.style).toContainEqual(expect.objectContaining({ textAlign: 'right' }));
    expect(getByText('password_label').props.style).toContainEqual(expect.objectContaining({ textAlign: 'right' }));
  });

  it('adjusts text alignment for LTR languages', () => {
    (require('@/i18n').getIsRTL as jest.Mock).mockReturnValue(false);

    const { getByText, getByLabelText } = render(
      <I18nProvider>
        <AuthForm />
      </I18nProvider>
    );

    expect(getByText('login_title').props.style).toContainEqual(expect.objectContaining({ textAlign: 'left' }));
    expect(getByLabelText('email_label').props.style).toContainEqual(expect.objectContaining({ textAlign: 'left' }));
    expect(getByLabelText('password_label').props.style).toContainEqual(expect.objectContaining({ textAlign: 'left' }));
    expect(getByText('email_label').props.style).toContainEqual(expect.objectContaining({ textAlign: 'left' }));
    expect(getByText('password_label').props.style).toContainEqual(expect.objectContaining({ textAlign: 'left' }));
  });
});
