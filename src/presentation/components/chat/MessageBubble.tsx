import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";

interface MessageBubbleProps {
  text: string;
  isMe: boolean;
  timestamp: string;
  senderName?: string; // For group chats
  status?: "sent" | "delivered" | "read";
}

const MessageBubble = ({
  text,
  isMe,
  timestamp,
  senderName,
}: MessageBubbleProps) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        isMe ? styles.containerMe : styles.containerThem,
      ]}
    >
      {/* Sender Name for Group Chats (Only for 'Them') */}
      {!isMe && senderName && (
        <Text style={[styles.senderName, { color: colors.textSecondary }]}>
          {senderName}
        </Text>
      )}

      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isMe
              ? colors.primary
              : colors.backgroundChatBubble,
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            { color: isMe ? colors.textInverse : colors.textPrimary },
          ]}
        >
          {text.trim()}
        </Text>
      </View>
      <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
        {timestamp}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: "75%",
    marginVertical: 4,
    paddingHorizontal: 10,
  },
  containerMe: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  containerThem: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  senderName: {
    fontSize: 11,
    marginBottom: 2,
    marginLeft: 4,
  },
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 2,
    marginHorizontal: 4,
  },
});

export default MessageBubble;
