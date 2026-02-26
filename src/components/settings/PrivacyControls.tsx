import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { t, getIsRTL } from "@/i18n";
import { TranslationKeys } from "@/i18n/translations";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { Platform } from "react-native";

interface PrivacyControlsProps {
  userId: string;
}

export function PrivacyControls({ userId }: PrivacyControlsProps) {
  const isRTL = getIsRTL();
  const { logout } = useAuth();
  const router = useRouter();

  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const handleDeleteAccount = () => {
    Alert.alert(
      t("settings_delete_account_confirm_title" as TranslationKeys),
      t("settings_delete_account_confirm_message" as TranslationKeys),
      [
        {
          text: t("settings_delete_account_cancel_button" as TranslationKeys),
          style: "cancel",
          onPress: () => console.log("Account deletion cancelled"),
        },
        {
          text: t("settings_delete_account_confirm_button" as TranslationKeys),
          style: "destructive",
          onPress: async () => {
            setIsDeletingAccount(true);
            setDeleteError(null);
            setDeleteSuccess(null);
            try {
              // Simulate API call for account deletion
              // RULE-TECH-003: User data is deleted within 30 days.
              // For immediate effect in UI, we'll log out the user.
              await new Promise((resolve) => setTimeout(resolve, 2000));
              console.log(`Account deletion requested for user: ${userId}`);
              setDeleteSuccess(t("settings_delete_account_success" as TranslationKeys));
              await logout();
              router.replace(Platform.OS === 'web' ? "/page" : "/");
            } catch (error: any) {
              setDeleteError(error.message || t("settings_delete_account_error" as TranslationKeys));
            } finally {
              setIsDeletingAccount(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={[styles.container, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
      <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
        {t("settings_privacy_title" as TranslationKeys)}
      </Text>
      <Text style={[styles.descriptionText, { textAlign: isRTL ? 'right' : 'left' }]}>
        {t("settings_data_deletion_desc" as TranslationKeys)}
      </Text>
      {deleteError && (
        <Text style={[styles.errorText, { textAlign: isRTL ? 'right' : 'left' }]}>{deleteError}</Text>
      )}
      {deleteSuccess && (
        <Text style={[styles.successText, { textAlign: isRTL ? 'right' : 'left' }]}>{deleteSuccess}</Text>
      )}
      <TouchableOpacity
        style={[styles.deleteButton, isDeletingAccount && styles.deleteButtonDisabled, { alignSelf: isRTL ? 'flex-end' : 'flex-start' }]}
        onPress={handleDeleteAccount}
        disabled={isDeletingAccount}
      >
        {isDeletingAccount ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.deleteButtonText}>
            {t("settings_delete_account_button" as TranslationKeys)}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0c4a6e',
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
    marginTop: 10,
    marginBottom: 10,
  },
  successText: {
    fontSize: 16,
    color: '#10b981', // green-500
    marginTop: 10,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#ef4444', // red-500
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 180,
    marginTop: 16,
  },
  deleteButtonDisabled: {
    backgroundColor: '#fca5a5', // red-300
    opacity: 0.7,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
