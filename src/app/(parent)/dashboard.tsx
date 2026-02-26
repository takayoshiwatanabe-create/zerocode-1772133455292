import { View, Text, ScrollView, ActivityIndicator, Platform } from "react-native";
import { t } from "@/i18n";
import { getIsRTL } from "@/i18n";
import { useAuth } from "@/hooks/useAuth";
import { ChildActivityCard } from "@/components/parent/ChildActivityCard";
import React from "react";

export default function ParentDashboard() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const isRTL = getIsRTL();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#4b5563' }}>{t("loading")}</Text>
      </View>
    );
  }

  if (!isAuthenticated || !user) {
    // This case should ideally be handled by _layout.tsx redirecting,
    // but as a fallback, display a message.
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ef4444', textAlign: 'center' }}>
          {t("parent_dashboard_unauthorized")}
        </Text>
      </View>
    );
  }

  // Mock child data for demonstration
  const mockChildren = [
    { id: "child-1", nickname: "Alice", lastActive: "2024-07-20T10:00:00Z", points: 1250, stockHoldings: 5, pendingPurchases: 2 },
    { id: "child-2", nickname: "Bob", lastActive: "2024-07-19T15:30:00Z", points: 800, stockHoldings: 2, pendingPurchases: 0 },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#f3f4f6' }} // bg-gray-100
      contentContainerStyle={{ padding: 24, alignItems: isRTL ? 'flex-end' : 'flex-start' }}
    >
      <Text
        style={{
          fontSize: 36, // text-4xl
          fontWeight: 'bold',
          color: '#1e40af', // text-blue-800
          marginBottom: 24, // mb-6
          textAlign: isRTL ? 'right' : 'left',
          width: '100%',
        }}
      >
        {t("parent_dashboard_title", { nickname: user.nickname })}
      </Text>

      <Text
        style={{
          fontSize: 24, // text-2xl
          fontWeight: 'bold',
          color: '#374151', // text-gray-700
          marginBottom: 16, // mb-4
          textAlign: isRTL ? 'right' : 'left',
          width: '100%',
        }}
      >
        {t("parent_dashboard_children_overview")}
      </Text>

      <View style={{ width: '100%', rowGap: 24 }}> {/* space-y-6 */}
        {mockChildren.map((child) => (
          <ChildActivityCard key={child.id} child={child} />
        ))}
      </View>

      {/* Placeholder for other sections like purchase approvals, settings */}
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#374151',
          marginTop: 48, // mt-12
          marginBottom: 16,
          textAlign: isRTL ? 'right' : 'left',
          width: '100%',
        }}
      >
        {t("parent_dashboard_pending_approvals")}
      </Text>
      <View style={{
        width: '100%',
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
      }}>
        <Text style={{ color: '#4b5563', textAlign: isRTL ? 'right' : 'left' }}>
          {t("parent_dashboard_no_pending_approvals")}
        </Text>
      </View>

      {/* Logout Button */}
      {/* This is a placeholder. A proper logout button should be in a header/footer or settings. */}
      {/* <TouchableOpacity
        onPress={logout}
        style={{
          backgroundColor: '#ef4444',
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
          marginTop: 48,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
          {t("logout_button")}
        </Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
}
