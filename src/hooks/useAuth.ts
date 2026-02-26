import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Id, User, UserRole } from "@/types";
import { t } from "@/i18n";
import { TranslationKeys } from "@/i18n/translations";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  mfaRequired: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  verifyMfa: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mfaRequired, setMfaRequired] = useState<boolean>(false);
  const [pendingMfaEmail, setPendingMfaEmail] = useState<string | null>(null);

  const loadUserFromStorage = useCallback(async () => {
    try {
      setIsLoading(true);
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error("Failed to load user from storage", e);
      setError(t("auth_error_load_user" as TranslationKeys));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  const saveUserToStorage = async (userData: User) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
    } catch (e) {
      console.error("Failed to save user to storage", e);
      setError(t("auth_error_save_user" as TranslationKeys));
    }
  };

  const removeUserFromStorage = async () => {
    try {
      await AsyncStorage.removeItem("user");
    } catch (e) {
      console.error("Failed to remove user from storage", e);
      setError(t("auth_error_remove_user" as TranslationKeys));
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    setMfaRequired(false);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (email === "parent@example.com" && password === "password123") {
        // Simulate MFA requirement for parent accounts (RULE-TECH-002)
        setMfaRequired(true);
        setPendingMfaEmail(email);
        setSuccessMessage(t("mfa_prompt_code" as TranslationKeys));
        return;
      }

      if (email === "child@example.com" && password === "password123") {
        const mockUser: User = {
          id: "child-1",
          nickname: "KidPlayer",
          email: email,
          role: UserRole.Child,
          avatarUrl: "https://via.placeholder.com/150",
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        await saveUserToStorage(mockUser);
      } else if (email === "admin@example.com" && password === "admin123") {
        const mockUser: User = {
          id: "admin-1",
          nickname: "AdminUser",
          email: email,
          role: UserRole.Parent, // Admin also uses parent dashboard
          avatarUrl: "https://via.placeholder.com/150",
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        await saveUserToStorage(mockUser);
      }
      else {
        throw new Error(t("auth_error_invalid_credentials" as TranslationKeys));
      }
    } catch (err: any) {
      setError(err.message);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (email === "parent@example.com" || email === "child@example.com" || email === "admin@example.com") {
        throw new Error(t("auth_error_email_exists" as TranslationKeys));
      }

      // Simulate successful signup, then redirect to login
      // In a real app, this would create a user in the backend.
      // For children, nickname registration would follow (RULE-SAFETY-001).
      console.log(`User signed up: ${email}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyMfa = useCallback(async (email: string, code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call for MFA verification
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (email === pendingMfaEmail && code === "123456") { // Mock MFA code
        const mockUser: User = {
          id: "parent-1",
          nickname: "ParentUser",
          email: email,
          role: UserRole.Parent,
          avatarUrl: "https://via.placeholder.com/150",
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        setMfaRequired(false);
        setPendingMfaEmail(null);
        await saveUserToStorage(mockUser);
      } else {
        throw new Error(t("mfa_error_invalid_code" as TranslationKeys));
      }
    } catch (err: any) {
      setError(err.message);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [pendingMfaEmail]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call for logout
      await new Promise((resolve) => setTimeout(resolve, 500));
      await removeUserFromStorage();
      setUser(null);
      setIsAuthenticated(false);
      setMfaRequired(false);
      setPendingMfaEmail(null);
    } catch (err: any) {
      setError(err.message || t("auth_error_logout_failed" as TranslationKeys));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        error,
        mfaRequired,
        login,
        signup,
        verifyMfa,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
function setSuccessMessage(arg0: string) {
  throw new Error("Function not implemented.");
}

