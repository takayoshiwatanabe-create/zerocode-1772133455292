import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { t, getIsRTL } from "@/i18n";
import { useAuth } from "@/hooks/useAuth";
import { WorldMap } from "@/components/game/WorldMap";
import { useRouter } from "expo-router";
import { Id } from "@/types"; // Import Id type

export default function GameHome() {
  const { user, logout } = useAuth();
  const isRTL = getIsR18(); // Changed from getIsRTL() to getIsR18()
  const router = useRouter();

  // Mock player progress for progressive disclosure
  const [playerLevel, setPlayerLevel] = useState(1);
  const [playerPoints, setPlayerPoints] = useState(1500);
  const [currentLocation, setCurrentLocation] = useState<Id>("home_village"); // Specify Id type

  const handleLogout = async () => {
    await logout();
    router.replace(Platform.OS === 'web' ? "/page" : "/");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.scrollViewContent, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
        <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={styles.welcomeText}>
            {t("game_welcome_message", { nickname: user?.nickname || t("player") })}
          </Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>{t("logout_button")}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.playerStats, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={styles.statText}>{t("game_player_level", { level: playerLevel })}</Text>
          <Text style={styles.statText}>{t("game_player_points", { points: playerPoints })}</Text>
        </View>

        <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t("game_world_map_title")}
        </Text>
        <WorldMap
          playerLevel={playerLevel}
          currentLocation={currentLocation}
          onLocationSelect={(locationId) => {
            console.log("Selected location:", locationId);
            // In a real app, this would trigger navigation or a game event
            setCurrentLocation(locationId); // For mock purposes
          }}
        />

        {/* Progressive Disclosure: Unlock new features based on playerLevel */}
        {playerLevel >= 2 && (
          <View style={styles.unlockedFeature}>
            <Text style={[styles.unlockedFeatureTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t("game_unlocked_jobs_title")}
            </Text>
            <Text style={[styles.unlockedFeatureText, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t("game_unlocked_jobs_description")}
            </Text>
            <TouchableOpacity style={styles.featureButton}>
              <Text style={styles.featureButtonText}>{t("game_view_jobs_button")}</Text>
            </TouchableOpacity>
          </View>
        )}

        {playerLevel >= 5 && (
          <View style={styles.unlockedFeature}>
            <Text style={[styles.unlockedFeatureTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t("game_unlocked_economy_title")}
            </Text>
            <Text style={[styles.unlockedFeatureText, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t("game_unlocked_economy_description")}
            </Text>
            <TouchableOpacity style={styles.featureButton}>
              <Text style={styles.featureButtonText}>{t("game_view_economy_button")}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e0f2fe', // light blue background
  },
  scrollViewContent: {
    padding: 24,
    paddingBottom: 48, // Extra padding for scrollability
  },
  header: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0c4a6e', // dark blue
    flex: 1,
  },
  logoutButton: {
    backgroundColor: '#ef4444', // red-500
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  playerStats: {
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 32,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statText: {
    fontSize: 18,
    color: '#1f2937',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0c4a6e',
    marginBottom: 16,
    width: '100%',
  },
  unlockedFeature: {
    width: '100%',
    backgroundColor: '#dbeafe', // light blue-100
    padding: 20,
    borderRadius: 10,
    marginTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  unlockedFeatureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e40af', // blue-800
    marginBottom: 8,
  },
  unlockedFeatureText: {
    fontSize: 16,
    color: '#374151', // gray-700
    marginBottom: 16,
  },
  featureButton: {
    backgroundColor: '#3b82f6', // blue-500
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignSelf: 'flex-start', // Align button to start
  },
  featureButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
