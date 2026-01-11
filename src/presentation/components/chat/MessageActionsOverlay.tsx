import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  ViewStyle,
  Alert,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

interface MessageActionsOverlayProps {
  messageText: string;
  isMyMessage: boolean;
  onReply: () => void;
  onForward: () => void;
  onClose: () => void;
  style?: ViewStyle;
  isVoiceMessage?: boolean;
}

const MessageActionsOverlay = ({
  messageText,
  isMyMessage,
  onReply,
  onForward,
  onClose,
  style,
  isVoiceMessage,
}: MessageActionsOverlayProps) => {
  const { colors } = useTheme();

  const handleCopy = async () => {
    await Clipboard.setStringAsync(messageText);
    Alert.alert("Success", "Message copied to clipboard!");
    onClose();
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.backgroundCard },
        style,
      ]}
    >
      <TouchableOpacity style={styles.actionButton} onPress={onReply}>
        <Ionicons
          name="arrow-undo-outline"
          size={24}
          color={colors.textPrimary}
        />
        <Text style={[styles.actionText, { color: colors.textPrimary }]}>
          Reply
        </Text>
      </TouchableOpacity>

      {!isVoiceMessage && (
        <TouchableOpacity style={styles.actionButton} onPress={onForward}>
          <Ionicons
            name="arrow-redo-outline"
            size={24}
            color={colors.textPrimary}
          />
          <Text style={[styles.actionText, { color: colors.textPrimary }]}>
            Forward
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
        <Ionicons name="copy-outline" size={24} color={colors.textPrimary} />
        <Text style={[styles.actionText, { color: colors.textPrimary }]}>
          Copy
        </Text>
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
