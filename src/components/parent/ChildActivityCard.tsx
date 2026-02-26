import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { t } from "@/i18n";
import { getIsRTL } from "@/i18n";

interface ChildData {
  id: string;
  nickname: string;
  lastActive: string; // ISO 8601 string
  points: number;
  stockHoldings: number;
  pendingPurchases: number;
}

interface ChildActivityCardProps {
  child: ChildData;
}

export function ChildActivityCard({ child }: ChildActivityCardProps) {
  const isRTL = getIsRTL();

  const formatLastActive = (isoString: string) => {
    const date = new Date(isoString);
    // Use the locale_code from translations for toLocaleDateString
    return date.toLocaleDateString(t("locale_code"), {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View
      style={{
        width: '100%',
        backgroundColor: '#fff',
        padding: 24, // p-6
        borderRadius: 8, // rounded-lg
        shadowColor: '#000', // shadow-lg
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5, // For Android shadow
        flexDirection: isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
        <Text
          style={{
            fontSize: 24, // text-2xl
            fontWeight: 'bold',
            color: '#1f2937', // text-gray-900
            marginBottom: 8, // mb-2
          }}
        >
          {child.nickname}
        </Text>
        <Text style={{ fontSize: 16, color: '#4b5563', marginBottom: 4, textAlign: isRTL ? 'right' : 'left' }}>
          {t("child_activity_card_last_active")} {formatLastActive(child.lastActive)}
        </Text>
        <Text style={{ fontSize: 16, color: '#4b5563', marginBottom: 4, textAlign: isRTL ? 'right' : 'left' }}>
          {t("child_activity_card_points")} {child.points}
        </Text>
        <Text style={{ fontSize: 16, color: '#4b5563', marginBottom: 4, textAlign: isRTL ? 'right' : 'left' }}>
          {t("child_activity_card_stock_holdings")} {child.stockHoldings}
        </Text>
        <Text style={{ fontSize: 16, color: '#4b5563', textAlign: isRTL ? 'right' : 'left' }}>
          {t("child_activity_card_pending_purchases")} {child.pendingPurchases}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => {
          // Navigate to child's detailed activity page (future implementation)
          console.log(`View details for ${child.nickname}`);
        }}
        style={{
          backgroundColor: '#3b82f6', // bg-blue-500
          paddingVertical: 10, // py-2.5
          paddingHorizontal: 20, // px-5
          borderRadius: 6, // rounded-md
          marginLeft: isRTL ? 0 : 16, // ml-4
          marginRight: isRTL ? 16 : 0, // mr-4
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
          {t("child_activity_card_view_details")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
