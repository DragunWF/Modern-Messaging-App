import React, { useState } from "react";
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
import ChatHeader from "../../components/chat/ChatHeader";
import MessageBubble from "../../components/chat/MessageBubble";
import ChatInput from "../../components/chat/ChatInput";

// Mock Data for UI Layout
const MOCK_MESSAGES = [
  {
    id: "1",
    text: "Hey! How's it going?",
    isMe: false,
    timestamp: "10:00 AM",
    senderName: "Alice",
  },
  {
    id: "2",
    text: "I'm good, just working on this new app layout. It's coming along nicely!",
    isMe: true,
    timestamp: "10:02 AM",
    senderName: "Me",
  },
  {
    id: "3",
    text: "That sounds awesome! Can't wait to see it.",
    isMe: false,
    timestamp: "10:03 AM",
    senderName: "Alice",
  },
  {
    id: "4",
    text: "What tech stack are you using?",
    isMe: false,
    timestamp: "10:03 AM",
    senderName: "Alice",
  },
  {
    id: "5",
    text: "React Native with Expo and Firebase. The classic combo.",
    isMe: true,
    timestamp: "10:05 AM",
    senderName: "Me",
  },
  {
    id: "6",
    text: "Nice choice! Keeps things flexible.",
    isMe: false,
    timestamp: "10:06 AM",
    senderName: "Alice",
  },
  {
    id: "7",
    text: "Exactly. Btw, are we still on for the meeting later?",
    isMe: true,
    timestamp: "10:07 AM",
    senderName: "Me",
  },
];

function ChatScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<any>();

  // Extract params (real implementation will use these)
  const { userId, groupId } = route.params || {};

  // Mock State for UI
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const isGroup = !!groupId;
  const chatTitle = isGroup ? "Dev Team Group" : "Alice";
  const chatSubtitle = isGroup ? "5 members" : "Active now";

  const handleSend = (text: string) => {
    // Optimistic UI update for demo
    const newMessage = {
      id: Date.now().toString(),
      text,
      isMe: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      senderName: "Me",
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <ChatHeader
        title={chatTitle}
        subtitle={chatSubtitle}
        onBackPress={() => navigation.goBack()}
        onProfilePress={() => console.log("Profile Pressed")}
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <FlatList
          data={[...messages].reverse()} // Reverse for inverted list
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble
              text={item.text}
              isMe={item.isMe}
              timestamp={item.timestamp}
              senderName={isGroup ? item.senderName : undefined}
            />
          )}
          contentContainerStyle={styles.listContent}
          inverted
        />

        {/* Input Area */}
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
