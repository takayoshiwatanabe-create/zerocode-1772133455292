import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { t, getIsRTL } from "@/i18n";
import { TranslationKeys } from "@/i18n/translations";

interface PointDisplayProps {
  points: number;
}

export function PointDisplay({ points }: PointDisplayProps) {
  const isRTL = getIsRTL();

  return (
    <View style={[styles.container, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
      <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>{t("game_player_points_label" as TranslationKeys)}</Text>
      <Text style={[styles.value, { textAlign: isRTL ? 'right' : 'left' }]}>{points}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4, // Added gap for spacing between label and value
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af', // blue-800
  },
  value: {
    fontSize: 18,
    color: '#1f2937',
    fontWeight: '600',
  },
});
