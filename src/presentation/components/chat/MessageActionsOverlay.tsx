import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Share, ViewStyle } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

interface MessageActionsOverlayProps {
  messageText: string;
  isMyMessage: boolean;
  onReply: () => void;
  onForward: () => void;
  onClose: () => void;
  style?: ViewStyle; // Added style prop
}

const MessageActionsOverlay = ({
  messageText,
  isMyMessage,
  onReply,
  onForward,
  onClose,
  style,
}: MessageActionsOverlayProps) => {
  const { colors } = useTheme();

  const handleCopy = () => {
    // In React Native, Clipboard module is usually used.
    // For this prototype, we'll use a simple alert as a placeholder.
    // In a real app, use `Clipboard.setString(messageText);`
    alert("Message copied: " + messageText);
    onClose();
  };

  // The actual Share.share for forwarding might be complex depending on targets.
  // For now, it's just a placeholder.
  const handleForward = async () => {
    try {
      await Share.share({
        message: messageText,
      });
    } catch (error: any) {
      alert(error.message);
    } finally {
      onClose();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundCard }, style]}>
      <TouchableOpacity style={styles.actionButton} onPress={onReply}>
        <Ionicons name="arrow-undo-outline" size={24} color={colors.textPrimary} />
        <Text style={[styles.actionText, { color: colors.textPrimary }]}>Reply</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={handleForward}>
        <Ionicons name="arrow-redo-outline" size={24} color={colors.textPrimary} />
        <Text style={[styles.actionText, { color: colors.textPrimary }]}>Forward</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
        <Ionicons name="copy-outline" size={24} color={colors.textPrimary} />
        <Text style={[styles.actionText, { color: colors.textPrimary }]}>Copy</Text>
      </TouchableOpacity>

      {/* Optionally, add a "More" or "Details" button if needed */}
      {/* <TouchableOpacity style={styles.actionButton} onPress={() => console.log("More options")}>
        <Ionicons name="ellipsis-horizontal-outline" size={24} color={colors.textPrimary} />
        <Text style={[styles.actionText, { color: colors.textPrimary }]}>More</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // Arrange buttons horizontally
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: "absolute", // Will be positioned dynamically in ChatScreen
    zIndex: 1000,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 16,
  },
});

export default MessageActionsOverlay;

