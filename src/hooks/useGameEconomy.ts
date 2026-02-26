import { useState, useEffect, useCallback, useContext, createContext, ReactNode } from "react";
import { t } from "@/i18n";
import { TranslationKeys } from "@/i18n/translations";
import { useAuth } from "./useAuth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from "react-native";

// RULE-TECH-003: ゲーム内ポイント計算はすべてサーバーサイドで実行
// クライアントサイドのポイント値はUIの表示専用とする
// For this mock, we simulate server-side logic on the client.
// In a real app, these would be API calls.

const MAX_ADS_PER_DAY = 10; // RULE-ECON-002: 1日の広告視聴上限：10回

interface GameEconomyState {
  points: number;
  adsWatchedToday: number;
  canWatchAd: boolean;
  isLoading: boolean;
  error: string | null;
  watchAd: () => Promise<number>;
  // Other economy actions like buyItem, sellStock would go here
}

const initialState: GameEconomyState = {
  points: 0,
  adsWatchedToday: 0,
  canWatchAd: false,
  isLoading: false,
  error: null,
  watchAd: async () => 0, // Placeholder
};

const GameEconomyContext = createContext<GameEconomyState>(initialState);

export function GameEconomyProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [points, setPoints] = useState(0);
  const [adsWatchedToday, setAdsWatchedToday] = useState(0);
  const [lastAdWatchDate, setLastAdWatchDate] = useState<string | null>(null); // YYYY-MM-DD
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to get today's date in YYYY-MM-DD format
  const getTodayDate = () => new Date().toISOString().slice(0, 10);

  // Load economy state from storage (simulating server state for points, client for ad count)
  useEffect(() => {
    const loadEconomyState = async () => {
      if (!isAuthenticated || !user) {
        setPoints(0);
        setAdsWatchedToday(0);
        setLastAdWatchDate(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        let storedPoints = 0;
        let storedAdsWatched = 0;
        let storedLastAdDate: string | null = null;

        // Simulate fetching initial points from "server"
        // In a real app, this would be an API call: /api/economy/user/{userId}
        storedPoints = user.id === "child-1" ? 1500 : 0; // Mock initial points for a child user

        // Load ad watch count from client-side storage (for RULE-ECON-002 enforcement)
        if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
          storedAdsWatched = parseInt(localStorage.getItem(`adsWatched_${user.id}`) || "0", 10);
          storedLastAdDate = localStorage.getItem(`lastAdDate_${user.id}`);
        } else if (Platform.OS !== 'web') {
          storedAdsWatched = parseInt(await AsyncStorage.getItem(`adsWatched_${user.id}`) || "0", 10);
          storedLastAdDate = await AsyncStorage.getItem(`lastAdDate_${user.id}`);
        }

        const today = getTodayDate();
        if (storedLastAdDate !== today) {
          // Reset ad count if it's a new day
          storedAdsWatched = 0;
          if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(`adsWatched_${user.id}`, "0");
            localStorage.setItem(`lastAdDate_${user.id}`, today);
          } else if (Platform.OS !== 'web') {
            await AsyncStorage.setItem(`adsWatched_${user.id}`, "0");
            await AsyncStorage.setItem(`lastAdDate_${user.id}`, today);
          }
        }

        setPoints(storedPoints);
        setAdsWatchedToday(storedAdsWatched);
        setLastAdWatchDate(today); // Always set to today after check
      } catch (e) {
        console.error("Failed to load game economy state", e);
        setError(t("economy_error_load_failed" as TranslationKeys));
      } finally {
        setIsLoading(false);
      }
    };

    loadEconomyState();
  }, [isAuthenticated, user]);

  const watchAd = useCallback(async (): Promise<number> => {
    if (!isAuthenticated || !user) {
      setError(t("economy_error_not_authenticated" as TranslationKeys));
      throw new Error(t("economy_error_not_authenticated" as TranslationKeys));
    }
    if (adsWatchedToday >= MAX_ADS_PER_DAY) {
      setError(t("ad_viewer_no_ads_available" as TranslationKeys));
      throw new Error(t("ad_viewer_no_ads_available" as TranslationKeys));
    }

    setIsLoading(true);
    setError(null);
    try {
      // Simulate server-side point calculation and ad count update
      // RULE-TECH-003: ゲーム内ポイント計算はすべてサーバーサイドで実行
      // RULE-ECON-002: 広告は「視聴 = ポイント」の等価交換であることを明示
      const pointsEarned = 50; // Example: 50 points per ad
      const newPoints = points + pointsEarned;
      const newAdsWatchedToday = adsWatchedToday + 1;
      const today = getTodayDate();

      // Simulate API call to update points on server
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

      // Update client-side state and storage
      setPoints(newPoints);
      setAdsWatchedToday(newAdsWatchedToday);
      setLastAdWatchDate(today);

      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(`adsWatched_${user.id}`, newAdsWatchedToday.toString());
        localStorage.setItem(`lastAdDate_${user.id}`, today);
      } else if (Platform.OS !== 'web') {
        await AsyncStorage.setItem(`adsWatched_${user.id}`, newAdsWatchedToday.toString());
        await AsyncStorage.setItem(`lastAdDate_${user.id}`, today);
      }

      return pointsEarned;
    } catch (e) {
      console.error("Failed to watch ad", e);
      setError(t("ad_viewer_error_generic" as TranslationKeys));
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, points, adsWatchedToday]);

  const economyContextValue = {
    points,
    adsWatchedToday,
    canWatchAd: isAuthenticated && user && adsWatchedToday < MAX_ADS_PER_DAY,
    isLoading,
    error,
    watchAd,
  };

  return (
    <GameEconomyContext.Provider value={economyContextValue}>
      {children}
    </GameEconomyContext.Provider>
  );
}

export function useGameEconomy() {
  return useContext(GameEconomyContext);
}
