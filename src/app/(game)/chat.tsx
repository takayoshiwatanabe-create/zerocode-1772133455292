import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Platform, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { t, getIsRTL } from "@/i18n";
import { useAuth } from "@/hooks/useAuth";
import { SafeChatPanel } from "@/components/game/SafeChatPanel";
import { Id, ChatMessage } from "@/types";
import { TranslationKeys } from "@/i18n/translations"; // Import TranslationKeys

export default function GameChatScreen() {
  const { user, isLoading: authLoading } = useAuth();
  const isRTL = getIsRTL();

  // Mock state for chat functionality
  const [currentRecipientId, setCurrentRecipientId] = useState<Id | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [availableFriends, setAvailableFriends] = useState<Id[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(true);

  useEffect(() => {
    // Simulate loading friends and initial messages
    const loadChatData = async () => {
      setIsLoadingChat(true);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

      // Mock friends (RULE-SAFETY-003: only mutual friends can chat)
      // For this mock, let's assume 'friend-1' is a mutual friend.
      setAvailableFriends(["friend-1", "friend-2"]); // Added another mock friend

      // Mock initial messages if a recipient is selected
      if (currentRecipientId) {
        setMessages([
          { id: "msg-1", senderId: "friend-1", recipientId: user?.id || "", phraseKey: "chat_phrase_hello", timestamp: Date.now() - 60000 },
          { id: "msg-2", senderId: user?.id || "", recipientId: "friend-1", phraseKey: "chat_phrase_how_are_you", timestamp: Date.now() - 30000 },
        ]);
      } else {
        setMessages([]);
      }
      setIsLoadingChat(false);
    };

    if (!authLoading && user) {
      loadChatData();
    }
  }, [authLoading, user, currentRecipientId]);

  const handleSendMessage = (phraseKey: TranslationKeys) => { // Use TranslationKeys here
    if (!user || !currentRecipientId) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      recipientId: currentRecipientId,
      phraseKey,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
    // In a real app, this would send the message to the server
    console.log("Sending message:", newMessage);
  };

  if (authLoading || isLoadingChat) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>{t("loading")}</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t("chat_error_no_user" as TranslationKeys)}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.scrollViewContent, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
        <Text style={[styles.title, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t("chat_screen_title" as TranslationKeys)}
        </Text>

        {availableFriends.length === 0 ? (
          <Text style={[styles.noFriendsText, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t("chat_no_friends_message" as TranslationKeys)}
          </Text>
        ) : (
          <View style={styles.friendsListContainer}>
            <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t("chat_select_friend" as TranslationKeys)}
            </Text>
            <View style={[styles.friendsList, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              {availableFriends.map((friendId) => (
                <TouchableOpacity
                  key={friendId}
                  style={[
                    styles.friendItem,
                    currentRecipientId === friendId && styles.selectedFriendItem,
                  ]}
                  onPress={() => setCurrentRecipientId(friendId)}
                >
                  <Text style={styles.friendName}>{friendId}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {currentRecipientId && (
              <View style={styles.chatPanelWrapper}>
                <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left', marginTop: 24 }]}>
                  {t("chat_with_friend", { friendName: currentRecipientId })}
                </Text>
                <SafeChatPanel
                  currentUserId={user.id}
                  recipientId={currentRecipientId}
                  messages={messages.filter(
                    (msg) =>
                      (msg.senderId === user.id && msg.recipientId === currentRecipientId) ||
                      (msg.senderId === currentRecipientId && msg.recipientId === user.id)
                  )}
                  onSendMessage={handleSendMessage}
                  isRTL={isRTL}
                />
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f9ff', // light blue background
  },
  scrollViewContent: {
    padding: 24,
    paddingBottom: 48,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4b5563',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    padding: 24,
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ef4444',
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0c4a6e',
    marginBottom: 24,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0c4a6e',
    marginBottom: 16,
    width: '100%',
  },
  noFriendsText: {
    fontSize: 18,
    color: '#4b5563',
    marginTop: 20,
    width: '100%',
  },
  friendsListContainer: {
    width: '100%',
  },
  friendsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16, // Tailwind's gap-4
    justifyContent: Platform.OS === 'web' ? 'flex-start' : 'center', // Adjust for web vs native
    marginBottom: 24, // Added margin bottom to separate from chat panel
  },
  friendItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    minWidth: 100,
    alignItems: 'center',
  },
  selectedFriendItem: {
    borderColor: '#3b82f6', // blue-500
    borderWidth: 2,
  },
  friendName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  chatPanelWrapper: {
    marginTop: 24,
    width: '100%',
  },
});

