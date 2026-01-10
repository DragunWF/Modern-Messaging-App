import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "../../context/ThemeContext";

interface ChatInputProps {
  onSend: (text: string) => void;
  onTyping?: (isTyping: boolean) => void;
  replyingTo?: { content: string; senderName?: string } | null;
  onCancelReply?: () => void;
  onSendImage?: (uri: string) => void;
}

const ChatInput = ({
  onSend,
  onTyping,
  replyingTo,
  onCancelReply,
  onSendImage,
}: ChatInputProps) => {
  const { colors } = useTheme();
  const [text, setText] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSend = () => {
    if (text.trim().length === 0) return;
    onSend(text);
    setText("");
    // Stop typing immediately on send
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (onTyping) onTyping(false);
  };

  const handleChangeText = (val: string) => {
    setText(val);

    if (onTyping) {
      onTyping(true);

      // Debounce the "stop typing" event
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 2000); // 2 seconds of inactivity means stopped typing
    }
  };

  const handlePickImage = async () => {
    if (!onSendImage) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onSendImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  return (
    <View style={{ backgroundColor: colors.background }}>
      {/* Reply Preview */}
      {replyingTo && (
        <View
          style={[
            styles.replyPreview,
            {
              backgroundColor: colors.backgroundInput,
              borderTopColor: colors.border,
            },
          ]}
        >
          <View
            style={[styles.replyBar, { backgroundColor: colors.primary }]}
          />
          <View style={styles.replyContent}>
            <Text style={[styles.replySender, { color: colors.primary }]}>
              {replyingTo.senderName || "User"}
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.replyText, { color: colors.textSecondary }]}
            >
              {replyingTo.content}
            </Text>
          </View>
          <TouchableOpacity onPress={onCancelReply} style={styles.closeButton}>
            <Ionicons
              name="close-circle"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Input Row */}
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            borderTopWidth: replyingTo ? 0 : 1, // Remove border if reply preview is shown (it has its own)
          },
        ]}
      >
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="add-circle" size={28} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={handlePickImage}>
          <Ionicons name="image-outline" size={26} color={colors.primary} />
        </TouchableOpacity>

        <View
          style={[
            styles.inputWrapper,
            { backgroundColor: colors.backgroundInput },
          ]}
        >
          <TextInput
            style={[styles.input, { color: colors.textPrimary }]}
            placeholder="Message..."
            placeholderTextColor={colors.textPlaceholder}
            multiline
            value={text}
            onChangeText={handleChangeText}
          />
          <TouchableOpacity style={styles.emojiButton}>
            <MaterialIcons
              name="emoji-emotions"
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        {text.trim().length > 0 ? (
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Ionicons name="send" size={24} color={colors.primary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="mic-outline" size={26} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  replyPreview: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  replyBar: {
    width: 4,
    height: "100%",
    borderRadius: 2,
    marginRight: 10,
  },
  replyContent: {
    flex: 1,
    justifyContent: "center",
  },
  replySender: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 2,
  },
  replyText: {
    fontSize: 14,
  },
  closeButton: {
    padding: 4,
  },
  iconButton: {
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2, // Align with input
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 20,
    minHeight: 40,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
  },
  emojiButton: {
    marginLeft: 5,
  },
  sendButton: {
    padding: 6,
    marginBottom: 2,
  },
});

export default ChatInput;
