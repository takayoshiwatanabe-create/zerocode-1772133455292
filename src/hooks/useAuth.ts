import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { UserProfile } from "@/types";
import { t } from "@/i18n";
import { Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TranslationKeys } from "@/i18n/translations";

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
          reject(new Error(t("auth_error_invalid_credentials" as TranslationKeys)));
        }
      }, 1000);
    });
  },

  signup: async (email: string, password: string): Promise<{ user: AuthUserProfile; token: string }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "existing@example.com") {
          reject(new Error(t("auth_error_email_exists" as TranslationKeys)));
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
          reject(new Error(t("mfa_error_invalid_code" as TranslationKeys)));
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
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  verifyMfa: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null,
  mfaRequired: false,
  login: async () => {}, // Placeholder
  signup: async () => {}, // Placeholder
  verifyMfa: async () => {}, // Placeholder
  logout: async () => {}, // Placeholder
};

const AuthContext = createContext<AuthState>(initialState);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Omit<AuthState, 'login' | 'signup' | 'verifyMfa' | 'logout'>>(initialState);

  useEffect(() => {
    const loadAuthState = async () => {
      setState((prevState) => ({ ...prevState, isLoading: true }));
      try {
        let storedToken: string | null = null;
        let storedUser: string | null = null;

        if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
          storedToken = localStorage.getItem("authToken");
          storedUser = localStorage.getItem("authUser");
        } else if (Platform.OS !== 'web') { // For React Native
          storedToken = await AsyncStorage.getItem("authToken");
          storedUser = await AsyncStorage.getItem("authUser");
        }

        if (storedToken && storedUser) {
          const user = JSON.parse(storedUser) as AuthUserProfile;
          setState((prevState) => ({
            ...prevState,
            isAuthenticated: true,
            user,
            token: storedToken,
            isLoading: false,
          }));
        } else {
          setState((prevState) => ({ ...prevState, isLoading: false }));
        }
      } catch (e) {
        console.error("Failed to load auth state from storage", e);
        if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("authUser");
        } else if (Platform.OS !== 'web') {
          await AsyncStorage.removeItem("authToken");
          await AsyncStorage.removeItem("authUser");
        }
        setState((prevState) => ({ ...prevState, isLoading: false }));
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
        } else if (Platform.OS !== 'web') {
          await AsyncStorage.setItem("authToken", token);
          await AsyncStorage.setItem("authUser", JSON.stringify(user));
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
      } else if (Platform.OS !== 'web') {
        await AsyncStorage.setItem("authToken", token);
        await AsyncStorage.setItem("authUser", JSON.stringify(user));
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
      } else if (Platform.OS !== 'web') {
        await AsyncStorage.removeItem("authToken");
        await AsyncStorage.removeItem("authUser");
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

  const authContextValue = {
    ...state,
    login,
    signup,
    verifyMfa,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
