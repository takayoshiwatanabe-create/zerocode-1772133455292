import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { t } from "@/i18n";
import { Id, User } from "@/types";
import { TranslationKeys } from "@/i18n/translations";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  mfaRequired: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  verifyMfa: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [pendingMfaEmail, setPendingMfaEmail] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to load user from storage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setMfaRequired(false);
    setPendingMfaEmail(null);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock authentication logic
      if (email === "parent@example.com" && password === "password123") {
        // RULE-TECH-002: MFA for parent accounts
        setMfaRequired(true);
        setPendingMfaEmail(email);
        throw new Error(t("mfa_required_error" as TranslationKeys)); // Indicate MFA is needed
      } else if (email === "child@example.com" && password === "password123") {
        const mockUser: User = {
          id: "child-1",
          nickname: "GameKid",
          email: email,
          role: "child",
        };
        await AsyncStorage.setItem("user", JSON.stringify(mockUser));
        setUser(mockUser);
        setIsAuthenticated(true);
        setMfaRequired(false);
      } else if (email === "admin@example.com" && password === "adminpass") {
        // Mock admin user for parent dashboard access
        setMfaRequired(true);
        setPendingMfaEmail(email);
        throw new Error(t("mfa_required_error" as TranslationKeys));
      } else {
        throw new Error(t("login_error_invalid_credentials" as TranslationKeys));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock signup logic (e.g., check if email already exists)
      if (email === "child@example.com" || email === "parent@example.com" || email === "admin@example.com") {
        throw new Error(t("signup_error_email_exists" as TranslationKeys));
      }

      // RULE-SAFETY-001: Nickname registration only, no free text chat
      // For signup, we'll use a generic nickname or prompt for one later.
      // Here, we'll just use part of the email as a mock nickname.
      const nickname = email.split('@')[0];
      const mockUser: User = {
        id: `user-${Date.now()}`,
        nickname: nickname,
        email: email,
        role: "child", // Default to child role for new signups
      };
      // In a real app, this would create the user on the backend.
      // We don't auto-login after signup, but redirect to login.
      console.log("User signed up:", mockUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyMfa = useCallback(async (email: string, code: string) => {
    setIsLoading(true);
    try {
      // Simulate MFA verification
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (pendingMfaEmail === email && code === "123456") { // Mock MFA code
        let authenticatedUser: User;
        if (email === "parent@example.com") {
          authenticatedUser = {
            id: "parent-1",
            nickname: "ParentUser",
            email: email,
            role: "parent",
          };
        } else if (email === "admin@example.com") {
          authenticatedUser = {
            id: "admin-1",
            nickname: "AdminUser",
            email: email,
            role: "admin",
          };
        } else {
          throw new Error(t("mfa_error_invalid_email" as TranslationKeys));
        }

        await AsyncStorage.setItem("user", JSON.stringify(authenticatedUser));
        setUser(authenticatedUser);
        setIsAuthenticated(true);
        setMfaRequired(false);
        setPendingMfaEmail(null);
      } else {
        throw new Error(t("mfa_error_invalid_code" as TranslationKeys));
      }
    } finally {
      setIsLoading(false);
    }
  }, [pendingMfaEmail]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
      setMfaRequired(false);
      setPendingMfaEmail(null);
    } catch (error) {
      console.error("Failed to clear user from storage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    isAuthenticated,
    user,
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

