import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Platform, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { t, getIsRTL, changeLanguage } from "@/i18n";
import { useAuth } from "@/hooks/useAuth";
import { LanguageSelector } from "@/components/settings/LanguageSelector";
import { TranslationKeys } from "@/i18n/translations";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const isRTL = getIsRTL();
  const router = useRouter();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  const handleLanguageChange = async (langCode: string) => {
    await changeLanguage(langCode);
    // For React Native, I18nManager.forceRTL is handled in _layout.tsx based on getIsRTL.
    // A full app reload might be needed for some native components to fully adapt.
    // For web, the dir attribute on <html> is updated.
  };

  const handleToggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
    // In a real app, this would update user preferences on the server
    console.log("Notifications toggled:", !notificationsEnabled);
  };

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
              await new Promise((resolve) => setTimeout(resolve, 2000));
              console.log(`Account deletion requested for user: ${user?.id}`);
              // RULE-TECH-003: User data is deleted within 30 days.
              // For immediate effect in UI, we'll log out the user.
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

  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>{t("loading")}</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t("settings_error_no_user" as TranslationKeys)}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.scrollViewContent, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
        <Text style={[styles.title, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t("settings_screen_title" as TranslationKeys)}
        </Text>

        {/* Language Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t("settings_language_title" as TranslationKeys)}
          </Text>
          <LanguageSelector onLanguageChange={handleLanguageChange} />
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t("settings_notifications_title" as TranslationKeys)}
          </Text>
          <TouchableOpacity
            style={[styles.toggleButton, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            onPress={handleToggleNotifications}
          >
            <Text style={styles.toggleButtonText}>
              {t("settings_notifications_toggle" as TranslationKeys)}
            </Text>
            <View style={[styles.toggleSwitchContainer, notificationsEnabled ? styles.toggleSwitchOn : styles.toggleSwitchOff]}>
              <View style={[styles.toggleSwitchThumb, notificationsEnabled ? styles.toggleSwitchThumbOn : styles.toggleSwitchThumbOff]} />
            </View>
          </TouchableOpacity>
          <Text style={[styles.descriptionText, { textAlign: isRTL ? 'right' : 'left' }]}>
            {notificationsEnabled ? t("settings_notifications_enabled_desc" as TranslationKeys) : t("settings_notifications_disabled_desc" as TranslationKeys)}
          </Text>
        </View>

        {/* Privacy & Data Management */}
        <View style={styles.section}>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f9ff', // light blue background
  },
  scrollViewContent: {
    padding: 24,
    paddingBottom: 48,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    padding: 24,
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ef4444',
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    color: '#10b981', // green-500
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0c4a6e',
    marginBottom: 24,
    width: '100%',
  },
  section: {
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
  toggleButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  toggleButtonText: {
    fontSize: 18,
    color: '#1f2937',
    fontWeight: '600',
  },
  toggleSwitchContainer: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleSwitchOn: {
    backgroundColor: '#22c55e', // green-500
  },
  toggleSwitchOff: {
    backgroundColor: '#d1d5db', // gray-300
  },
  toggleSwitchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  toggleSwitchThumbOn: {
    transform: [{ translateX: 20 }],
  },
  toggleSwitchThumbOff: {
    transform: [{ translateX: 0 }],
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
