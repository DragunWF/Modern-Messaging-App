import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

interface ReactionPickerProps {
  onSelectReaction: (emoji: string) => void;
  onClose: () => void;
  style?: ViewStyle;
}

const emojis = ["❤️", "😂", "😮", "😢", "😡", "👍"]; // Preset emojis

const ReactionPicker = ({
  onSelectReaction,
  onClose,
  style,
}: ReactionPickerProps) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.backgroundCard },
        style,
      ]}
    >
      {emojis.map((emoji) => (
        <TouchableOpacity
          key={emoji}
          style={styles.emojiButton}
          onPress={() => onSelectReaction(emoji)}
        >
          <Text style={styles.emojiText}>{emoji}</Text>
        </TouchableOpacity>
      ))}
      {/* Optional: "More" button for full emoji picker */}
      {/* <TouchableOpacity style={styles.emojiButton} onPress={() => console.log("Open full emoji picker")}>
        <Ionicons name="add-circle-outline" size={24} color={colors.textSecondary} />
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 6,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: "absolute", // Will be positioned dynamically in ChatScreen
    zIndex: 1000,
  },
  emojiButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  emojiText: {
    fontSize: 22,
  },
});

export default ReactionPicker;
