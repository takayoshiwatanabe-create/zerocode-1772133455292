import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { I18nProvider } from "@/i18n/I18nProvider";

export default function RootLayout() {
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

