import { Stack } from "expo-router";
import { I18nProvider } from "@/i18n/I18nProvider";
import { useEffect } from "react";
import { I18nManager, Platform } from "react-native";
import { getIsRTL, getLang } from "@/i18n";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/hooks/useAuth";
import { GameEconomyProvider } from "@/hooks/useGameEconomy";
import React from "react";

export default function RootLayout() {
  const lang = getLang();
  const isRTL = getIsRTL(lang);

  useEffect(() => {
    // This effect ensures I18nManager is correctly set for React Native
    // based on the detected language's RTL status.
    // RULE-TECH-004: RTL language support.
    // This needs to be set globally and early for native.
    // For web, the 'dir' attribute on <html> is handled in src/app/layout.tsx.
    if (Platform.OS !== 'web') {
      if (I18nManager.isRTL !== isRTL) {
        I18nManager.forceRTL(isRTL);
        I18nManager.allowRTL(isRTL);
        // For a full application-wide RTL change on native,
        // a complete app reload is often required.
        // This is a known limitation with React Native's I18nManager.
        // For now, we set it, and individual components will react to `getIsRTL()`.
        // If a full reload is needed, you might use `Updates.reloadAsync()` from `expo-updates`.
      }
    }
  }, [isRTL]);

  return (
    <I18nProvider>
      <AuthProvider>
        <GameEconomyProvider>
          <SafeAreaProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="page" options={{ headerShown: false }} />
              <Stack.Screen name="(parent)" options={{ headerShown: false }} />
              <Stack.Screen name="(game)" options={{ headerShown: false }} />
              <Stack.Screen name="(settings)" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
          </SafeAreaProvider>
        </GameEconomyProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
