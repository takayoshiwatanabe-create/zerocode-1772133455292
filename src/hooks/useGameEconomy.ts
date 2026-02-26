import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { t } from "@/i18n";
import { TranslationKeys } from "@/i18n/translations";

interface GameEconomyContextType {
  playerPoints: number;
  adsWatchedToday: number;
  canWatchAd: boolean;
  isLoading: boolean;
  error: string | null;
  updatePlayerPoints: (amount: number) => void;
  watchAd: () => Promise<number>;
}

const GameEconomyContext = createContext<GameEconomyContextType | undefined>(undefined);

const MAX_ADS_PER_DAY = 10; // RULE-ECON-002: 10 ads per day

export function GameEconomyProvider({ children }: { children: React.ReactNode }) {
  const [playerPoints, setPlayerPoints] = useState<number>(0);
  const [adsWatchedToday, setAdsWatchedToday] = useState<number>(0);
  const [canWatchAd, setCanWatchAd] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadEconomyData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const storedPoints = await AsyncStorage.getItem("playerPoints");
      if (storedPoints) {
        setPlayerPoints(parseInt(storedPoints, 10));
      }

      const storedAdsData = await AsyncStorage.getItem("adsWatchedToday");
      if (storedAdsData) {
        const { count, date } = JSON.parse(storedAdsData);
        const today = new Date().toDateString();

        if (date === today) {
          setAdsWatchedToday(count);
          setCanWatchAd(count < MAX_ADS_PER_DAY);
        } else {
          // Reset for a new day
          setAdsWatchedToday(0);
          setCanWatchAd(true);
          await AsyncStorage.setItem("adsWatchedToday", JSON.stringify({ count: 0, date: today }));
        }
      } else {
        // Initialize if no data
        const today = new Date().toDateString();
        await AsyncStorage.setItem("adsWatchedToday", JSON.stringify({ count: 0, date: today }));
        setAdsWatchedToday(0);
        setCanWatchAd(true);
      }
    } catch (e) {
      console.error("Failed to load game economy data", e);
      setError(t("economy_error_load_data" as TranslationKeys));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEconomyData();
  }, [loadEconomyData]);

  const updatePlayerPoints = useCallback(async (amount: number) => {
    // RULE-TECH-003: Game points calculation is server-side.
    // For this client-side mock, we directly update.
    // In a real app, this would be an API call.
    setPlayerPoints((prev) => {
      const newPoints = prev + amount;
      AsyncStorage.setItem("playerPoints", newPoints.toString());
      return newPoints;
    });
  }, []);

  const watchAd = useCallback(async (): Promise<number> => {
    setIsLoading(true);
    setError(null);
    try {
      if (!canWatchAd) {
        throw new Error(t("ad_viewer_no_ads_available" as TranslationKeys));
      }

      // Simulate server-side ad watch and point calculation
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
      const pointsEarned = Math.floor(Math.random() * 50) + 10; // Earn 10-60 points

      // Update ads watched count
      setAdsWatchedToday((prev) => {
        const newCount = prev + 1;
        const today = new Date().toDateString();
        AsyncStorage.setItem("adsWatchedToday", JSON.stringify({ count: newCount, date: today }));
        setCanWatchAd(newCount < MAX_ADS_PER_DAY);
        return newCount;
      });

      updatePlayerPoints(pointsEarned);
      return pointsEarned;
    } catch (e: any) {
      setError(e.message || t("ad_viewer_error_generic" as TranslationKeys));
      throw e; // Re-throw to allow component to handle
    } finally {
      setIsLoading(false);
    }
  }, [canWatchAd, updatePlayerPoints]);

  return (
    <GameEconomyContext.Provider
      value={{
        playerPoints,
        adsWatchedToday,
        canWatchAd,
        isLoading,
        error,
        updatePlayerPoints,
        watchAd,
      }}
    >
      {children}
    </GameEconomyContext.Provider>
  );
}

export function useGameEconomy() {
  const context = useContext(GameEconomyContext);
  if (context === undefined) {
    throw new Error("useGameEconomy must be used within a GameEconomyProvider");
  }
  return context;
}
