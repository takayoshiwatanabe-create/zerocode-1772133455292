import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Platform } from "react-native";
import { t, getIsRTL } from "@/i18n";
import { useGameEconomy } from "@/hooks/useGameEconomy";
import { TranslationKeys } from "@/i18n/translations";

interface AdViewerProps {
  onAdWatched: (pointsEarned: number) => void;
}

export function AdViewer({ onAdWatched }: AdViewerProps) {
  const isRTL = getIsRTL();
  const { watchAd, canWatchAd, adsWatchedToday, isLoading: economyLoading } = useGameEconomy();
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [adPoints, setAdPoints] = useState(0);
  const [adError, setAdError] = useState<string | null>(null);

  const handleWatchAd = async () => {
    if (!canWatchAd || isAdPlaying) return;

    setIsAdPlaying(true);
    setAdError(null);
    try {
      // Simulate ad playback
      await new Promise(resolve => setTimeout(resolve, 3000)); // Ad plays for 3 seconds

      const earned = await watchAd();
      setAdPoints(earned);
      onAdWatched(earned);
      // Optionally, show a success message for a short period
      setTimeout(() => setAdPoints(0), 2000);

    } catch (error: any) {
      setAdError(error.message || t("ad_viewer_error_generic" as TranslationKeys));
    } finally {
      setIsAdPlaying(false);
    }
  };

  const remainingAds = 10 - adsWatchedToday;

  return (
    <View style={[styles.container, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
      <Text style={[styles.title, { textAlign: isRTL ? 'right' : 'left' }]}>
        {t("ad_viewer_title" as TranslationKeys)}
      </Text>

      {adError && (
        <Text style={[styles.errorText, { textAlign: isRTL ? 'right' : 'left' }]}>{adError}</Text>
      )}

      {adPoints > 0 && (
        <Text style={[styles.successText, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t("ad_viewer_points_earned" as TranslationKeys, { points: adPoints })}
        </Text>
      )}

      <View style={[styles.adInfoRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Text style={[styles.adInfoText, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t("ad_viewer_ads_watched_today" as TranslationKeys, { count: adsWatchedToday, max: 10 })}
        </Text>
        <Text style={[styles.adInfoText, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t("ad_viewer_ads_remaining" as TranslationKeys, { count: remainingAds })}
        </Text>
      </View>

      {isAdPlaying ? (
        <View style={styles.adPlayingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.adPlayingText}>{t("ad_viewer_ad_playing" as TranslationKeys)}</Text>
          {/* Mock ad content */}
          <Image
            source={{ uri: 'https://via.placeholder.com/300x200/60a5fa/ffffff?text=Your+Ad+Here' }}
            style={styles.mockAdImage}
            accessibilityLabel={t("ad_viewer_mock_ad_alt_text" as TranslationKeys)}
          />
        </View>
      ) : (
        <TouchableOpacity
          onPress={handleWatchAd}
          style={[
            styles.watchAdButton,
            (!canWatchAd || economyLoading) && styles.watchAdButtonDisabled,
            { alignSelf: isRTL ? 'flex-end' : 'flex-start' }
          ]}
          disabled={!canWatchAd || economyLoading}
        >
          {economyLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.watchAdButtonText}>
              {canWatchAd ? t("ad_viewer_watch_ad_button" as TranslationKeys) : t("ad_viewer_no_ads_available" as TranslationKeys)}
            </Text>
          )}
        </TouchableOpacity>
      )}

      <Text style={[styles.disclaimerText, { textAlign: isRTL ? 'right' : 'left' }]}>
        {t("ad_viewer_disclaimer" as TranslationKeys)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e0f7fa', // light cyan background
    borderRadius: 10,
    padding: 20,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00796b', // dark teal
    marginBottom: 16,
  },
  errorText: {
    color: '#ef4444', // red-500
    marginBottom: 12,
    fontSize: 14,
  },
  successText: {
    color: '#10b981', // green-500
    marginBottom: 12,
    fontSize: 16,
    fontWeight: 'bold',
  },
  adInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  adInfoText: {
    fontSize: 14,
    color: '#4b5563', // gray-700
  },
  watchAdButton: {
    backgroundColor: '#00bcd4', // cyan-500
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 180,
    marginBottom: 16,
  },
  watchAdButtonDisabled: {
    backgroundColor: '#b2ebf2', // light cyan when disabled
    opacity: 0.7,
  },
  watchAdButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  adPlayingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 250, // Fixed height for ad content
    backgroundColor: '#e0f2fe', // light blue background
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#90caf9', // blue-200
  },
  adPlayingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2563eb', // blue-600
  },
  mockAdImage: {
    width: '90%',
    height: 150,
    marginTop: 15,
    borderRadius: 5,
    resizeMode: 'contain',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#6b7280', // gray-500
    fontStyle: 'italic',
    width: '100%',
  },
});
