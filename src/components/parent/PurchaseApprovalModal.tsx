import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, Platform, ActivityIndicator } from "react-native";
import { t } from "@/i18n";
import { getIsRTL } from "@/i18n";
import { TranslationKeys } from "@/i18n/translations";

interface PurchaseItem {
  id: string;
  childNickname: string;
  itemName: string;
  itemDescription: string;
  cost: number;
  currency: "points" | "real_money";
  timestamp: string;
}

interface PurchaseApprovalModalProps {
  isVisible: boolean;
  onClose: () => void;
  purchase: PurchaseItem | null;
  onApprove: (purchaseId: string) => void;
  onReject: (purchaseId: string) => void;
  isLoading: boolean;
}

export function PurchaseApprovalModal({
  isVisible,
  onClose,
  purchase,
  onApprove,
  onReject,
  isLoading,
}: PurchaseApprovalModalProps) {
  const isRTL = getIsRTL();

  if (!purchase) {
    return null;
  }

  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(t("locale_code" as TranslationKeys), {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <Text style={[styles.modalTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t("purchase_approval_modal_title" as TranslationKeys)}
          </Text>

          <View style={[styles.detailRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={styles.detailLabel}>{t("purchase_approval_modal_child_name" as TranslationKeys)}</Text>
            <Text style={[styles.detailValue, { textAlign: isRTL ? 'left' : 'right' }]}>{purchase.childNickname}</Text>
          </View>
          <View style={[styles.detailRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={styles.detailLabel}>{t("purchase_approval_modal_item_name" as TranslationKeys)}</Text>
            <Text style={[styles.detailValue, { textAlign: isRTL ? 'left' : 'right' }]}>{purchase.itemName}</Text>
          </View>
          <View style={[styles.detailRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={styles.detailLabel}>{t("purchase_approval_modal_item_description" as TranslationKeys)}</Text>
            <Text style={[styles.detailValue, { textAlign: isRTL ? 'left' : 'right' }]}>{purchase.itemDescription}</Text>
          </View>
          <View style={[styles.detailRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={styles.detailLabel}>{t("purchase_approval_modal_cost" as TranslationKeys)}</Text>
            <Text style={[styles.detailValue, { textAlign: isRTL ? 'left' : 'right' }]}>
              {purchase.cost} {purchase.currency === "points" ? t("points_unit" as TranslationKeys) : t("real_money_unit" as TranslationKeys)}
            </Text>
          </View>
          <View style={[styles.detailRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={styles.detailLabel}>{t("purchase_approval_modal_timestamp" as TranslationKeys)}</Text>
            <Text style={[styles.detailValue, { textAlign: isRTL ? 'left' : 'right' }]}>{formatTimestamp(purchase.timestamp)}</Text>
          </View>

          <View style={[styles.buttonContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <TouchableOpacity
              style={[styles.button, styles.approveButton, isLoading && styles.buttonDisabled]}
              onPress={() => onApprove(purchase.id)}
              disabled={isLoading}
            >
              {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{t("purchase_approval_modal_approve_button" as TranslationKeys)}</Text>}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton, isLoading && styles.buttonDisabled]}
              onPress={() => onReject(purchase.id)}
              disabled={isLoading}
            >
              {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{t("purchase_approval_modal_reject_button" as TranslationKeys)}</Text>}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.closeButton, isLoading && styles.buttonDisabled]}
            onPress={onClose}
            disabled={isLoading}
          >
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{t("purchase_approval_modal_close_button" as TranslationKeys)}</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: Platform.OS === 'web' ? '50%' : '90%', // Adjust width for web vs mobile
    maxWidth: 600,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: '#1e40af', // text-blue-800
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151', // text-gray-700
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: '#4b5563', // text-gray-600
    flex: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    width: '100%',
  },
  button: {
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 2,
    minWidth: 120,
    marginHorizontal: 5,
    justifyContent: 'center', // Center content for ActivityIndicator
    alignItems: 'center', // Center content for ActivityIndicator
  },
  approveButton: {
    backgroundColor: '#22c55e', // bg-green-500
  },
  rejectButton: {
    backgroundColor: '#ef4444', // bg-red-500
  },
  closeButton: {
    backgroundColor: '#6b7280', // bg-gray-500
    marginTop: 15,
    alignSelf: 'center',
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
