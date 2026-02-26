import { useState, useEffect, useCallback } from "react";
import { UserProfile } from "@/types";
import { t } from "@/i18n";
import { Platform } from "react-native";

// Extend UserProfile to include MFA status
interface AuthUserProfile extends UserProfile {
  mfaEnabled: boolean;
}

// Mock API calls
const mockApi = {
  login: async (email: string, password: string): Promise<{ user: AuthUserProfile; token: string; mfaRequired?: boolean }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "parent@example.com" && password === "Password123!") {
          // Simulate MFA required for this user
          resolve({
            user: { id: "parent-1", nickname: "ParentUser", language: "en", mfaEnabled: true },
            token: "mock-token-parent",
            mfaRequired: true,
          });
        } else if (email === "admin@example.com" && password === "AdminPass!") {
          resolve({
            user: { id: "admin-1", nickname: "AdminUser", language: "ja", mfaEnabled: false },
            token: "mock-token-admin",
            mfaRequired: false,
          });
        } else if (email === "child@example.com" && password === "ChildPass123!") {
          resolve({
            user: { id: "child-1", nickname: "GamePlayer", language: "en", mfaEnabled: false },
            token: "mock-token-child",
            mfaRequired: false,
          });
        }
        else {
          reject(new Error(t("auth_error_invalid_credentials")));
        }
      }, 1000);
    });
  },

  signup: async (email: string, password: string): Promise<{ user: AuthUserProfile; token: string }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "existing@example.com") {
          reject(new Error(t("auth_error_email_exists")));
        } else {
          resolve({
            user: { id: `user-${Date.now()}`, nickname: `NewUser${Date.now()}`, language: "en", mfaEnabled: false },
            token: `mock-token-newuser-${Date.now()}`,
          });
        }
      }, 1000);
    });
  },

  verifyMfa: async (email: string, code: string): Promise<{ user: AuthUserProfile; token: string }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "parent@example.com" && code === "123456") {
          resolve({
            user: { id: "parent-1", nickname: "ParentUser", language: "en", mfaEnabled: true },
            token: "mock-token-parent-mfa-verified",
          });
        } else {
          reject(new Error(t("mfa_error_invalid_code")));
        }
      }, 1000);
    });
  },

  logout: async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  },
};


interface AuthState {
  isAuthenticated: boolean;
  user: AuthUserProfile | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  mfaRequired: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null,
  mfaRequired: false,
};

export function useAuth() {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        let storedToken: string | null = null;
        let storedUser: string | null = null;

        if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
          storedToken = localStorage.getItem("authToken");
          storedUser = localStorage.getItem("authUser");
        }
        // For React Native, AsyncStorage would be used here.
        // As per spec: "Persistent storage (e.g., AsyncStorage) is not implemented in this mock for RN, but noted as a future consideration."
        // So, for RN, storedToken and storedUser will remain null in this mock.

        if (storedToken && storedUser) {
          const user = JSON.parse(storedUser) as AuthUserProfile;
          setState((prevState) => ({
            ...prevState,
            isAuthenticated: true,
            user,
            token: storedToken,
          }));
        }
      } catch (e) {
        console.error("Failed to load auth state from storage", e);
        if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("authUser");
        }
      }
    };
    loadAuthState();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState((prevState) => ({ ...prevState, isLoading: true, error: null, mfaRequired: false }));
    try {
      const { user, token, mfaRequired } = await mockApi.login(email, password);
      if (mfaRequired) {
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
          user,
          mfaRequired: true,
          error: null,
        }));
      } else {
        if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem("authToken", token);
          localStorage.setItem("authUser", JSON.stringify(user));
        }
        setState((prevState) => ({
          ...prevState,
          isAuthenticated: true,
          user,
          token,
          isLoading: false,
          mfaRequired: false,
        }));
      }
    } catch (err: any) {
      setState((prevState) => ({
        ...prevState,
        error: err.message,
        isLoading: false,
        mfaRequired: false,
      }));
      throw err;
    }
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    setState((prevState) => ({ ...prevState, isLoading: true, error: null }));
    try {
      await mockApi.signup(email, password);
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        error: null,
      }));
    } catch (err: any) {
      setState((prevState) => ({
        ...prevState,
        error: err.message,
        isLoading: false,
      }));
      throw err;
    }
  }, []);

  const verifyMfa = useCallback(async (email: string, code: string) => {
    setState((prevState) => ({ ...prevState, isLoading: true, error: null }));
    try {
      const { user, token } = await mockApi.verifyMfa(email, code);
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("authUser", JSON.stringify(user));
      }
      setState((prevState) => ({
        ...prevState,
        isAuthenticated: true,
        user,
        token,
        isLoading: false,
        mfaRequired: false,
      }));
    } catch (err: any) {
      setState((prevState) => ({
        ...prevState,
        error: err.message,
        isLoading: false,
      }));
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    setState((prevState) => ({ ...prevState, isLoading: true, error: null }));
    try {
      await mockApi.logout();
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
      }
      setState(initialState);
    } catch (err: any) {
      setState((prevState) => ({
        ...prevState,
        error: err.message,
        isLoading: false,
      }));
    }
  }, []);

  return {
    ...state,
    login,
    signup,
    verifyMfa,
    logout,
  };
}


