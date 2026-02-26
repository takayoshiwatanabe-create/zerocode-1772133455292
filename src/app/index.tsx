import { Text, View, StyleSheet, Platform } from "react-native";
import { t } from "@/i18n";
import { getIsRTL, getLang } from "@/i18n";
import { AuthForm } from "@/components/auth/AuthForm";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TranslationKeys } from "@/i18n/translations";
import React from "react"; // Import React

export default function HomePage() {
  const insets = useSafeAreaInsets();
  const currentLang = getLang();
  const isRTL = getIsRTL(currentLang);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          // Apply text direction for the whole container on native
          direction: isRTL ? "rtl" : "ltr",
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            textAlign: isRTL ? "right" : "left",
          },
        ]}
      >
        {t("app_name" as TranslationKeys)}
      </Text>
      <Text
        style={[
          styles.subtitle,
          {
            textAlign: isRTL ? "right" : "left",
            marginBottom: 32,
          },
        ]}
      >
        {t("welcome_message" as TranslationKeys)}
      </Text>
      <AuthForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: '#fff', // Added background color for consistency
  },
  title: {
    fontSize: Platform.OS === 'web' ? 40 : 32, // Adjusted from 40 to 32 for better fit on mobile, keeping web at 40
    fontWeight: "bold",
    color: "#1d4ed8",
    marginBottom: 16,
  },
  subtitle: {
    marginTop: 16, // Adjusted from 20 to 16 for better fit on mobile
    fontSize: Platform.OS === 'web' ? 20 : 18, // Adjusted from 20 to 18 for better fit on mobile
    color: "#374151",
  },
});

