import React, { useState, useRef, useEffect } from "react";
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
import * as DocumentPicker from "expo-document-picker";
import { Audio } from "expo-av";
import { useTheme } from "../../context/ThemeContext";

interface ChatInputProps {
  onSend: (text: string) => void;
  onTyping?: (isTyping: boolean) => void;
  replyingTo?: { content: string; senderName?: string } | null;
  onCancelReply?: () => void;
  onSendImage?: (uri: string) => void;
  onSendFile?: (uri: string, name: string) => void;
  onSendVoiceMessage?: (uri: string) => void; // New prop for voice messages
}

const ChatInput = ({
  onSend,
  onTyping,
  replyingTo,
  onCancelReply,
  onSendImage,
  onSendFile,
  onSendVoiceMessage,
}: ChatInputProps) => {
  const { colors } = useTheme();
  const [text, setText] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Audio Recording State
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  useEffect(() => {
    return () => {
      // Cleanup: stop recording if unmounted
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, [recording]);

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

  const handlePickDocument = async () => {
    if (!onSendFile) return;

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        onSendFile(file.uri, file.name);
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "Failed to pick document");
    }
  };

  // --- Voice Recording Logic ---

  const startRecording = async () => {
    try {
      if (permissionResponse?.status !== "granted") {
        console.log("Requesting permission..");
        const perm = await requestPermission();
        if (perm.status !== "granted") {
          Alert.alert(
            "Permission Required",
            "Microphone permission is required to record voice messages."
          );
          return;
        }
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
      Alert.alert("Error", "Failed to start recording.");
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    console.log("Stopping recording..");
    setIsRecording(false);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log("Recording stopped and stored at", uri);

      setRecording(null); // Reset recording object

      if (uri && onSendVoiceMessage) {
        // Simple validation: Ensure duration was long enough if possible (optional)
        onSendVoiceMessage(uri);
      }
    } catch (error) {
      console.error("Failed to stop recording", error);
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
        {/* Hide attachment buttons while recording */}
        {!isRecording && (
          <>
            <TouchableOpacity style={styles.iconButton} onPress={handlePickDocument}>
              <Ionicons name="add-circle" size={28} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={handlePickImage}>
              <Ionicons name="image-outline" size={26} color={colors.primary} />
            </TouchableOpacity>
          </>
        )}

        <View
          style={[
            styles.inputWrapper,
            { backgroundColor: colors.backgroundInput },
            isRecording && { backgroundColor: colors.error + "20" }, // Light red tint when recording
          ]}
        >
          {isRecording ? (
            <View style={styles.recordingContainer}>
              <View
                style={[styles.recordingDot, { backgroundColor: colors.error }]}
              />
              <Text style={[styles.recordingText, { color: colors.error }]}>
                Recording... Release to send
              </Text>
            </View>
          ) : (
            <>
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
            </>
          )}
        </View>

        {text.trim().length > 0 ? (
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Ionicons name="send" size={24} color={colors.primary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.iconButton,
              isRecording && { transform: [{ scale: 1.2 }] }, // visual feedback
            ]}
            onPressIn={startRecording}
            onPressOut={stopRecording}
            // Long press logic usually works better with PressIn/PressOut
          >
            <Ionicons
              name={isRecording ? "mic" : "mic-outline"}
              size={26}
              color={isRecording ? colors.error : colors.primary}
            />
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
  recordingContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  recordingText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ChatInput;
