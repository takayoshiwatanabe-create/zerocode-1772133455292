import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { t, getIsRTL } from "@/i18n";
import { useAuth } from "@/hooks/useAuth";
import { WorldMap } from "@/components/game/WorldMap";
import { useRouter } from "expo-router";
import { Id } from "@/types";
import { JobCard } from "@/components/game/JobCard";
import { TranslationKeys } from "@/i18n/translations";
import { AdViewer } from "@/components/game/AdViewer"; // Import AdViewer
import { useGameEconomy } from "@/hooks/useGameEconomy"; // Import useGameEconomy
import { PointDisplay } from "@/components/game/PointDisplay"; // Import PointDisplay

export default function GameHome() {
  const { user, logout } = useAuth();
  const isRTL = getIsRTL();
  const router = useRouter();
  const { playerPoints, updatePlayerPoints } = useGameEconomy(); // Use game economy hook

  // Mock player progress for progressive disclosure
  const [playerLevel, setPlayerLevel] = useState(1);
  const [currentLocation, setCurrentLocation] = useState<Id>("home_village");

  const handleLogout = async () => {
    await logout();
    router.replace(Platform.OS === 'web' ? "/page" : "/");
  };

  const handleSelectJob = (jobId: string) => {
    console.log("Selected job:", jobId);
    // Navigate to the minigame screen
    router.push(`/(game)/minigame/${jobId}`);
  };

  const handleAdWatched = (pointsEarned: number) => {
    updatePlayerPoints(pointsEarned); // Update points via the hook
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.scrollViewContent, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
        <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={[styles.welcomeText, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t("game_welcome_message", { nickname: user?.nickname || t("player") })}
          </Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>{t("logout_button")}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.playerStats, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={[styles.statText, { textAlign: isRTL ? 'right' : 'left' }]}>{t("game_player_level", { level: playerLevel })}</Text>
          <PointDisplay points={playerPoints} /> {/* Use PointDisplay component */}
        </View>

        <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t("game_world_map_title" as TranslationKeys)}
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

        {/* Ad Viewer Section */}
        <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t("ad_viewer_section_title" as TranslationKeys)}
        </Text>
        <AdViewer onAdWatched={handleAdWatched} />

        {/* Progressive Disclosure: Unlock new features based on playerLevel */}
        {playerLevel >= 1 && ( // Changed to level 1 for initial job visibility
          <View style={styles.unlockedFeature}>
            <Text style={[styles.unlockedFeatureTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t("game_unlocked_jobs_title" as TranslationKeys)}
            </Text>
            <Text style={[styles.unlockedFeatureText, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t("game_unlocked_jobs_description" as TranslationKeys)}
            </Text>
            {/* Display JobCards for available jobs */}
            <View style={styles.jobCardsContainer}>
              <JobCard
                jobId="farmer"
                nameKey={"job_farmer_title" as TranslationKeys}
                descriptionKey={"job_farmer_description" as TranslationKeys}
                requiredLevel={1}
                playerLevel={playerLevel}
                onSelectJob={handleSelectJob}
              />
              <JobCard
                jobId="baker"
                nameKey={"job_baker_title" as TranslationKeys}
                descriptionKey={"job_baker_description" as TranslationKeys}
                requiredLevel={2}
                playerLevel={playerLevel}
                onSelectJob={handleSelectJob}
              />
              {/* Add more job cards as needed, with their respective required levels */}
            </View>
            <TouchableOpacity style={[styles.featureButton, { alignSelf: isRTL ? 'flex-end' : 'flex-start' }]}>
              <Text style={styles.featureButtonText}>{t("game_view_jobs_button" as TranslationKeys)}</Text>
            </TouchableOpacity>
          </View>
        )}

        {playerLevel >= 5 && (
          <View style={styles.unlockedFeature}>
            <Text style={[styles.unlockedFeatureTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t("game_unlocked_economy_title" as TranslationKeys)}
            </Text>
            <Text style={[styles.unlockedFeatureText, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t("game_unlocked_economy_description" as TranslationKeys)}
            </Text>
            <TouchableOpacity style={[styles.featureButton, { alignSelf: isRTL ? 'flex-end' : 'flex-start' }]}>
              <Text style={styles.featureButtonText}>{t("game_view_economy_button" as TranslationKeys)}</Text>
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
    marginTop: 24, // Added margin top to separate sections
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
    // alignSelf: 'flex-start', // Align button to start - This needs to be dynamic for RTL
    marginTop: 16, // Added margin top for separation from job cards
  },
  featureButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  jobCardsContainer: {
    marginTop: 16,
  },
});
