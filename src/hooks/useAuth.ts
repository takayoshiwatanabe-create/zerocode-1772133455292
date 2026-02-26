import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { useRouter } from "expo-router";
import { t } from "@/i18n";
import { TranslationKeys } from "@/i18n/translations";

interface User {
  id: string;
  email: string;
  nickname: string;
  role: "child" | "parent" | "admin";
  // Add other user-specific data as needed
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  mfaRequired: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  verifyMfa: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "auth_user";
const TOKEN_STORAGE_KEY = "auth_token";
const MFA_REQUIRED_KEY = "mfa_required";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const router = useRouter();

  const loadUserFromStorage = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      const storedMfaRequired = await AsyncStorage.getItem(MFA_REQUIRED_KEY);

      if (storedUser && storedToken) {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setMfaRequired(storedMfaRequired === "true");
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setMfaRequired(false);
      }
    } catch (error) {
      console.error("Failed to load user from storage:", error);
      setUser(null);
      setIsAuthenticated(false);
      setMfaRequired(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  const saveAuthData = async (userData: User, token: string, requiresMfa: boolean = false) => {
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
    await AsyncStorage.setItem(MFA_REQUIRED_KEY, String(requiresMfa));
    setUser(userData);
    setIsAuthenticated(true);
    setMfaRequired(requiresMfa);
  };

  const clearAuthData = async () => {
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    await AsyncStorage.removeItem(MFA_REQUIRED_KEY);
    setUser(null);
    setIsAuthenticated(false);
    setMfaRequired(false);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (email === "parent@example.com" && password === "password") {
        // Mock parent user requiring MFA
        setMfaRequired(true);
        await saveAuthData({ id: "parent-1", email, nickname: "Parent", role: "parent" }, "mock-parent-token", true);
        throw new Error(t("mfa_prompt_code" as TranslationKeys)); // Indicate MFA is required
      } else if (email === "child@example.com" && password === "password") {
        // Mock child user
        await saveAuthData({ id: "child-1", email, nickname: "Kiddo", role: "child" }, "mock-child-token");
      } else if (email === "admin@example.com" && password === "password") {
        // Mock admin user
        setMfaRequired(true);
        await saveAuthData({ id: "admin-1", email, nickname: "Admin", role: "admin" }, "mock-admin-token", true);
        throw new Error(t("mfa_prompt_code" as TranslationKeys)); // Indicate MFA is required
      } else {
        throw new Error(t("auth_error_invalid_credentials" as TranslationKeys));
      }
    } catch (error: any) {
      if (error.message === t("mfa_prompt_code" as TranslationKeys)) {
        setMfaRequired(true);
        // Do not clear user/token, keep it for MFA verification step
        // The user object might be partially set to indicate who is trying to log in
        setUser({ id: email, email, nickname: email.split('@')[0], role: "child" }); // Temporary user for MFA context
      } else {
        setError(error.message);
        clearAuthData(); // Clear any partial data if login fails
      }
      throw error; // Re-throw to be caught by AuthForm
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (email.includes("parent")) {
        throw new Error(t("signup_error_parent_not_allowed" as TranslationKeys));
      }
      // For children, no MFA on signup for simplicity in mock
      const newNickname = email.split('@')[0]; // Simple nickname from email
      await saveAuthData({ id: `user-${Date.now()}`, email, nickname: newNickname, role: "child" }, "mock-new-user-token");
    } catch (error: any) {
      setError(error.message);
      clearAuthData();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyMfa = async (email: string, code: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      if (code === "123456") { // Mock MFA code
        // Re-authenticate the user with full details after MFA
        let verifiedUser: User;
        let token: string;
        if (email === "parent@example.com") {
          verifiedUser = { id: "parent-1", email, nickname: "Parent", role: "parent" };
          token = "mock-parent-token-verified";
        } else if (email === "admin@example.com") {
          verifiedUser = { id: "admin-1", email, nickname: "Admin", role: "admin" };
          token = "mock-admin-token-verified";
        } else {
          throw new Error(t("mfa_error_user_not_found" as TranslationKeys));
        }
        await saveAuthData(verifiedUser, token, false); // MFA no longer required
      } else {
        throw new Error(t("mfa_error_invalid_code" as TranslationKeys));
      }
    } catch (error: any) {
      setError(error.message);
      // If MFA fails, keep mfaRequired true so user can retry
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await clearAuthData();
      // Redirect to login page
      router.replace(Platform.OS === 'web' ? "/page" : "/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper for setting error messages
  const setError = (message: string) => {
    // In a real app, you might use a toast notification system
    console.error("Auth Error:", message);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    mfaRequired,
    login,
    signup,
    verifyMfa,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
