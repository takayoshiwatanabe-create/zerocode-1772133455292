import { Stack, Redirect } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { ActivityIndicator, View, Text, Platform, I18nManager } from "react-native";
import { t, getIsRTL } from "@/i18n";
import React, { useEffect } from "react";

export default function SettingsLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const isRTL = getIsRTL();

  useEffect(() => {
    if (Platform.OS !== 'web') {
      // This effect should ideally be managed at a higher level or trigger a full app reload
      // for I18nManager.forceRTL to take full effect across all native components.
      // For now, we ensure the value is set, but visual glitches might occur without a reload.
      if (I18nManager.isRTL !== isRTL) {
        I18nManager.forceRTL(isRTL);
        I18nManager.allowRTL(isRTL);
        // A full app reload might be necessary for some components to fully adapt.
        // For now, we rely on Expo Router's hot reloading or a manual restart for full effect.
        // In a production app, you might prompt the user to restart or handle this more gracefully.
      }
    }
  }, [isRTL]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#4b5563' }}>{t("loading")}</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    // Only authenticated users should access this route group.
    // Redirect to the login page if not authenticated.
    // For web, redirect to /page.tsx, for native, redirect to /index.tsx
    return <Redirect href={Platform.OS === 'web' ? "/page" : "/"} />;
  }

  return (
    <Stack>
      <Stack.Screen name="settings" options={{ title: t("settings_screen_title"), headerShown: false }} />
    </Stack>
  );
}
