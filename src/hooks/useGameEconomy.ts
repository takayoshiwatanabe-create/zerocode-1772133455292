import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./useAuth";
import { t } from "@/i18n";
import { TranslationKeys } from "@/i18n/translations";

interface GameEconomyContextType {
  playerPoints: number;
  adsWatchedToday: number;
  canWatchAd: boolean;
  isLoading: boolean;
  updatePlayerPoints: (amount: number) => void;
  watchAd: () => Promise<number>;
  resetDailyAdCount: () => Promise<void>;
}

const GameEconomyContext = createContext<GameEconomyContextType | undefined>(undefined);

const MAX_ADS_PER_DAY = 10;
const POINTS_PER_AD = 50;

export function GameEconomyProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [playerPoints, setPlayerPoints] = useState(0);
  const [adsWatchedToday, setAdsWatchedToday] = useState(0);
  const [lastAdResetDate, setLastAdResetDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate API calls
  const simulateApiCall = async (delay = 500) => {
    return new Promise((resolve) => setTimeout(resolve, delay));
  };

  const loadEconomyData = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const storedPoints = await AsyncStorage.getItem(`points_${user.id}`);
      if (storedPoints) {
        setPlayerPoints(parseInt(storedPoints, 10));
      } else {
        setPlayerPoints(0); // Default if no points found
      }

      const storedAdsWatched = await AsyncStorage.getItem(`adsWatched_${user.id}`);
      const storedLastReset = await AsyncStorage.getItem(`lastAdResetDate_${user.id}`);

      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      if (storedLastReset !== today) {
        // It's a new day, reset ad count
        setAdsWatchedToday(0);
        setLastAdResetDate(today);
        await AsyncStorage.setItem(`adsWatched_${user.id}`, "0");
        await AsyncStorage.setItem(`lastAdResetDate_${user.id}`, today);
      } else {
        setAdsWatchedToday(storedAdsWatched ? parseInt(storedAdsWatched, 10) : 0);
        setLastAdResetDate(storedLastReset);
      }
    } catch (error) {
      console.error("Failed to load game economy data", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      loadEconomyData();
    }
  }, [authLoading, loadEconomyData]);

  const updatePlayerPoints = useCallback(async (amount: number) => {
    if (!user) return;
    await simulateApiCall(); // Simulate server-side update
    setPlayerPoints((prev) => {
      const newPoints = Math.max(0, prev + amount); // Points cannot go below zero
      AsyncStorage.setItem(`points_${user.id}`, newPoints.toString());
      return newPoints;
    });
  }, [user]);

  const watchAd = useCallback(async (): Promise<number> => {
    if (!user) {
      throw new Error(t("ad_viewer_error_no_user" as TranslationKeys));
    }
    if (adsWatchedToday >= MAX_ADS_PER_DAY) {
      throw new Error(t("ad_viewer_error_max_ads" as TranslationKeys));
    }

    setIsLoading(true);
    await simulateApiCall(2000); // Simulate ad watching and server update

    const newAdsWatched = adsWatchedToday + 1;
    setAdsWatchedToday(newAdsWatched);
    await AsyncStorage.setItem(`adsWatched_${user.id}`, newAdsWatched.toString());

    updatePlayerPoints(POINTS_PER_AD); // Update points
    setIsLoading(false);
    return POINTS_PER_AD;
  }, [user, adsWatchedToday, updatePlayerPoints]);

  const resetDailyAdCount = useCallback(async () => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    setAdsWatchedToday(0);
    setLastAdResetDate(today);
    await AsyncStorage.setItem(`adsWatched_${user.id}`, "0");
    await AsyncStorage.setItem(`lastAdResetDate_${user.id}`, today);
  }, [user]);

  const canWatchAd = adsWatchedToday < MAX_ADS_PER_DAY;

  const contextValue = {
    playerPoints,
    adsWatchedToday,
    canWatchAd,
    isLoading: isLoading || authLoading,
    updatePlayerPoints,
    watchAd,
    resetDailyAdCount,
  };

  return <GameEconomyContext.Provider value={contextValue}>{children}</GameEconomyContext.Provider>;
}

export function useGameEconomy() {
  const context = useContext(GameEconomyContext);
  if (context === undefined) {
    throw new Error("useGameEconomy must be used within a GameEconomyProvider");
  }
  return context;
}

