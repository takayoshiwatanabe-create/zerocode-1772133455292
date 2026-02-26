import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './useAuth';
import { t } from '@/i18n';
import { TranslationKeys } from '@/i18n/translations';

interface GameEconomyContextType {
  playerPoints: number;
  updatePlayerPoints: (amount: number) => void;
  adsWatchedToday: number;
  canWatchAd: boolean;
  watchAd: () => Promise<number>;
  isLoading: boolean;
}

const GameEconomyContext = createContext<GameEconomyContextType | undefined>(undefined);

interface GameEconomyProviderProps {
  children: ReactNode;
}

export function GameEconomyProvider({ children }: GameEconomyProviderProps) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [playerPoints, setPlayerPoints] = useState(0);
  const [adsWatchedToday, setAdsWatchedToday] = useState(0);
  const [lastAdWatchDate, setLastAdWatchDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading game economy data from a backend
  useEffect(() => {
    const loadEconomyData = async () => {
      setIsLoading(true);
      if (isAuthenticated && user) {
        // In a real app, fetch from API
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

        // Mock data
        setPlayerPoints(user.id === 'child-1' ? 1500 : 500); // Different points for different mock users

        const today = new Date().toISOString().split('T')[0];
        const storedLastAdDate = localStorage.getItem(`lastAdWatchDate_${user.id}`);
        const storedAdsWatched = parseInt(localStorage.getItem(`adsWatchedToday_${user.id}`) || '0', 10);

        if (storedLastAdDate === today) {
          setAdsWatchedToday(storedAdsWatched);
          setLastAdWatchDate(storedLastAdDate);
        } else {
          // Reset daily ad count if it's a new day
          setAdsWatchedToday(0);
          setLastAdWatchDate(today);
          localStorage.setItem(`lastAdWatchDate_${user.id}`, today);
          localStorage.setItem(`adsWatchedToday_${user.id}`, '0');
        }
      } else {
        // Reset if not authenticated
        setPlayerPoints(0);
        setAdsWatchedToday(0);
        setLastAdWatchDate(null);
      }
      setIsLoading(false);
    };

    if (!authLoading) {
      loadEconomyData();
    }
  }, [isAuthenticated, user, authLoading]);

  const updatePlayerPoints = (amount: number) => {
    setPlayerPoints((prev) => prev + amount);
    // In a real app, this would be an API call to update server-side points
    console.log(`Points updated by ${amount}. New total: ${playerPoints + amount}`);
  };

  const canWatchAd = adsWatchedToday < 10; // RULE-ECON-002: 10 ads per day

  const watchAd = async (): Promise<number> => {
    if (!isAuthenticated || !user) {
      throw new Error(t("ad_viewer_error_not_authenticated" as TranslationKeys));
    }
    if (!canWatchAd) {
      throw new Error(t("ad_viewer_error_ad_limit_reached" as TranslationKeys));
    }

    // Simulate server-side ad watch and point earning
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

    const pointsEarned = 50; // Fixed points per ad
    updatePlayerPoints(pointsEarned);
    setAdsWatchedToday((prev) => {
      const newCount = prev + 1;
      localStorage.setItem(`adsWatchedToday_${user.id}`, newCount.toString());
      return newCount;
    });

    setIsLoading(false);
    return pointsEarned;
  };

  const contextValue = {
    playerPoints,
    updatePlayerPoints,
    adsWatchedToday,
    canWatchAd,
    watchAd,
    isLoading: isLoading || authLoading,
  };

  return (
    <GameEconomyContext.Provider value={contextValue}>
      {children}
    </GameEconomyContext.Provider>
  );
}

export function useGameEconomy() {
  const context = useContext(GameEconomyContext);
  if (context === undefined) {
    throw new Error('useGameEconomy must be used within a GameEconomyProvider');
  }
  return context;
}
