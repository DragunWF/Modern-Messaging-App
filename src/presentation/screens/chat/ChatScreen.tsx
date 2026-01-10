import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  GestureResponderEvent,
  TouchableWithoutFeedback,
  Dimensions, // Added Dimensions
  ViewStyle, // Added ViewStyle
} from "react-native";
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useService } from "../../context/ServiceContext";
import ChatHeader from "../../components/chat/ChatHeader";
import MessageBubble from "../../components/chat/MessageBubble";
import ChatInput from "../../components/chat/ChatInput";
import TypingIndicator from "../../components/chat/TypingIndicator";
import ReactionPicker from "../../components/chat/ReactionPicker"; // Import new component
import MessageActionsOverlay from "../../components/chat/MessageActionsOverlay"; // Import new component
import Message from "../../../domain/entities/message";
import User from "../../../domain/entities/user";
import GroupChat from "../../../domain/entities/groupChat";

interface SelectedMessageState {
  message: Message;
  pageY: number; // Y position of the long-press event
  pageX: number; // X position of the long-press event
}

function ChatScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { user: authUser } = useAuth();
  const { chatUseCases, userUseCases } = useService();
  const { height: screenHeight } = Dimensions.get("window"); // Get screen dimensions

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

  // Typing status state
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // Message Options Overlay state
  const [selectedMessage, setSelectedMessage] =
    useState<SelectedMessageState | null>(null);

  // Reply state
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

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
        setMessages(newMessages);
      }
    );

    return () => unsubscribe();
  }, [authUser?.id, userId, groupId, isGroup]);

  // Subscribe to Typing Status
  useEffect(() => {
    if (!authUser?.id) return;
    const otherId = isGroup ? groupId : userId;
    if (!otherId) return;

    const unsubscribe = chatUseCases.subscribeToTypingStatus(
      authUser.id,
      otherId,
      isGroup,
      (usersTyping) => {
        setTypingUsers(usersTyping);
      }
    );

    return () => unsubscribe();
  }, [authUser?.id, userId, groupId, isGroup]);

  // Mark as read on focus
  useFocusEffect(
    useCallback(() => {
      const otherId = isGroup ? groupId : userId;
      if (authUser?.id && otherId) {
        chatUseCases.markChatAsRead(authUser.id, otherId, isGroup);
      }
    }, [authUser?.id, userId, groupId, isGroup])
  );

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
      const replyData = replyingTo
        ? {
            content: replyingTo.content,
            senderId: replyingTo.senderId,
            senderName: resolveSenderName(replyingTo.senderId),
          }
        : undefined;

      await chatUseCases.sendMessage(authUser.id, receiverId, text, replyData);
      setReplyingTo(null); // Clear reply state after sending
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleTyping = (isTyping: boolean) => {
    if (!authUser?.id) return;
    const receiverId = isGroup ? groupId : userId;
    if (!receiverId) return;

    chatUseCases
      .sendTypingStatus(authUser.id, receiverId, isGroup, isTyping)
      .catch((err) => console.error("Error sending typing status", err));
  };

  const chatTitle = isGroup ? "Group Chat" : chatPartner?.username || "Chat";

  // Default subtitle for header (online status for 1-on-1, empty for groups)
  const chatHeaderSubtitle = isGroup
    ? ""
    : chatPartner?.isOnline
    ? "Online"
    : "Offline";

  // Typing indicator text for the bottom
  let typingIndicatorText = "";
  if (typingUsers.length > 0) {
    if (isGroup) {
      typingIndicatorText = "Someone is typing"; // Removed "..." as component adds dots
    } else {
      // 1-on-1: "Name is typing"
      typingIndicatorText = `${chatPartner?.username || "User"} is typing`;
    }
  }

  const formatTime = (timestamp: number) => {
    if (!timestamp) return "";
    const d = new Date(timestamp);
    if (isNaN(d.getTime())) return ""; // Handle invalid dates gracefully
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleMessageLongPress = useCallback(
    (message: Message, event: GestureResponderEvent) => {
      setSelectedMessage({
        message,
        pageY: event.nativeEvent.pageY,
        pageX: event.nativeEvent.pageX,
      });
    },
    []
  );

  const handleCloseOverlay = useCallback(() => {
    setSelectedMessage(null);
  }, []);

  const handleSelectReaction = useCallback(
    async (emoji: string) => {
      if (!selectedMessage?.message || !authUser?.id) return;

      try {
        await chatUseCases.toggleReaction(
          selectedMessage.message.id,
          authUser.id,
          emoji
        );
      } catch (error) {
        console.error("Failed to toggle reaction", error);
      }

      handleCloseOverlay();
    },
    [selectedMessage?.message, authUser?.id, handleCloseOverlay]
  );

  const handleReply = useCallback(() => {
    if (!selectedMessage?.message) return;
    setReplyingTo(selectedMessage.message);
    handleCloseOverlay();
  }, [selectedMessage?.message, handleCloseOverlay]);

  const handleForward = useCallback(() => {
    if (!selectedMessage?.message) return;
    console.log(`Forward message: ${selectedMessage.message.id}`);
    // TODO: Implement forward feature
    handleCloseOverlay();
  }, [selectedMessage?.message, handleCloseOverlay]);

  // Calculate overlay positions dynamically
  const getReactionPickerPosition = (): ViewStyle => {
    if (!selectedMessage) return {};
    const top = selectedMessage.pageY - 60; // Slightly higher
    // Ensure it doesn't clip top of screen
    const clampedTop = Math.max(top, 100); // 100 is roughly header height + status bar
    return {
      top: clampedTop,
      left: Math.min(Math.max(selectedMessage.pageX - 100, 20), 200), // Clamp horizontally too
    };
  };

  const getMessageActionsPosition = (): ViewStyle => {
    if (!selectedMessage) return {};
    // If reaction picker pushed down due to top clip, push actions down too
    const top = selectedMessage.pageY + 20;
    return {
      top: Math.max(top, 160),
      left: Math.min(Math.max(selectedMessage.pageX - 100, 20), 100),
    };
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ChatHeader
        title={chatTitle}
        subtitle={chatHeaderSubtitle} // Use the default subtitle
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
              reactions={item.reactions} // Pass reactions
              replyTo={item.replyTo} // Pass reply info
              onLongPress={(event) => handleMessageLongPress(item, event)} // New handler
            />
          )}
          contentContainerStyle={styles.listContent}
          inverted
        />

        <TypingIndicator text={typingIndicatorText} />

        <ChatInput
          onSend={handleSend}
          onTyping={handleTyping}
          replyingTo={
            replyingTo
              ? {
                  content: replyingTo.content,
                  senderName: resolveSenderName(replyingTo.senderId),
                }
              : null
          }
          onCancelReply={() => setReplyingTo(null)}
        />
      </KeyboardAvoidingView>

      {selectedMessage && (
        <TouchableWithoutFeedback onPress={handleCloseOverlay}>
          <View style={styles.overlayBackdrop} />
        </TouchableWithoutFeedback>
      )}

      {selectedMessage && (
        <ReactionPicker
          onSelectReaction={handleSelectReaction}
          onClose={handleCloseOverlay}
          style={getReactionPickerPosition()}
        />
      )}

      {selectedMessage && (
        <MessageActionsOverlay
          messageText={selectedMessage.message.content}
          isMyMessage={selectedMessage.message.senderId === authUser?.id}
          onReply={handleReply}
          onForward={handleForward}
          onClose={handleCloseOverlay}
          style={getMessageActionsPosition()}
        />
      )}
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
  overlayBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 999,
  },
});

export default ChatScreen;
