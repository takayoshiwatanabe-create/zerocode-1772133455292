import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { I18nProvider } from "@/i18n/I18nProvider";
import { getIsRTL } from "@/i18n"; // Import getIsRTL for potential layout adjustments

export default function RootLayout() {
  // In Expo Router, the root layout is a good place to set global RTL if needed
  // However, I18nManager.forceRTL is handled within the I18nProvider for React Native
  // so no direct action is needed here beyond wrapping with I18nProvider.

  return (
    <I18nProvider>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: "Home" }} />
          {/* Add other routes here as they are created */}
        </Stack>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </I18nProvider>
  );
}

