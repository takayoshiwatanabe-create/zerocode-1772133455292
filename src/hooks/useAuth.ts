import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Id } from "@/types";
import { t } from "@/i18n";
import { TranslationKeys } from "@/i18n/translations";

interface User {
  id: Id;
  email: string;
  nickname: string;
  role: "child" | "parent" | "admin";
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mfaRequired, setMfaRequired] = useState(false);

  // Simulate API calls
  const simulateApiCall = async (delay = 1000) => {
    return new Promise((resolve) => setTimeout(resolve, delay));
  };

  const loadUserFromStorage = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to load user from storage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setMfaRequired(false);
    setError(null); // Clear previous errors
    await simulateApiCall();

    // Mock authentication logic
    if (email === "parent@example.com" && password === "password123") {
      // Simulate MFA for parent
      setMfaRequired(true);
      setIsLoading(false);
      return;
    } else if (email === "child@example.com" && password === "password123") {
      const mockUser: User = { id: "child-1", email, nickname: "GameKid", role: "child" };
      await AsyncStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      setIsAuthenticated(true);
      setMfaRequired(false);
    } else if (email === "admin@example.com" && password === "password123") {
      const mockUser: User = { id: "admin-1", email, nickname: "Admin", role: "admin" };
      await AsyncStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      setIsAuthenticated(true);
      setMfaRequired(false);
    } else {
      throw new Error(t("auth_error_invalid_credentials" as TranslationKeys));
    }
    setIsLoading(false);
  };

  const signup = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null); // Clear previous errors
    await simulateApiCall();

    // Mock signup logic (always successful for now, creates a child user)
    if (email.includes("parent")) {
      throw new Error(t("signup_error_parent_registration" as TranslationKeys));
    }
    const mockUser: User = { id: `child-${Date.now()}`, email, nickname: email.split('@')[0], role: "child" };
    // In a real app, this would register the user on the backend
    // For now, we just simulate success and prompt for login
    console.log("Mock signup successful for:", mockUser);
    setIsLoading(false);
  };

  const verifyMfa = async (email: string, code: string) => {
    setIsLoading(true);
    setError(null); // Clear previous errors
    await simulateApiCall();

    // Mock MFA verification
    if (email === "parent@example.com" && code === "123456") {
      const mockUser: User = { id: "parent-1", email, nickname: "Parent", role: "parent" };
      await AsyncStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      setIsAuthenticated(true);
      setMfaRequired(false);
    } else {
      throw new Error(t("mfa_error_invalid_code" as TranslationKeys));
    }
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    await simulateApiCall(500);
    await AsyncStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    setMfaRequired(false);
    setIsLoading(false);
  };

  // Helper to set error, could be more sophisticated
  const [error, setError] = useState<string | null>(null);

  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    mfaRequired,
    login,
    signup,
    verifyMfa,
    logout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

