import { Stack } from "expo-router";
import { I18nProvider } from "@/i18n/I18nProvider";
import { getLang, getIsRTL } from "@/i18n";
import { useEffect } from "react";
import { I18nManager } from "react-native";

export default function RootLayout() {
  const lang = getLang();
  const isRTL = getIsRTL(lang);

  useEffect(() => {
    // Set RTL for the entire app based on detected language
    // This logic is already handled within I18nProvider's useEffect for React Native.
    // Duplicating it here is redundant and can cause issues.
    // The I18nProvider should be the single source of truth for I18nManager configuration.
    // Removing this block.
  }, [isRTL]);

  return (
    <I18nProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        {/* Add other screens here */}
      </Stack>
    </I18nProvider>
  );
}
