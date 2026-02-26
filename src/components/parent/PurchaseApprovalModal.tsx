import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Platform } from "react-native";
import { t } from "@/i18n";
import { getIsRTL } from "@/i18n";
import { TranslationKeys } from "@/i18n/translations";

interface Purchase {
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
  purchase: Purchase | null;
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
    return null; // Don't render if no purchase is selected
  }

  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString(t("locale_code" as TranslationKeys), {
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

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t("purchase_approval_modal_child" as TranslationKeys)}
            </Text>
            <Text style={[styles.detailValue, { textAlign: isRTL ? 'right' : 'left' }]}>
              {purchase.childNickname}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t("purchase_approval_modal_item" as TranslationKeys)}
            </Text>
            <Text style={[styles.detailValue, { textAlign: isRTL ? 'right' : 'left' }]}>
              {purchase.itemName}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t("purchase_approval_modal_description" as TranslationKeys)}
            </Text>
            <Text style={[styles.detailValue, { textAlign: isRTL ? 'right' : 'left' }]}>
              {purchase.itemDescription}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t("purchase_approval_modal_cost" as TranslationKeys)}
            </Text>
            <Text style={[styles.detailValue, { textAlign: isRTL ? 'right' : 'left' }]}>
              {purchase.cost} {purchase.currency === "points" ? t("points_unit" as TranslationKeys) : t("real_money_unit" as TranslationKeys)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t("purchase_approval_modal_requested_at" as TranslationKeys)}
            </Text>
            <Text style={[styles.detailValue, { textAlign: isRTL ? 'right' : 'left' }]}>
              {formatTimestamp(purchase.timestamp)}
            </Text>
          </View>

          <View style={[styles.buttonContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <TouchableOpacity
              style={[styles.button, styles.approveButton, isLoading && styles.buttonDisabled]}
              onPress={() => onApprove(purchase.id)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{t("purchase_approval_modal_approve_button" as TranslationKeys)}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton, isLoading && styles.buttonDisabled]}
              onPress={() => onReject(purchase.id)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{t("purchase_approval_modal_reject_button" as TranslationKeys)}</Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.closeButton, { alignSelf: isRTL ? 'flex-end' : 'flex-start' }]}
            onPress={onClose}
            disabled={isLoading}
          >
            <Text style={styles.closeButtonText}>{t("purchase_approval_modal_close_button" as TranslationKeys)}</Text>
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
    width: Platform.OS === 'web' ? '40%' : '90%', // Adjust width for web vs native
    maxWidth: 600,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 20,
    width: '100%',
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
    color: '#4b5563',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: '#1f2937',
    flex: 2,
  },
  buttonContainer: {
    marginTop: 30,
    width: '100%',
    justifyContent: 'space-around',
    gap: 10, // Added gap for spacing between buttons
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveButton: {
    backgroundColor: "#22c55e", // green-500
  },
  rejectButton: {
    backgroundColor: "#ef4444", // red-500
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#6b7280", // gray-500
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
