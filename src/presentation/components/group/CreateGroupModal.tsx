import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import User from "../../../domain/entities/user";
import TextInput from "../ui/TextInput";
import Button from "../ui/Button";

interface CreateGroupModalProps {
  visible: boolean;
  onClose: () => void;
  friends: User[];
}

const CreateGroupModal = ({
  visible,
  onClose,
  friends,
}: CreateGroupModalProps) => {
  const { colors } = useTheme();
  const [groupName, setGroupName] = useState("");
  const [selectedFriendIds, setSelectedFriendIds] = useState<Set<string>>(
    new Set()
  );

  const toggleFriendSelection = (friendId: string) => {
    const newSelected = new Set(selectedFriendIds);
    if (newSelected.has(friendId)) {
      newSelected.delete(friendId);
    } else {
      newSelected.add(friendId);
    }
    setSelectedFriendIds(newSelected);
  };

  const handleCreate = () => {
    // Placeholder for creation logic
    console.log(
      "Creating group:",
      groupName,
      "with members:",
      Array.from(selectedFriendIds)
    );
    onClose();
    // Reset state
    setGroupName("");
    setSelectedFriendIds(new Set());
  };

  const handleClose = () => {
    onClose();
    setGroupName("");
    setSelectedFriendIds(new Set());
  };

  const renderFriendItem = ({ item }: { item: User }) => {
    const isSelected = selectedFriendIds.has(item.id);
    return (
      <TouchableOpacity
        style={[
          styles.friendItem,
          {
            backgroundColor: colors.backgroundCard,
            borderColor: isSelected ? colors.primary : colors.border,
          },
        ]}
        onPress={() => toggleFriendSelection(item.id)}
      >
        <View style={styles.friendInfo}>
          <Text style={[styles.friendName, { color: colors.textPrimary }]}>
            {item.username}
          </Text>
          <Text style={[styles.friendStatus, { color: colors.textSecondary }]}>
            {item.isOnline ? "Online" : "Offline"}
          </Text>
        </View>
        <View
          style={[
            styles.checkbox,
            {
              borderColor: isSelected ? colors.primary : colors.textPlaceholder,
            },
          ]}
        >
          {isSelected && (
            <Ionicons name="checkmark" size={16} color={colors.primary} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.background },
            ]}
          >
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                New Group Chat
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Group Name
              </Text>
              <TextInput
                placeholder="Enter group name"
                value={groupName}
                onChangeText={setGroupName}
                style={[styles.input, { color: colors.textPrimary }]}
              />
            </View>

            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, marginBottom: 10 },
              ]}
            >
              Select Friends
            </Text>
            <FlatList
              data={friends}
              keyExtractor={(item) => item.id}
              renderItem={renderFriendItem}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <Text
                  style={{
                    color: colors.textSecondary,
                    textAlign: "center",
                    marginTop: 20,
                  }}
                >
                  No friends available to add.
                </Text>
              }
            />

            <View style={styles.footer}>
              <Button
                title="Create Group"
                onPress={handleCreate}
                disabled={!groupName.trim() || selectedFriendIds.size === 0}
                style={{
                  opacity:
                    !groupName.trim() || selectedFriendIds.size === 0 ? 0.6 : 1,
                }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end", // Slide up from bottom or center? 'center' is usually better for forms unless it's a bottom sheet.
    // Let's go with full screen or large centered modal.
    // justifyContent: 'center',
  },
  keyboardView: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    borderRadius: 20,
    padding: 20,
    maxHeight: "80%",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    marginBottom: 0, // Override default margin
  },
  list: {
    maxHeight: 300,
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 10,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "500",
  },
  friendStatus: {
    fontSize: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    marginTop: 10,
  },
});

export default CreateGroupModal;
