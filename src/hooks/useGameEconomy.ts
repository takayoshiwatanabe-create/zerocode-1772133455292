import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/hooks/useAuth";
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

const MAX_ADS_PER_DAY = 10; // RULE-ECON-002: 1日の広告視聴上限：10回

export function GameEconomyProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [playerPoints, setPlayerPoints] = useState(0);
  const [adsWatchedToday, setAdsWatchedToday] = useState(0);
  const [lastAdResetDate, setLastAdResetDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const loadEconomyData = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      // RULE-TECH-003: ゲーム内ポイント計算はすべてサーバーサイドで実行
      // For client-side mock, we store it in AsyncStorage, but in a real app,
      // this would be fetched from a secure backend.
      const storedPoints = await AsyncStorage.getItem(`playerPoints_${user.id}`);
      if (storedPoints) {
        setPlayerPoints(parseInt(storedPoints, 10));
      } else {
        setPlayerPoints(0); // Default for new users
      }

      const storedAdData = await AsyncStorage.getItem(`adData_${user.id}`);
      if (storedAdData) {
        const { count, date } = JSON.parse(storedAdData);
        setLastAdResetDate(date);
        if (date === today) {
          setAdsWatchedToday(count);
        } else {
          // Reset count if it's a new day
          setAdsWatchedToday(0);
          await AsyncStorage.setItem(`adData_${user.id}`, JSON.stringify({ count: 0, date: today }));
        }
      } else {
        setAdsWatchedToday(0);
        setLastAdResetDate(today);
        await AsyncStorage.setItem(`adData_${user.id}`, JSON.stringify({ count: 0, date: today }));
      }
    } catch (error) {
      console.error("Failed to load game economy data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, today]);

  useEffect(() => {
    if (!authLoading) {
      loadEconomyData();
    }
  }, [authLoading, loadEconomyData]);

  const updatePlayerPoints = useCallback(async (amount: number) => {
    if (!user) return;
    // RULE-TECH-003: ゲーム内ポイント計算はすべてサーバーサイドで実行
    // This is a client-side mock. In production, this would be an API call.
    const newPoints = playerPoints + amount;
    setPlayerPoints(newPoints);
    await AsyncStorage.setItem(`playerPoints_${user.id}`, newPoints.toString());
  }, [playerPoints, user]);

  const watchAd = useCallback(async (): Promise<number> => {
    if (!user || adsWatchedToday >= MAX_ADS_PER_DAY) {
      throw new Error(t("ad_viewer_error_max_ads" as TranslationKeys));
    }

    // Simulate server-side point calculation and ad count update
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency

    const pointsEarned = Math.floor(Math.random() * 50) + 50; // Earn 50-100 points per ad
    updatePlayerPoints(pointsEarned);

    const newAdsWatchedToday = adsWatchedToday + 1;
    setAdsWatchedToday(newAdsWatchedToday);
    await AsyncStorage.setItem(`adData_${user.id}`, JSON.stringify({ count: newAdsWatchedToday, date: today }));

    return pointsEarned;
  }, [user, adsWatchedToday, updatePlayerPoints, today]);

  const resetDailyAdCount = useCallback(async () => {
    if (!user) return;
    setAdsWatchedToday(0);
    setLastAdResetDate(today);
    await AsyncStorage.setItem(`adData_${user.id}`, JSON.stringify({ count: 0, date: today }));
  }, [user, today]);

  const canWatchAd = adsWatchedToday < MAX_ADS_PER_DAY;

  const value = {
    playerPoints,
    adsWatchedToday,
    canWatchAd,
    isLoading: isLoading || authLoading,
    updatePlayerPoints,
    watchAd,
    resetDailyAdCount,
  };

  return <GameEconomyContext.Provider value={value}>{children}</GameEconomyContext.Provider>;
}

export function useGameEconomy() {
  const context = useContext(GameEconomyContext);
  if (context === undefined) {
    throw new Error("useGameEconomy must be used within a GameEconomyProvider");
  }
  return context;
}

