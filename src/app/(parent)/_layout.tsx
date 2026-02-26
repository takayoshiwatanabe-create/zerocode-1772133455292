import { Stack, Redirect } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { ActivityIndicator, View, Text, Platform } from "react-native";
import { t } from "@/i18n";
import React from "react";

export default function ParentLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} testID="activity-indicator-container">
        <ActivityIndicator size="large" color="#2563eb" testID="activity-indicator" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#4b5563' }}>{t("loading")}</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    // Only authenticated parents should access this route group.
    // Redirect to the login page if not authenticated.
    // For web, redirect to /page.tsx, for native, redirect to /index.tsx
    return <Redirect href={Platform.OS === 'web' ? "/page" : "/"} />;
  }

  return (
    <Stack>
      <Stack.Screen name="dashboard" options={{ title: t("parent_dashboard_title_short"), headerShown: false }} />
      <Stack.Screen name="child-details/[id]" options={{ title: t("child_details_title"), headerShown: false }} />
    </Stack>
  );
}
