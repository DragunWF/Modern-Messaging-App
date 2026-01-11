import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Header from "../../components/ui/Header";
import IconButton from "../../components/ui/IconButton";
import GroupMemberItem from "../../components/group/GroupMemberItem";
import RenameGroupModal from "../../components/group/RenameGroupModal";
import User from "../../../domain/entities/user";
import GroupChat from "../../../domain/entities/groupChat";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useService } from "../../context/ServiceContext";

function GroupProfileScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { groupId } = route.params; // Get groupId from params
  const { groupChatUseCases, userUseCases } = useService();

  const [groupChat, setGroupChat] = React.useState<GroupChat | null>(null);
  const [members, setMembers] = React.useState<User[]>([]);
  const [isRenameModalVisible, setIsRenameModalVisible] = React.useState(false);

  const fetchGroupData = React.useCallback(async () => {
    if (!groupId) return;
    const group = await groupChatUseCases.getGroupChatById(groupId);
    setGroupChat(group);

    if (group && group.memberIds) {
      const membersData = await Promise.all(
        group.memberIds.map((id) => userUseCases.getUserById(id))
      );
      // Filter out nulls if any user fetch failed
      setMembers(membersData.filter((u): u is User => u !== null));
    }
  }, [groupId, groupChatUseCases, userUseCases]);

  React.useEffect(() => {
    fetchGroupData();
  }, [fetchGroupData]);

  const handleRemoveMember = (userId: string) => {
    console.log(`Attempting to remove user ${userId}`);
    // In a real scenario, this would trigger a use case to remove the user
  };

  const handleRenameGroup = () => {
    if (!groupChat) return;

    if (Platform.OS === "ios") {
      Alert.prompt(
        "Rename Group",
        "Enter a new name for the group chat.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Save",
            // @ts-ignore
            onPress: (newName) => {
              if (newName && newName.trim()) {
                performRename(newName.trim());
              }
            },
          },
        ],
        "plain-text",
        groupChat.name
      );
    } else {
      // Android Fallback
      setIsRenameModalVisible(true);
    }
  };

  const performRename = async (newName: string) => {
    if (!groupChat) return;
    try {
      await groupChatUseCases.renameGroupChat(groupChat.id, newName);
      // Refresh local data to show new name immediately (though listener might handle it too)
      fetchGroupData();
    } catch (error) {
      console.error("Failed to rename group", error);
      Alert.alert("Error", "Failed to rename group. Please try again.");
    }
  };

  const handleAddMemberPress = () => {
    console.log("Add Member button pressed");
    // Functionality to be implemented later
  };

  if (!groupChat) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Group Profile" onBackPress={() => navigation.goBack()} />
        <View style={styles.centerContainer}>
          <Text style={{ color: colors.textPrimary }}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Group Profile" onBackPress={() => navigation.goBack()} />

      {/* Group Info Section */}
      <View
        style={[
          styles.groupInfoContainer,
          { borderBottomColor: colors.border },
        ]}
      >
        <FontAwesome
          name="users"
          size={80}
          color={colors.primary}
          style={styles.groupIcon}
        />
        <View style={styles.groupNameRow}>
          <Text style={[styles.groupName, { color: colors.textPrimary }]}>
            {groupChat.name}
          </Text>
          <TouchableOpacity onPress={handleRenameGroup}>
            <Ionicons name="pencil" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Add Member Button */}
        <TouchableOpacity
          style={[styles.addMemberButton, { backgroundColor: colors.primary }]}
          onPress={handleAddMemberPress}
        >
          <Ionicons name="person-add" size={20} color={colors.textInverse} />
          <Text
            style={[styles.addMemberButtonText, { color: colors.textInverse }]}
          >
            Add Member
          </Text>
        </TouchableOpacity>
      </View>

      {/* Members Section */}
      <View style={styles.membersHeader}>
        <Text style={[styles.membersTitle, { color: colors.textPrimary }]}>
          Members ({members.length})
        </Text>
      </View>
      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GroupMemberItem user={item} onRemove={handleRemoveMember} />
        )}
        contentContainerStyle={styles.memberListContent}
      />

      {/* Android Fallback Modal */}
      <RenameGroupModal
        visible={isRenameModalVisible}
        onClose={() => setIsRenameModalVisible(false)}
        onRename={performRename}
        currentName={groupChat.name}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  groupInfoContainer: {
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  groupIcon: {
    marginBottom: 10,
  },
  groupNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  groupName: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 10,
  },
  addMemberButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  addMemberButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  membersHeader: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  membersTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  memberListContent: {
    marginTop: 8,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
});

export default GroupProfileScreen;
