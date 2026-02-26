import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { t, getIsRTL } from "@/i18n";
import { TranslationKeys } from "@/i18n/translations";

interface JobCardProps {
  jobId: string;
  nameKey: TranslationKeys;
  descriptionKey: TranslationKeys;
  requiredLevel: number;
  playerLevel: number;
  onSelectJob: (jobId: string) => void;
}

export function JobCard({
  jobId,
  nameKey,
  descriptionKey,
  requiredLevel,
  playerLevel,
  onSelectJob,
}: JobCardProps) {
  const isRTL = getIsRTL();
  const isUnlocked = playerLevel >= requiredLevel;

  return (
    <View style={[styles.cardContainer, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
      <Text style={[styles.jobTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
        {t(nameKey)}
      </Text>
      <Text style={[styles.jobDescription, { textAlign: isRTL ? 'right' : 'left' }]}>
        {t(descriptionKey)}
      </Text>
      <View style={[styles.infoRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Text style={styles.requiredLevel}>
          {t("job_card_required_level", { level: requiredLevel })}
        </Text>
        {!isUnlocked && (
          <Text style={styles.lockedText}>
            {t("job_card_locked")}
          </Text>
        )}
      </View>
      <TouchableOpacity
        onPress={() => onSelectJob(jobId)}
        style={[styles.button, !isUnlocked && styles.buttonDisabled]}
        disabled={!isUnlocked}
      >
        <Text style={styles.buttonText}>
          {isUnlocked ? t("job_card_start_button") : t("job_card_unlock_more")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: '100%',
  },
  jobTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0c4a6e',
    marginBottom: 8,
  },
  jobDescription: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  requiredLevel: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '600',
  },
  lockedText: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

