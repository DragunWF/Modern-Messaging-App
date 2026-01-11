import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

interface RenameGroupModalProps {
  visible: boolean;
  onClose: () => void;
  onRename: (newName: string) => void;
  currentName: string;
}

const RenameGroupModal = ({
  visible,
  onClose,
  onRename,
  currentName,
}: RenameGroupModalProps) => {
  const { colors } = useTheme();
  const [newName, setNewName] = useState(currentName);

  // Update state when modal opens or currentName changes
  React.useEffect(() => {
    if (visible) {
      setNewName(currentName);
    }
  }, [visible, currentName]);

  const handleSave = () => {
    if (newName.trim()) {
      onRename(newName.trim());
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingView}
          >
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalContent,
                  { backgroundColor: colors.backgroundCard },
                ]}
              >
                <Text style={[styles.title, { color: colors.textPrimary }]}>
                  Rename Group
                </Text>
                <Text
                  style={[styles.description, { color: colors.textSecondary }]}
                >
                  Enter a new name for the group chat.
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.backgroundInput,
                      color: colors.textPrimary,
                      borderColor: colors.border,
                    },
                  ]}
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="Group Name"
                  placeholderTextColor={colors.textPlaceholder}
                  autoFocus
                />

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={onClose}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.saveButton,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={handleSave}
                  >
                    <Text
                      style={[styles.buttonText, { color: colors.textInverse }]}
                    >
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardAvoidingView: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    borderRadius: 14, // Matches iOS alert style
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    marginRight: 10,
  },
  saveButton: {
    marginLeft: 10,
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 16,
  },
});

export default RenameGroupModal;
