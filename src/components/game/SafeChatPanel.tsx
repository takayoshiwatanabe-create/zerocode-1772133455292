import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from "react-native";
import { t } from "@/i18n";
import { predefinedPhrases } from "@/data/predefinedPhrases";
import { ChatMessage, Id } from "@/types";
import { TranslationKeys } from "@/i18n/translations";

interface SafeChatPanelProps {
  currentUserId: Id;
  recipientId: Id;
  messages: ChatMessage[];
  onSendMessage: (phraseKey: TranslationKeys) => void; // Changed type to TranslationKeys
  isRTL: boolean;
}

export function SafeChatPanel({
  currentUserId,
  recipientId,
  messages,
  onSendMessage,
  isRTL,
}: SafeChatPanelProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <View style={styles.chatPanelContainer}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={{ paddingVertical: 10 }}
      >
        {messages.length === 0 ? (
          <Text style={[styles.noMessagesText, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t("chat_no_messages" as TranslationKeys)}
          </Text>
        ) : (
          messages.map((msg) => {
            const isMyMessage = msg.senderId === currentUserId;
            return (
              <View
                key={msg.id}
                style={[
                  styles.messageBubble,
                  isMyMessage ? styles.myMessage : styles.otherMessage,
                  {
                    // Align messages based on sender and RTL status
                    alignSelf: isMyMessage ? (isRTL ? 'flex-start' : 'flex-end') : (isRTL ? 'flex-end' : 'flex-start'),
                  },
                ]}
              >
                <Text style={[isMyMessage ? styles.myMessageText : styles.otherMessageText, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {t(msg.phraseKey as TranslationKeys)}
                </Text>
                <Text style={[styles.timestampText, { textAlign: isRTL ? 'left' : 'right' }]}>
                  {new Date(msg.timestamp).toLocaleTimeString(t("locale_code" as TranslationKeys), { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>

      <View style={[styles.phraseButtonsContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {predefinedPhrases.map((phrase) => (
          <TouchableOpacity
            key={phrase.key}
            style={styles.phraseButton}
            onPress={() => onSendMessage(phrase.key)}
          >
            <Text style={styles.phraseButtonText}>
              {t(phrase.key as TranslationKeys)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chatPanelContainer: {
    flex: 1,
    backgroundColor: '#f8fafc', // bg-slate-50
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0', // border-slate-200
    overflow: 'hidden',
    marginTop: 16,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  noMessagesText: {
    fontSize: 16,
    color: '#64748b', // text-slate-500
    padding: 10,
    textAlign: 'center',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  myMessage: {
    backgroundColor: '#3b82f6', // bg-blue-500
    borderBottomRightRadius: 2, // Slightly different corner for sender
  },
  otherMessage: {
    backgroundColor: '#e2e8f0', // bg-slate-200
    borderBottomLeftRadius: 2, // Slightly different corner for recipient
  },
  myMessageText: {
    color: '#fff',
    fontSize: 15,
  },
  otherMessageText: {
    color: '#1e293b', // text-slate-800
    fontSize: 15,
  },
  timestampText: {
    fontSize: 10,
    color: '#cbd5e1', // text-slate-400
    marginTop: 4,
  },
  phraseButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 8, // Tailwind's gap-2
  },
  phraseButton: {
    backgroundColor: '#64748b', // bg-slate-500
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  phraseButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

