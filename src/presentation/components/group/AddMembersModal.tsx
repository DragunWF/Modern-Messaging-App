import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context"; // For status bar fix
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import SearchBar from "../ui/SearchBar";
import SelectableUserItem from "../user/SelectableUserItem"; // New import
import Button from "../ui/Button"; // For confirmation button
import User from "../../../domain/entities/user";

interface AddMembersModalProps {
  visible: boolean;
  onClose: () => void;
  onAddSelectedMembers: (userIds: string[]) => void; // Changed from onSelectUser
  currentGroupMemberIds: string[];
  allFriends: User[];
  isLoadingFriends?: boolean;
}

const AddMembersModal = ({
  visible,
  onClose,
  onAddSelectedMembers,
  currentGroupMemberIds,
  allFriends,
  isLoadingFriends = false,
}: AddMembersModalProps) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets(); // Get safe area insets
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFriends, setFilteredFriends] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]); // New state for multi-select

  useEffect(() => {
    // Filter friends: exclude current group members and apply search query
    const newFilteredFriends = allFriends.filter(
      (friend) =>
        !currentGroupMemberIds.includes(friend.id) &&
        friend.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFriends(newFilteredFriends);
  }, [allFriends, currentGroupMemberIds, searchQuery]);

  // Reset selected users when modal opens or closes
  useEffect(() => {
    if (!visible) {
      setSelectedUserIds([]);
      setSearchQuery(""); // Clear search when modal closes
    }
  }, [visible]);

  const handleToggleSelect = (userId: string) => {
    setSelectedUserIds((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleAddPress = () => {
    if (selectedUserIds.length > 0) {
      onAddSelectedMembers(selectedUserIds);
      onClose();
    }
  };

  const renderFriendItem = ({ item }: { item: User }) => (
    <SelectableUserItem
      user={item}
      isSelected={selectedUserIds.includes(item.id)}
      onToggleSelect={handleToggleSelect}
      isAlreadyMember={currentGroupMemberIds.includes(item.id)} // Pass this prop
    />
  );

  const selectedCount = selectedUserIds.length;

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[
          styles.safeAreaContainer,
          { backgroundColor: colors.backgroundCard },
        ]} // Set SafeAreaView background to header color
        edges={["top", "bottom"]}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              borderBottomColor: colors.border,
              backgroundColor: colors.backgroundCard,
            },
          ]}
        >
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Add Member
          </Text>
          <View style={styles.rightPlaceholder} />
        </View>

        <View style={{ flex: 1, backgroundColor: colors.background }}>
          {/* Search Bar */}
          <View style={styles.searchBarContainer}>
            <SearchBar
              placeholder="Search friends..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onClear={() => setSearchQuery("")}
            />
          </View>

          {/* Friends List */}
          {isLoadingFriends ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <FlatList
              data={filteredFriends}
              keyExtractor={(item) => item.id}
              renderItem={renderFriendItem}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <Text
                  style={[styles.emptyText, { color: colors.textSecondary }]}
                >
                  {searchQuery
                    ? "No matching friends found."
                    : "No friends to add."}
                </Text>
              }
            />
          )}
        </View>

        {/* Confirmation Button */}
        {selectedCount > 0 && (
          <View
            style={[
              styles.addButtonContainer,
              {
                backgroundColor: colors.backgroundCard,
                paddingBottom: insets.bottom + 10,
              },
            ]}
          >
            <Button
              title={`Add ${selectedCount} Member${
                selectedCount > 1 ? "s" : ""
              }`}
              onPress={handleAddPress}
            />
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56, // Set a fixed height
    paddingHorizontal: 15, // Keep horizontal padding
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  rightPlaceholder: {
    width: 28 + 10, // Width of close button + padding
  },
  searchBarContainer: {
    padding: 15,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
});

export default AddMembersModal;
