import { Stack } from "expo-router";
import { I18nProvider } from "@/i18n/I18nProvider";
import { useEffect } from "react";
import { I18nManager, Platform } from "react-native";
import { getIsRTL, getLang } from "@/i18n";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/hooks/useAuth";
import { GameEconomyProvider } from "@/hooks/useGameEconomy"; // Import GameEconomyProvider
import React from "react";

export default function RootLayout() {
  const lang = getLang();
  const isRTL = getIsRTL(lang);

  useEffect(() => {
    // This effect ensures I18nManager is correctly set for React Native
    // based on the detected language's RTL status.
    if (Platform.OS !== 'web') { // Only apply for React Native
      if (I18nManager.isRTL !== isRTL) {
        I18nManager.forceRTL(isRTL);
        I18nManager.allowRTL(isRTL);
        // A full app reload might be necessary for some components to fully adapt.
        // In a real application, this might involve a user prompt or more complex state management.
        // For now, we rely on Expo Router's hot reloading or a manual restart for full effect.
      }
    }
  }, [isRTL]);

  return (
    <I18nProvider>
      <AuthProvider>
        <GameEconomyProvider> {/* Wrap with GameEconomyProvider */}
          <SafeAreaProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="page" options={{ headerShown: false }} />
              <Stack.Screen name="(parent)" options={{ headerShown: false }} />
              <Stack.Screen name="(game)" options={{ headerShown: false }} />
              {/* Add other screens here */}
            </Stack>
            <StatusBar style="auto" />
          </SafeAreaProvider>
        </GameEconomyProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
