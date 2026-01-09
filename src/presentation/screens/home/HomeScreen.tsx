import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useService } from "../../context/ServiceContext";
import Header from "../../components/ui/Header";
import SearchBar from "../../components/ui/SearchBar";
import FriendListItem from "../../components/user/FriendListItem";
import CreateGroupModal from "../../components/group/CreateGroupModal";
import GroupListItem from "../../components/group/GroupListItem";
import User from "../../../domain/entities/user";
import GroupChat from "../../../domain/entities/groupChat";
import { AntDesign } from "@expo/vector-icons";
import { CHAT_SCREEN_NAMES } from "../../../shared/constants/navigation";

function HomeScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const { user: authUser } = useAuth();
  const { userUseCases, groupChatUseCases } = useService();

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateGroupModalVisible, setIsCreateGroupModalVisible] =
    useState(false);
  const [allFriends, setAllFriends] = useState<User[]>([]);
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);

  useEffect(() => {
    if (!authUser?.id) return;
    setIsLoading(true);

    const unsubscribeFriends = userUseCases.subscribeToFriends(
      authUser.id,
      (updatedFriends) => {
        setAllFriends(updatedFriends);
        setIsLoading(false);
      }
    );

    const unsubscribeGroups = groupChatUseCases.subscribeToGroupChats(
      authUser.id,
      (updatedGroups) => {
        setGroupChats(updatedGroups);
      }
    );

    return () => {
      unsubscribeFriends();
      unsubscribeGroups();
    };
  }, [authUser?.id]);

  // Derived state for display
  const displayedFriends = searchQuery
    ? allFriends.filter((f) =>
        f.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allFriends;

  const displayedGroups = searchQuery
    ? groupChats.filter((g) =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : groupChats;

  const handleLocalSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleFriendPress = (userId: string) => {
    navigation.navigate(CHAT_SCREEN_NAMES.Chat, { userId });
  };

  const handleGroupPress = (groupId: string) => {
    navigation.navigate(CHAT_SCREEN_NAMES.GroupChat, { groupId });
  };

  const handleCreateGroupChatPress = () => {
    setIsCreateGroupModalVisible(true);
  };

  const handleCreateGroup = async (name: string, memberIds: string[]) => {
    if (!authUser?.id) return;
    try {
      await groupChatUseCases.createGroupChat(name, authUser.id, memberIds);
    } catch (error) {
      console.error("Failed to create group chat", error);
    }
  };

  const renderHeader = () => {
    if (displayedGroups.length === 0) return null;
    return (
      <View style={styles.groupListContainer}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Groups
        </Text>
        {displayedGroups.map((group) => (
          <GroupListItem
            key={group.id}
            groupChat={group}
            onPress={handleGroupPress}
          />
        ))}
        {displayedFriends.length > 0 && (
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.textSecondary, marginTop: 10 },
            ]}
          >
            Friends
          </Text>
        )}
      </View>
    );
  };

  return (
    <View
      style={[styles.rootContainer, { backgroundColor: colors.background }]}
    >
      <Header title="My Friends" />

      <View style={styles.contentContainer}>
        <View style={styles.searchAndCreateGroupContainer}>
          <SearchBar
            placeholder="Search friends & groups..."
            value={searchQuery}
            onChangeText={handleLocalSearch}
            onClear={() => handleLocalSearch("")}
            style={styles.searchBar}
          />
          <TouchableOpacity
            onPress={handleCreateGroupChatPress}
            style={styles.createGroupButton}
          >
            <AntDesign name="usergroup-add" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <View style={styles.friendListContainer}>
            <FlatList
              data={displayedFriends}
              keyExtractor={(item) => item.id}
              ListHeaderComponent={renderHeader}
              renderItem={({ item }) => (
                <FriendListItem
                  user={item}
                  onPress={handleFriendPress}
                  unreadMessageCount={0}
                />
              )}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                displayedGroups.length === 0 ? (
                  <Text
                    style={[styles.emptyText, { color: colors.textSecondary }]}
                  >
                    {searchQuery
                      ? "No results found."
                      : "No friends yet. Go to Discover to add some!"}
                  </Text>
                ) : null
              }
            />
          </View>
        )}
      </View>

      <CreateGroupModal
        visible={isCreateGroupModalVisible}
        onClose={() => setIsCreateGroupModalVisible(false)}
        onCreate={handleCreateGroup}
        friends={allFriends}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  friendListContainer: {
    marginTop: 18,
  },
  searchAndCreateGroupContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 5,
  },
  searchBar: {
    flex: 1,
    marginBottom: 0,
  },
  createGroupButton: {
    marginLeft: 10,
    padding: 8,
  },
  listContent: {
    paddingHorizontal: 20,
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
  groupListContainer: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});

export default HomeScreen;
