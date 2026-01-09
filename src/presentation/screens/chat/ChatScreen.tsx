import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useService } from "../../context/ServiceContext";
import ChatHeader from "../../components/chat/ChatHeader";
import MessageBubble from "../../components/chat/MessageBubble";
import ChatInput from "../../components/chat/ChatInput";
import Message from "../../../domain/entities/message";
import User from "../../../domain/entities/user";
import GroupChat from "../../../domain/entities/groupChat";

function ChatScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { user: authUser } = useAuth();
  const { chatUseCases, userUseCases } = useService();

  // Extract params
  const { userId, groupId } = route.params || {};
  const isGroup = !!groupId;

  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatPartner, setChatPartner] = useState<User | null>(null);

  // Cache for resolving sender names: userId -> username
  const [sendersCache, setSendersCache] = useState<Record<string, string>>({});
  // To avoid repeated fetches for the same unknown user
  const fetchingUserIds = useRef<Set<string>>(new Set());

  // Fetch Chat Info (User)
  useEffect(() => {
    const fetchDetails = async () => {
      if (!isGroup && userId) {
        const user = await userUseCases.getUserById(userId);
        setChatPartner(user);
        if (user) {
          setSendersCache((prev) => ({ ...prev, [user.id]: user.username }));
        }
      }
      // If authUser is available, cache their name too
      if (authUser) {
        setSendersCache((prev) => ({
          ...prev,
          [authUser.id]: authUser.username,
        }));
      }
    };
    fetchDetails();
  }, [userId, isGroup, authUser]);

  // Subscribe to Messages
  useEffect(() => {
    if (!authUser?.id) return;
    const otherId = isGroup ? groupId : userId;
    if (!otherId) return;

    const unsubscribe = chatUseCases.subscribeToMessages(
      authUser.id,
      otherId,
      isGroup,
      (newMessages) => {
        newMessages.reverse();
        setMessages(newMessages);
      }
    );

    return () => unsubscribe();
  }, [authUser?.id, userId, groupId, isGroup]);

  // Resolve Sender Name Logic
  const resolveSenderName = (senderId: string) => {
    if (sendersCache[senderId]) return sendersCache[senderId];

    // If we don't know the name and aren't already fetching it, fetch it
    if (!fetchingUserIds.current.has(senderId)) {
      fetchingUserIds.current.add(senderId);
      userUseCases
        .getUserById(senderId)
        .then((user) => {
          if (user) {
            setSendersCache((prev) => ({ ...prev, [user.id]: user.username }));
          }
          fetchingUserIds.current.delete(senderId);
        })
        .catch(() => {
          fetchingUserIds.current.delete(senderId);
        });
    }

    return "Loading..."; // Or return empty string to show nothing while loading
  };

  const handleSend = async (text: string) => {
    if (!authUser?.id) return;
    const receiverId = isGroup ? groupId : userId;
    if (!receiverId) return;

    try {
      await chatUseCases.sendMessage(authUser.id, receiverId, text);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const chatTitle = isGroup ? "Group Chat" : chatPartner?.username || "Chat";

  const chatSubtitle = isGroup
    ? ""
    : chatPartner?.isOnline
    ? "Online"
    : "Offline";

  const formatTime = (dateObj: Date | string) => {
    if (!dateObj) return "";
    const d = new Date(dateObj);
    if (isNaN(d.getTime())) return ""; // Handle invalid dates gracefully
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ChatHeader
        title={chatTitle}
        subtitle={chatSubtitle}
        onBackPress={() => navigation.goBack()}
        onProfilePress={() => {}}
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble
              text={item.content}
              isMe={item.senderId === authUser?.id}
              timestamp={formatTime(item.timestamp)}
              senderName={resolveSenderName(item.senderId)}
            />
          )}
          contentContainerStyle={styles.listContent}
          inverted
        />

        <ChatInput onSend={handleSend} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
});

export default ChatScreen;
