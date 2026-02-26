import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAuth, AuthProvider } from './useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import React from 'react';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null); // Default to no stored user
  });

  it('should return initial loading state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });

  it('should load user from AsyncStorage on mount', async () => {
    const mockUser = { id: 'test-user', nickname: 'TestUser' };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('user');
  });

  it('should handle login successfully for game user', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.login('child@example.com', 'password');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual({ id: 'child-1', nickname: 'ChildUser' });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify({ id: 'child-1', nickname: 'ChildUser' }));
    });
  });

  it('should handle login successfully for parent user', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.login('parent@example.com', 'password');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual({ id: 'parent-1', nickname: 'ParentUser' });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify({ id: 'parent-1', nickname: 'ParentUser' }));
    });
  });

  it('should handle login failure', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await expect(result.current.login('invalid@example.com', 'wrong')).rejects.toThrow('Invalid credentials');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user');
    });
  });

  it('should handle signup successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.signup('new@example.com', 'newpassword');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(false); // Signup doesn't auto-login
      expect(result.current.user).toBe(null);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user'); // Ensure no user is stored after signup
    });
  });

  it('should handle signup failure (email already exists)', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await expect(result.current.signup('child@example.com', 'password')).rejects.toThrow('Email already registered');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
    });
  });

  it('should handle logout', async () => {
    const mockUser = { id: 'test-user', nickname: 'TestUser' };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    await act(async () => {
      await result.current.logout();
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('user');
    });
  });

  it('should set mfaRequired to true on MFA login', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.login('mfa@example.com', 'password');
    });

    await waitFor(() => {
      expect(result.current.mfaRequired).toBe(true);
      expect(result.current.isAuthenticated).toBe(false); // Not authenticated until MFA verified
    });
  });

  it('should verify MFA successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    // First, trigger MFA required state
    await act(async () => {
      await result.current.login('mfa@example.com', 'password');
    });
    await waitFor(() => expect(result.current.mfaRequired).toBe(true));

    // Then, verify MFA
    await act(async () => {
      await result.current.verifyMfa('mfa@example.com', '123456');
    });

    await waitFor(() => {
      expect(result.current.mfaRequired).toBe(false);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual({ id: 'mfa-user-1', nickname: 'MFAUser' });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify({ id: 'mfa-user-1', nickname: 'MFAUser' }));
    });
  });

  it('should handle MFA verification failure', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    // First, trigger MFA required state
    await act(async () => {
      await result.current.login('mfa@example.com', 'password');
    });
    await waitFor(() => expect(result.current.mfaRequired).toBe(true));

    // Then, attempt to verify MFA with wrong code
    await act(async () => {
      await expect(result.current.verifyMfa('mfa@example.com', '000000')).rejects.toThrow('Invalid MFA code');
    });

    await waitFor(() => {
      expect(result.current.mfaRequired).toBe(true); // Still requires MFA
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
    });
  });
});
