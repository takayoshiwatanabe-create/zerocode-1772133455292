import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform } from "react-native";
import { t, getIsRTL } from "@/i18n";
import { WorldLocation, Id } from "@/types";
import { TranslationKeys } from "@/i18n/translations";

interface WorldMapProps {
  playerLevel: number;
  currentLocation: Id;
  onLocationSelect: (locationId: Id) => void;
}

// Mock world locations data
const mockWorldLocations: WorldLocation[] = [
  {
    id: "home_village",
    nameKey: "location_home_village",
    descriptionKey: "location_home_village_desc",
    coordinates: { x: 50, y: 50 }, // Percentage coordinates for positioning
    jobsAvailable: ["farmer", "baker"],
  },
  {
    id: "forest_outpost",
    nameKey: "location_forest_outpost",
    descriptionKey: "location_forest_outpost_desc",
    coordinates: { x: 20, y: 70 },
    jobsAvailable: ["lumberjack", "hunter"],
  },
  {
    id: "mountain_peak",
    nameKey: "location_mountain_peak",
    descriptionKey: "location_mountain_peak_desc",
    coordinates: { x: 80, y: 20 },
    jobsAvailable: ["miner", "explorer"],
  },
  {
    id: "desert_oasis",
    nameKey: "location_desert_oasis",
    descriptionKey: "location_desert_oasis_desc",
    coordinates: { x: 70, y: 80 },
    jobsAvailable: ["merchant", "caravan_guard"],
  },
];

export function WorldMap({ playerLevel, currentLocation, onLocationSelect }: WorldMapProps) {
  const isRTL = getIsRTL();

  return (
    <View style={styles.mapContainer}>
      {/* Background image for the map (mocked or actual) */}
      <Image
        source={{ uri: 'https://via.placeholder.com/600x400/a7f3d0/065f46?text=World+Map' }} // Placeholder map image
        style={styles.mapImage}
        accessibilityLabel={t("game_world_map_alt_text")}
      />

      {mockWorldLocations.map((location) => {
        // Progressive Disclosure: Only show locations accessible by player level
        // For simplicity, let's say level 1 unlocks Home Village, level 2 unlocks Forest Outpost, etc.
        const requiredLevel = mockWorldLocations.indexOf(location) + 1;
        const isAccessible = playerLevel >= requiredLevel;
        const isCurrent = currentLocation === location.id;

        return (
          <TouchableOpacity
            key={location.id}
            style={[
              styles.locationPin,
              {
                left: `${location.coordinates.x}%`,
                top: `${location.coordinates.y}%`,
                backgroundColor: isCurrent ? '#fcd34d' : (isAccessible ? '#3b82f6' : '#9ca3af'), // yellow for current, blue for accessible, gray for locked
              },
            ]}
            onPress={() => isAccessible && onLocationSelect(location.id)}
            disabled={!isAccessible}
            accessibilityLabel={t("game_map_location_pin", { locationName: t(location.nameKey as TranslationKeys) })}
          >
            <Text style={styles.locationPinText}>
              {t(location.nameKey as TranslationKeys)}
            </Text>
            {!isAccessible && (
              <View style={styles.lockIcon}>
                <Text style={styles.lockIconText}>🔒</Text>
              </View>
            )}
            {isCurrent && (
              <View style={styles.playerIcon}>
                <Text style={styles.playerIconText}>📍</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}

      <View style={[styles.legendContainer, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
        <Text style={styles.legendTitle}>{t("game_map_legend_title")}</Text>
        <View style={[styles.legendItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={[styles.legendColorBox, { backgroundColor: '#fcd34d' }]} />
          <Text style={styles.legendText}>{t("game_map_legend_current_location")}</Text>
        </View>
        <View style={[styles.legendItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={[styles.legendColorBox, { backgroundColor: '#3b82f6' }]} />
          <Text style={styles.legendText}>{t("game_map_legend_unlocked_location")}</Text>
        </View>
        <View style={[styles.legendItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={[styles.legendColorBox, { backgroundColor: '#9ca3af' }]} />
          <Text style={styles.legendText}>{t("game_map_legend_locked_location")}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    width: '100%',
    aspectRatio: 1.5, // Maintain aspect ratio for the map
    backgroundColor: '#e2e8f0', // light gray background for map area
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  mapImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  locationPin: {
    position: 'absolute',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  locationPinText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  lockIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIconText: {
    fontSize: 12,
    color: '#fff',
  },
  playerIcon: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    transform: [{ translateX: -10 }],
    backgroundColor: '#34d399',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerIconText: {
    fontSize: 12,
    color: '#fff',
  },
  legendContainer: {
    position: 'absolute',
    bottom: 10,
    [getIsRTL() ? 'left' : 'right']: 10, // Adjust position based on RTL
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  legendTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937',
    fontSize: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendColorBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
    marginLeft: getIsRTL() ? 8 : 0, // Adjust margin for RTL
  },
  legendText: {
    fontSize: 12,
    color: '#374151',
  },
});

