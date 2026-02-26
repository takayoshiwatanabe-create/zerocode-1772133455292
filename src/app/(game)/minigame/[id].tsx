import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Platform, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { t, getIsRTL } from "@/i18n";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PhaserGameContainer } from "@/components/game/PhaserGameContainer";
import { TranslationKeys } from "@/i18n/translations";
import { useAuth } from "@/hooks/useAuth";
import { useGameEconomy } from "@/hooks/useGameEconomy";

export default function MinigameScreen() {
  const { id } = useLocalSearchParams(); // The minigame ID (e.g., "farmer", "baker")
  const router = useRouter();
  const isRTL = getIsRTL();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { updatePlayerPoints } = useGameEconomy();

  const [isLoadingGame, setIsLoadingGame] = useState(true);
  const [gameResult, setGameResult] = useState<{ score: number; pointsEarned: number } | null>(null);
  const [gameKey, setGameKey] = useState(0); // Key to force remount PhaserGameContainer

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.replace(Platform.OS === 'web' ? "/page" : "/");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleGameReady = () => {
    setIsLoadingGame(false);
  };

  const handleGameComplete = (score: number) => {
    console.log(`Minigame ${id} completed with score: ${score}`);
    const pointsEarned = Math.floor(score / 10); // Example: 10 points per 100 score
    updatePlayerPoints(pointsEarned);
    setGameResult({ score, pointsEarned });
  };

  const handlePlayAgain = () => {
    setGameResult(null);
    setIsLoadingGame(true);
    setGameKey(prev => prev + 1); // Remount the game container
  };

  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>{t("loading")}</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return null; // Should be redirected by _layout.tsx
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
        <Text style={[styles.title, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t("minigame_title", { minigameName: t(`job_${id}_title` as TranslationKeys) })}
        </Text>

        {isLoadingGame && (
          <View style={styles.gameLoadingOverlay}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>{t("minigame_loading_game" as TranslationKeys)}</Text>
          </View>
        )}

        {!gameResult ? (
          <PhaserGameContainer
            key={gameKey} // Use key to force remount
            minigameId={id as string}
            onGameReady={handleGameReady}
            onGameComplete={handleGameComplete}
            isRTL={isRTL}
          />
        ) : (
          <View style={styles.gameResultContainer}>
            <Text style={[styles.resultTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t("minigame_result_title" as TranslationKeys)}
            </Text>
            <Text style={[styles.resultText, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t("minigame_result_score", { score: gameResult.score })}
            </Text>
            <Text style={[styles.resultText, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t("minigame_result_points_earned", { points: gameResult.pointsEarned })}
            </Text>
            <TouchableOpacity
              onPress={handlePlayAgain}
              style={[styles.actionButton, { alignSelf: isRTL ? 'flex-end' : 'flex-start' }]}
            >
              <Text style={styles.actionButtonText}>{t("minigame_play_again_button" as TranslationKeys)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.replace("/(game)/home")}
              style={[styles.actionButton, styles.backButton, { alignSelf: isRTL ? 'flex-end' : 'flex-start' }]}
            >
              <Text style={styles.actionButtonText}>{t("minigame_back_to_home_button" as TranslationKeys)}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f9ff', // light blue background
  },
  container: {
    flex: 1,
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4b5563',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0c4a6e',
    marginBottom: 24,
    width: '100%',
  },
  gameLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(240, 249, 255, 0.9)', // Semi-transparent light blue
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  gameResultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    borderRadius: 10,
    padding: 24,
    marginTop: 20,
    width: '100%',
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0c4a6e',
    marginBottom: 16,
  },
  resultText: {
    fontSize: 20,
    color: '#1e40af',
    marginBottom: 8,
  },
  actionButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  backButton: {
    backgroundColor: '#6b7280', // gray-500
    marginTop: 10,
  },
});
