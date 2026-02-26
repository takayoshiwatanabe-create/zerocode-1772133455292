import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useGameEconomy, GameEconomyProvider } from './useGameEconomy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { describe, it, expect, jest } from '@jest/globals';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock Date for consistent testing of adsWatchedToday
const MOCK_DATE = '2024-07-25T12:00:00.000Z';
const MOCK_DATE_NEXT_DAY = '2024-07-26T12:00:00.000Z';

describe('useGameEconomy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date(MOCK_DATE));

    // Reset AsyncStorage mocks for each test
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === 'playerPoints') return Promise.resolve(null); // Default to null for fresh state
      if (key === 'adsWatchedToday') return Promise.resolve(null); // Default to null for fresh state
      return Promise.resolve(null);
    });
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(null);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with default values if no stored data', async () => {
    const { result } = renderHook(() => useGameEconomy(), { wrapper: GameEconomyProvider });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.playerPoints).toBe(0);
      expect(result.current.adsWatchedToday).toBe(0);
      expect(result.current.canWatchAd).toBe(true);
    });
  });

  it('should load player points from AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === 'playerPoints') return Promise.resolve('150');
      return Promise.resolve(null);
    });

    const { result } = renderHook(() => useGameEconomy(), { wrapper: GameEconomyProvider });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.playerPoints).toBe(150);
    });
  });

  it('should load ads watched today from AsyncStorage for the current day', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === 'adsWatchedToday') return Promise.resolve(JSON.stringify({ count: 5, date: '2024-07-25' }));
      return Promise.resolve(null);
    });

    const { result } = renderHook(() => useGameEconomy(), { wrapper: GameEconomyProvider });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.adsWatchedToday).toBe(5);
      expect(result.current.canWatchAd).toBe(true); // 5 < 10
    });
  });

  it('should reset ads watched today if the stored date is different', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === 'adsWatchedToday') return Promise.resolve(JSON.stringify({ count: 5, date: '2024-07-24' }));
      return Promise.resolve(null);
    });

    const { result } = renderHook(() => useGameEconomy(), { wrapper: GameEconomyProvider });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.adsWatchedToday).toBe(0);
      expect(result.current.canWatchAd).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('adsWatchedToday', JSON.stringify({ count: 0, date: '2024-07-25' }));
    });
  });

  it('should update player points and persist to AsyncStorage', async () => {
    const { result } = renderHook(() => useGameEconomy(), { wrapper: GameEconomyProvider });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.updatePlayerPoints(50);
    });

    expect(result.current.playerPoints).toBe(50);
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('playerPoints', '50');
    });

    act(() => {
      result.current.updatePlayerPoints(-20);
    });

    expect(result.current.playerPoints).toBe(30);
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('playerPoints', '30');
    });
  });

  it('should watch an ad, increment count, and update points', async () => {
    const { result } = renderHook(() => useGameEconomy(), { wrapper: GameEconomyProvider });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.watchAd();
    });

    expect(result.current.adsWatchedToday).toBe(1);
    expect(result.current.playerPoints).toBe(10); // Default ad points
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('adsWatchedToday', JSON.stringify({ count: 1, date: '2024-07-25' }));
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('playerPoints', '10');
    });
  });

  it('should not be able to watch more than 10 ads per day', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === 'adsWatchedToday') return Promise.resolve(JSON.stringify({ count: 9, date: '2024-07-25' }));
      return Promise.resolve(null);
    });

    const { result } = renderHook(() => useGameEconomy(), { wrapper: GameEconomyProvider });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.adsWatchedToday).toBe(9);
      expect(result.current.canWatchAd).toBe(true);
    });

    act(() => {
      result.current.watchAd(); // 10th ad
    });

    expect(result.current.adsWatchedToday).toBe(10);
    expect(result.current.canWatchAd).toBe(false);
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('adsWatchedToday', JSON.stringify({ count: 10, date: '2024-07-25' }));
    });

    act(() => {
      result.current.watchAd(); // 11th ad - should not work
    });

    expect(result.current.adsWatchedToday).toBe(10); // Should remain 10
    expect(result.current.canWatchAd).toBe(false);
    // AsyncStorage.setItem should not be called again for adsWatchedToday
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(2); // Initial set + 10th ad set
  });

  it('should reset ad count on a new day', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === 'adsWatchedToday') return Promise.resolve(JSON.stringify({ count: 10, date: '2024-07-25' }));
      return Promise.resolve(null);
    });

    const { result } = renderHook(() => useGameEconomy(), { wrapper: GameEconomyProvider });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.adsWatchedToday).toBe(10);
      expect(result.current.canWatchAd).toBe(false);
    });

    // Advance to the next day
    jest.setSystemTime(new Date(MOCK_DATE_NEXT_DAY));

    // Re-render or trigger an update (e.g., by calling a function)
    act(() => {
      result.current.watchAd(); // This will trigger the daily reset check
    });

    await waitFor(() => {
      expect(result.current.adsWatchedToday).toBe(1); // Should be reset and incremented
      expect(result.current.canWatchAd).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('adsWatchedToday', JSON.stringify({ count: 1, date: '2024-07-26' }));
    });
  });

  it('should handle invalid stored points gracefully', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === 'playerPoints') return Promise.resolve('invalid_number');
      return Promise.resolve(null);
    });

    const { result } = renderHook(() => useGameEconomy(), { wrapper: GameEconomyProvider });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.playerPoints).toBe(0); // Should default to 0
    });
  });

  it('should handle invalid stored adsWatchedToday gracefully', async () => {
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === 'adsWatchedToday') return Promise.resolve('not_json');
      return Promise.resolve(null);
    });

    const { result } = renderHook(() => useGameEconomy(), { wrapper: GameEconomyProvider });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.adsWatchedToday).toBe(0); // Should default to 0
      expect(result.current.canWatchAd).toBe(true);
    });
  });
});
