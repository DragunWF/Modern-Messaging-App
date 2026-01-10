import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Message from "../../../domain/entities/message"; // Import Message entity type

interface MessageBubbleProps {
  text: string;
  isMe: boolean;
  timestamp: string;
  senderName?: string; // For group chats
  status?: "sent" | "delivered" | "read";
  reactions?: Record<string, string[]>; // New prop
  onLongPress?: (event: GestureResponderEvent) => void; // New prop for long press
}

const MessageBubble = ({
  text,
  isMe,
  timestamp,
  senderName,
  reactions,
  onLongPress,
}: MessageBubbleProps) => {
  const { colors } = useTheme();
  const hasReactions = reactions && Object.keys(reactions).length > 0;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isMe ? styles.containerMe : styles.containerThem,
      ]}
      onLongPress={onLongPress}
      delayLongPress={500} // Messenger-like delay
    >
      {/* Sender Name for Group Chats (Only for 'Them') */}
      {!isMe && senderName && (
        <Text style={[styles.senderName, { color: colors.textSecondary }]}>
          {senderName}
        </Text>
      )}

      {/* Bubble and Reactions Wrapper */}
      <View style={styles.bubbleWrapper}>
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

        {hasReactions && (
          <View
            style={[
              styles.reactionPill,
              {
                backgroundColor: isMe ? colors.primarySoft : colors.background,
                borderColor: isMe ? colors.primarySoft : colors.background,
              },
              isMe ? styles.reactionPillMe : styles.reactionPillThem,
            ]}
          >
            {/* Logic for top 3 emojis and total count */}
            {Object.entries(reactions!)
              .sort(
                ([, userIdsA], [, userIdsB]) =>
                  userIdsB.length - userIdsA.length
              ) // Sort by count descending
              .slice(0, 3) // Take top 3
              .map(([emoji]) => (
                <Text key={emoji} style={styles.reactionEmoji}>
                  {emoji}
                </Text>
              ))}
            <Text style={[styles.reactionCount, { color: colors.textPrimary }]}>
              {Object.values(reactions!).flat().length}
            </Text>
          </View>
        )}
      </View>

      <Text
        style={[
          styles.timestamp,
          {
            color: colors.textSecondary,
            marginTop: hasReactions ? 14 : 2,
          },
        ]}
      >
        {timestamp}
      </Text>
    </TouchableOpacity>
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
  bubbleWrapper: {
    position: "relative",
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
  reactionPill: {
    position: "absolute",
    bottom: -10, // Adjust to overlap the bubble slightly
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 15,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  reactionPillMe: {
    right: 5, // Position on the right for my messages
  },
  reactionPillThem: {
    left: 5, // Position on the left for others' messages
  },
  reactionEmoji: {
    fontSize: 12,
    marginRight: 2,
  },
  reactionCount: {
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default MessageBubble;
