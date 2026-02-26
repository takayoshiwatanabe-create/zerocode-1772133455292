import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { t } from "@/i18n";
import { getIsRTL } from "@/i18n";
import { useAuth } from "@/hooks/useAuth";
import { ChildActivityCard } from "@/components/parent/ChildActivityCard";
import React, { useState } from "react";
import { PurchaseApprovalModal } from "@/components/parent/PurchaseApprovalModal";
import { SafeAreaView } from "react-native-safe-area-context";
import { TranslationKeys } from "@/i18n/translations";

export default function ParentDashboard() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const isRTL = getIsRTL();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<any | null>(null);
  const [isApprovingRejecting, setIsApprovingRejecting] = useState(false);

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
          {t("parent_dashboard_unauthorized" as TranslationKeys)}
        </Text>
      </View>
    );
  }

  // Mock child data for demonstration
  const mockChildren = [
    { id: "child-1", nickname: "Alice", lastActive: "2024-07-20T10:00:00Z", points: 1250, stockHoldings: 5, pendingPurchases: 2 },
    { id: "child-2", nickname: "Bob", lastActive: "2024-07-19T15:30:00Z", points: 800, stockHoldings: 2, pendingPurchases: 0 },
  ];

  // Mock pending purchases for demonstration
  const mockPendingPurchases = [
    {
      id: "purchase-1",
      childNickname: "Alice",
      itemName: "Magic Wand",
      itemDescription: "A magical wand to cast spells in the game.",
      cost: 500,
      currency: "points",
      timestamp: "2024-07-20T09:30:00Z",
    },
    {
      id: "purchase-2",
      childNickname: "Alice",
      itemName: "Premium Outfit",
      itemDescription: "A special outfit for your avatar.",
      cost: 10,
      currency: "real_money",
      timestamp: "2024-07-20T08:00:00Z",
    },
  ];

  const handleApprovePurchase = async (purchaseId: string) => {
    setIsApprovingRejecting(true);
    console.log(`Approving purchase: ${purchaseId}`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In a real app, update state to remove the approved purchase
    setIsApprovingRejecting(false);
    setIsModalVisible(false);
    setSelectedPurchase(null);
  };

  const handleRejectPurchase = async (purchaseId: string) => {
    setIsApprovingRejecting(true);
    console.log(`Rejecting purchase: ${purchaseId}`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In a real app, update state to remove the rejected purchase
    setIsApprovingRejecting(false);
    setIsModalVisible(false);
    setSelectedPurchase(null);
  };

  const openApprovalModal = (purchase: any) => {
    setSelectedPurchase(purchase);
    setIsModalVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <ScrollView
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
          {t("parent_dashboard_children_overview" as TranslationKeys)}
        </Text>

        <View style={{ width: '100%', rowGap: 24 }}> {/* space-y-6 */}
          {mockChildren.map((child) => (
            <ChildActivityCard key={child.id} child={child} />
          ))}
        </View>

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
          {t("parent_dashboard_pending_approvals" as TranslationKeys)}
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
          {mockPendingPurchases.length > 0 ? (
            <View style={{ rowGap: 16 }}>
              {mockPendingPurchases.map((purchase) => (
                <View
                  key={purchase.id}
                  style={{
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#e5e7eb',
                  }}
                >
                  <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937', textAlign: isRTL ? 'right' : 'left' }}>
                      {purchase.childNickname}: {purchase.itemName}
                    </Text>
                    <Text style={{ fontSize: 14, color: '#4b5563', textAlign: isRTL ? 'right' : 'left' }}>
                      {t("purchase_approval_modal_cost" as TranslationKeys)} {purchase.cost} {purchase.currency === "points" ? t("points_unit" as TranslationKeys) : t("real_money_unit" as TranslationKeys)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => openApprovalModal(purchase)}
                    style={{
                      backgroundColor: '#3b82f6',
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      borderRadius: 6,
                      marginLeft: isRTL ? 0 : 16,
                      marginRight: isRTL ? 16 : 0,
                    }}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>
                      {t("child_activity_card_view_details" as TranslationKeys)}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <Text style={{ color: '#4b5563', textAlign: isRTL ? 'right' : 'left' }}>
              {t("parent_dashboard_no_pending_approvals" as TranslationKeys)}
            </Text>
          )}
        </View>

        <PurchaseApprovalModal
          isVisible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            setSelectedPurchase(null);
          }}
          purchase={selectedPurchase}
          onApprove={handleApprovePurchase}
          onReject={handleRejectPurchase}
          isLoading={isApprovingRejecting}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

