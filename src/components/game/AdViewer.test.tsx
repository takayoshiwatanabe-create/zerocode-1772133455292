import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { AdViewer } from './AdViewer';
import { useGameEconomy } from '@/hooks/useGameEconomy';
import { I18nProvider } from '@/i18n/I18nProvider';
import { describe, it, expect, jest } from '@jest/globals';

// Mock useGameEconomy hook
jest.mock('@/hooks/useGameEconomy', () => ({
  useGameEconomy: jest.fn(),
}));

// Mock i18n
jest.mock('@/i18n', () => ({
  t: jest.fn((key) => key),
  getIsRTL: jest.fn(() => false),
}));

describe('AdViewer', () => {
  const mockOnAdWatched = jest.fn();
  const mockWatchAd = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useGameEconomy as jest.Mock).mockReturnValue({
      playerPoints: 100,
      updatePlayerPoints: jest.fn(),
      adsWatchedToday: 0,
      canWatchAd: true,
      watchAd: mockWatchAd,
      isLoading: false,
    });
  });

  it('renders correctly with initial state', () => {
    render(
      <I18nProvider>
        <AdViewer onAdWatched={mockOnAdWatched} />
      </I18nProvider>
    );

    expect(screen.getByText('ad_viewer_title')).toBeTruthy();
    expect(screen.getByText('ad_viewer_ads_watched_today')).toBeTruthy();
    expect(screen.getByText('ad_viewer_ads_remaining')).toBeTruthy();
    expect(screen.getByText('ad_viewer_watch_ad_button')).toBeTruthy();
    expect(screen.getByText('ad_viewer_disclaimer')).toBeTruthy();
  });

  it('displays correct ad count information', () => {
    (useGameEconomy as jest.Mock).mockReturnValue({
      ...((useGameEconomy as jest.Mock).mock.results[0].value),
      adsWatchedToday: 3,
    });

    render(
      <I18nProvider>
        <AdViewer onAdWatched={mockOnAdWatched} />
      </I18nProvider>
    );

    expect(screen.getByText('ad_viewer_ads_watched_today')).toHaveTextContent('3');
    expect(screen.getByText('ad_viewer_ads_remaining')).toHaveTextContent('7');
  });

  it('disables watch ad button if no ads are available', () => {
    (useGameEconomy as jest.Mock).mockReturnValue({
      ...((useGameEconomy as jest.Mock).mock.results[0].value),
      canWatchAd: false,
    });

    render(
      <I18nProvider>
        <AdViewer onAdWatched={mockOnAdWatched} />
      </I18nProvider>
    );

    const watchAdButton = screen.getByText('ad_viewer_no_ads_available');
    expect(watchAdButton).toBeDisabled();
  });

  it('shows loading indicator when economy is loading', () => {
    (useGameEconomy as jest.Mock).mockReturnValue({
      ...((useGameEconomy as jest.Mock).mock.results[0].value),
      isLoading: true,
    });

    render(
      <I18nProvider>
        <AdViewer onAdWatched={mockOnAdWatched} />
      </I18nProvider>
    );

    expect(screen.getByTestId('activity-indicator')).toBeTruthy();
  });

  it('simulates ad playback and calls onAdWatched with earned points', async () => {
    mockWatchAd.mockResolvedValueOnce(50); // Simulate earning 50 points

    render(
      <I18nProvider>
        <AdViewer onAdWatched={mockOnAdWatched} />
      </I18nProvider>
    );

    const watchAdButton = screen.getByText('ad_viewer_watch_ad_button');
    fireEvent.press(watchAdButton);

    expect(screen.getByText('ad_viewer_ad_playing')).toBeTruthy();
    expect(screen.getByTestId('activity-indicator')).toBeTruthy(); // Ad playing indicator

    await waitFor(() => {
      expect(mockWatchAd).toHaveBeenCalled();
      expect(mockOnAdWatched).toHaveBeenCalledWith(50);
      expect(screen.getByText('ad_viewer_points_earned')).toHaveTextContent('50');
    }, { timeout: 3500 }); // Wait for ad playback simulation + success message timeout
  });

  it('displays error message if ad watching fails', async () => {
    mockWatchAd.mockRejectedValueOnce(new Error('Ad service unavailable'));

    render(
      <I18nProvider>
        <AdViewer onAdWatched={mockOnAdWatched} />
      </I18nProvider>
    );

    const watchAdButton = screen.getByText('ad_viewer_watch_ad_button');
    fireEvent.press(watchAdButton);

    await waitFor(() => {
      expect(screen.getByText('Ad service unavailable')).toBeTruthy();
    }, { timeout: 3500 });
  });

  it('adjusts text alignment for RTL languages', () => {
    (require('@/i18n').getIsRTL as jest.Mock).mockReturnValue(true);

    const { getByText } = render(
      <I18nProvider>
        <AdViewer onAdWatched={mockOnAdWatched} />
      </I18nProvider>
    );

    expect(getByText('ad_viewer_title').props.style).toContainEqual(expect.objectContaining({ textAlign: 'right' }));
    expect(getByText('ad_viewer_disclaimer').props.style).toContainEqual(expect.objectContaining({ textAlign: 'right' }));
  });

  it('adjusts text alignment for LTR languages', () => {
    (require('@/i18n').getIsRTL as jest.Mock).mockReturnValue(false);

    const { getByText } = render(
      <I18nProvider>
        <AdViewer onAdWatched={mockOnAdWatched} />
      </I18nProvider>
    );

    expect(getByText('ad_viewer_title').props.style).toContainEqual(expect.objectContaining({ textAlign: 'left' }));
    expect(getByText('ad_viewer_disclaimer').props.style).toContainEqual(expect.objectContaining({ textAlign: 'left' }));
  });
});
