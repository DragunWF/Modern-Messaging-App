import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

interface ChatInputProps {
  onSend: (text: string) => void;
  onTyping?: (isTyping: boolean) => void;
}

const ChatInput = ({ onSend, onTyping }: ChatInputProps) => {
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

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
      ]}
    >
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="add-circle" size={28} color={colors.primary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconButton}>
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
