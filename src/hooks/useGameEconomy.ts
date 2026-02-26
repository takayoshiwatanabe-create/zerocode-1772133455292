import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { t } from "@/i18n";
import { TranslationKeys } from "@/i18n/translations";

interface GameEconomyContextType {
  playerPoints: number;
  adsWatchedToday: number;
  canWatchAd: boolean;
  isLoading: boolean;
  updatePlayerPoints: (amount: number) => void;
  watchAd: () => Promise<number>;
  // Add other economy-related functions (e.g., buyItem, sellStock)
}

const GameEconomyContext = createContext<GameEconomyContextType | undefined>(undefined);

const POINTS_STORAGE_KEY = "game_player_points";
const ADS_WATCHED_TODAY_KEY = "game_ads_watched_today";
const LAST_AD_RESET_DATE_KEY = "game_last_ad_reset_date";
const MAX_ADS_PER_DAY = 10; // RULE-ECON-002: 10 ads per day limit

export function GameEconomyProvider({ children }: { children: React.ReactNode }) {
  const [playerPoints, setPlayerPoints] = useState(0);
  const [adsWatchedToday, setAdsWatchedToday] = useState(0);
  const [lastAdResetDate, setLastAdResetDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadEconomyData = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedPoints = await AsyncStorage.getItem(POINTS_STORAGE_KEY);
      const storedAdsWatched = await AsyncStorage.getItem(ADS_WATCHED_TODAY_KEY);
      const storedLastReset = await AsyncStorage.getItem(LAST_AD_RESET_DATE_KEY);

      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      let currentAdsWatched = 0;
      if (storedLastReset === today) {
        currentAdsWatched = storedAdsWatched ? parseInt(storedAdsWatched, 10) : 0;
      } else {
        // Reset ads watched if it's a new day
        await AsyncStorage.setItem(ADS_WATCHED_TODAY_KEY, "0");
        await AsyncStorage.setItem(LAST_AD_RESET_DATE_KEY, today);
        currentAdsWatched = 0;
      }

      setPlayerPoints(storedPoints ? parseInt(storedPoints, 10) : 0);
      setAdsWatchedToday(currentAdsWatched);
      setLastAdResetDate(today);
    } catch (error) {
      console.error("Failed to load game economy data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEconomyData();
  }, [loadEconomyData]);

  const updatePlayerPoints = useCallback(async (amount: number) => {
    // RULE-TECH-003: Game points calculation is server-side.
    // For this mock, we simulate client-side update but log a warning.
    console.warn("Client-side point update for mock. In production, this should be server-side (RULE-TECH-003).");
    setPlayerPoints((prevPoints) => {
      const newPoints = Math.max(0, prevPoints + amount);
      AsyncStorage.setItem(POINTS_STORAGE_KEY, String(newPoints));
      return newPoints;
    });
  }, []);

  const watchAd = useCallback(async (): Promise<number> => {
    if (adsWatchedToday >= MAX_ADS_PER_DAY) {
      throw new Error(t("ad_viewer_error_max_ads" as TranslationKeys));
    }

    // Simulate server-side ad watch and point reward
    // RULE-ECON-002: Ad viewing = points is explicit.
    const pointsEarned = Math.floor(Math.random() * 50) + 50; // Earn 50-100 points

    // Update client-side state and storage
    const newAdsWatched = adsWatchedToday + 1;
    setAdsWatchedToday(newAdsWatched);
    await AsyncStorage.setItem(ADS_WATCHED_TODAY_KEY, String(newAdsWatched));

    updatePlayerPoints(pointsEarned); // Update points
    return pointsEarned;
  }, [adsWatchedToday, updatePlayerPoints]);

  const canWatchAd = adsWatchedToday < MAX_ADS_PER_DAY;

  const value = {
    playerPoints,
    adsWatchedToday,
    canWatchAd,
    isLoading,
    updatePlayerPoints,
    watchAd,
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
