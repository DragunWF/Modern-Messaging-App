import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
  Image,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import Message from "../../../domain/entities/message"; // Import Message entity type

interface MessageBubbleProps {
  text: string;
  isMe: boolean;
  timestamp: string;
  senderName?: string; // For group chats
  status?: "sent" | "delivered" | "read";
  reactions?: Record<string, string[]>; // New prop
  replyTo?: {
    content: string;
    senderId: string;
    senderName?: string;
  };
  imageUrl?: string; // New prop for image
  fileUrl?: string; // New prop for file
  onLongPress?: (event: GestureResponderEvent) => void; // New prop for long press
  isForwarded?: boolean; // New prop for forwarded messages
}

const MessageBubble = ({
  text,
  isMe,
  timestamp,
  senderName,
  reactions,
  replyTo,
  imageUrl,
  fileUrl,
  onLongPress,
  isForwarded,
}: MessageBubbleProps) => {
  const { colors } = useTheme();
  // console.log("MessageBubble props:", { text, fileUrl, isMe }); // Debug
  const hasReactions = reactions && Object.keys(reactions).length > 0;

  const handleOpenFile = () => {
    if (fileUrl) {
      Linking.openURL(fileUrl).catch((err) =>
        console.error("Failed to open URL:", err)
      );
    }
  };

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
          {/* Forwarded Label */}
          {isForwarded && (
            <View style={styles.forwardedContainer}>
              <Ionicons
                name="arrow-redo"
                size={12}
                color={isMe ? "rgba(255,255,255,0.7)" : colors.textSecondary}
                style={styles.forwardedIcon}
              />
              <Text
                style={[
                  styles.forwardedText,
                  {
                    color: isMe
                      ? "rgba(255,255,255,0.7)"
                      : colors.textSecondary,
                  },
                ]}
              >
                Forwarded
              </Text>
            </View>
          )}

          {/* Reply Quote Block */}
          {replyTo && (
            <View
              style={[
                styles.replyContainer,
                {
                  backgroundColor: isMe
                    ? "rgba(0,0,0,0.1)"
                    : "rgba(0,0,0,0.05)",
                  borderLeftColor: isMe ? colors.textInverse : colors.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.replySender,
                  { color: isMe ? colors.textInverse : colors.primary },
                ]}
              >
                {replyTo.senderName || "User"}
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.replyText,
                  {
                    color: isMe
                      ? "rgba(255,255,255,0.8)"
                      : colors.textSecondary,
                  },
                ]}
              >
                {replyTo.content}
              </Text>
            </View>
          )}

          {/* Image Message */}
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={styles.messageImage}
              resizeMode="cover"
            />
          )}

          {/* File Message */}
          {fileUrl && (
            <TouchableOpacity
              style={[
                styles.fileContainer,
                {
                  backgroundColor: "rgba(0,0,0,0.2)", // Make it darker
                  borderColor: isMe ? colors.textInverse : colors.primary,
                  borderWidth: 1,
                },
              ]}
              onPress={handleOpenFile}
            >
              <Ionicons
                name="attach" // Use 'attach' which is universally safe
                size={24}
                color={isMe ? colors.textInverse : colors.textPrimary}
              />
              <Text
                style={[
                  styles.fileText,
                  { color: isMe ? colors.textInverse : colors.textPrimary },
                ]}
                numberOfLines={1}
              >
                Attachment
              </Text>
            </TouchableOpacity>
          )}

          {/* Text Message (Only show if not empty or specific placeholder) */}
          {text && text !== "Sent an image" && text !== "Sent a file" && (
            <Text
              style={[
                styles.text,
                { color: isMe ? colors.textInverse : colors.textPrimary },
                (imageUrl || fileUrl) && { marginTop: 4 }, // Add margin if image/file exists
              ]}
            >
              {text.trim()}
            </Text>
          )}
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
  // New Styles for Reply
  replyContainer: {
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  replySender: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 2,
  },
  replyText: {
    fontSize: 12,
  },
  // New Styles for Image
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginBottom: 2,
  },
  // New Styles for File
  fileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginBottom: 2,
    minWidth: 150,
  },
  fileText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  // Forwarded Label Styles
  forwardedContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  forwardedIcon: {
    marginRight: 4,
  },
  forwardedText: {
    fontSize: 12,
    fontStyle: "italic",
  },
});

export default MessageBubble;
