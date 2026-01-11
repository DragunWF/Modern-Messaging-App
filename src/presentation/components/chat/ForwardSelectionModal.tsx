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
import GroupChat from "../../../domain/entities/groupChat";
import Button from "../ui/Button";

interface ForwardSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onForward: (targetIds: string[]) => void;
  friends: User[];
  groups: GroupChat[];
}

const ForwardSelectionModal = ({
  visible,
  onClose,
  onForward,
  friends,
  groups,
}: ForwardSelectionModalProps) => {
  const { colors } = useTheme();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"friends" | "groups">("friends");

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleForward = () => {
    onForward(Array.from(selectedIds));
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setSelectedIds(new Set());
    setActiveTab("friends");
  };

  const renderFriendItem = ({ item }: { item: User }) => {
    const isSelected = selectedIds.has(item.id);
    return (
      <TouchableOpacity
        style={[
          styles.item,
          {
            backgroundColor: colors.backgroundCard,
            borderColor: isSelected ? colors.primary : colors.border,
          },
        ]}
        onPress={() => toggleSelection(item.id)}
      >
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, { color: colors.textPrimary }]}>
            {item.username}
          </Text>
          <Text style={[styles.itemStatus, { color: colors.textSecondary }]}>
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

  const renderGroupItem = ({ item }: { item: GroupChat }) => {
    const isSelected = selectedIds.has(item.id);
    return (
      <TouchableOpacity
        style={[
          styles.item,
          {
            backgroundColor: colors.backgroundCard,
            borderColor: isSelected ? colors.primary : colors.border,
          },
        ]}
        onPress={() => toggleSelection(item.id)}
      >
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, { color: colors.textPrimary }]}>
            {item.name}
          </Text>
          <Text style={[styles.itemStatus, { color: colors.textSecondary }]}>
            {item.memberIds.length} members
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
                Forward Message
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === "friends" && {
                    borderBottomColor: colors.primary,
                  },
                ]}
                onPress={() => setActiveTab("friends")}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color:
                        activeTab === "friends"
                          ? colors.primary
                          : colors.textSecondary,
                    },
                  ]}
                >
                  Friends
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === "groups" && {
                    borderBottomColor: colors.primary,
                  },
                ]}
                onPress={() => setActiveTab("groups")}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color:
                        activeTab === "groups"
                          ? colors.primary
                          : colors.textSecondary,
                    },
                  ]}
                >
                  Groups
                </Text>
              </TouchableOpacity>
            </View>

            {activeTab === "friends" ? (
              <FlatList
                data={friends}
                keyExtractor={(item) => item.id}
                renderItem={renderFriendItem}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    No friends available.
                  </Text>
                }
              />
            ) : (
              <FlatList
                data={groups}
                keyExtractor={(item) => item.id}
                renderItem={renderGroupItem}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    No groups available.
                  </Text>
                }
              />
            )}

            <View style={styles.footer}>
              <Button
                title={`Send (${selectedIds.size})`}
                onPress={handleForward}
                disabled={selectedIds.size === 0}
                style={{
                  opacity: selectedIds.size === 0 ? 0.6 : 1,
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
    justifyContent: "flex-end",
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
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
  },
  list: {
    maxHeight: 400, // Adjusted height
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
  },
  itemStatus: {
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
  emptyText: {
    textAlign: "center",
    marginTop: 20,
  },
  footer: {
    marginTop: 10,
  },
});

export default ForwardSelectionModal;
