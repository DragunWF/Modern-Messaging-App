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
import Message from "../../../domain/entities/message";
import { AntDesign } from "@expo/vector-icons";
import {
  CHAT_SCREEN_NAMES,
  NAVIGATOR_NAMES,
} from "../../../shared/constants/navigation";

function HomeScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const { user: authUser } = useAuth(); // Initial auth user
  const { userUseCases, groupChatUseCases, chatUseCases } = useService();

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateGroupModalVisible, setIsCreateGroupModalVisible] =
    useState(false);
  const [allFriends, setAllFriends] = useState<User[]>([]);
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [realtimeUser, setRealtimeUser] = useState<User | null>(null);

  useEffect(() => {
    if (!authUser?.id) return;
    setIsLoading(true);

    // 1. Subscribe to Friends
    const unsubscribeFriends = userUseCases.subscribeToFriends(
      authUser.id,
      (updatedFriends) => {
        setAllFriends(updatedFriends);
        setIsLoading(false);
      }
    );

    // 2. Subscribe to Group Chats
    const unsubscribeGroups = groupChatUseCases.subscribeToGroupChats(
      authUser.id,
      (updatedGroups) => {
        setGroupChats(updatedGroups);
      }
    );

    // 3. Subscribe to Realtime User Updates (for lastReadTimestamps)
    const unsubscribeUser = userUseCases.subscribeToUser(
      authUser.id,
      (updatedUser) => {
        setRealtimeUser(updatedUser);
      }
    );

    // 4. Subscribe to All Messages (to calculate unread counts)
    const unsubscribeMessages = chatUseCases.subscribeToAllMessages(
      (allMessages) => {
        // We will calculate counts in a separate effect or here depending on dependencies
        // Storing messages in state might be heavy if there are many.
        // Instead, let's calculate counts immediately if we have the user and groups.
        // But 'realtimeUser' and 'groupChats' are in state.
        // To avoid stale closures, we might need to store messages or use a ref.
        // For simplicity, let's store filtered counts in state.
        calculateUnreadCounts(allMessages);
      }
    );

    return () => {
      unsubscribeFriends();
      unsubscribeGroups();
      unsubscribeUser();
      unsubscribeMessages();
    };
  }, [authUser?.id]); // Re-subscribe if authUser changes (login/logout)

  // Re-calculate counts when realtimeUser or groupChats change, but we need the messages.
  // The message subscription callback only fires on message changes.
  // This is a common React pattern issue.
  // Best approach: Store messages in a ref or state to re-calc when user/groups change.
  const [messagesCache, setMessagesCache] = useState<Message[]>([]);

  useEffect(() => {
    calculateUnreadCounts(messagesCache);
  }, [realtimeUser, groupChats, allFriends]); // Re-calc when context changes

  const calculateUnreadCounts = (messages: Message[]) => {
    setMessagesCache(messages); // Update cache
    if (!realtimeUser || !messages.length) return;

    const newCounts: Record<string, number> = {};
    const lastReadTimestamps = realtimeUser.lastReadTimestamps || {};
    const userGroupIds = groupChats.map((g) => g.id);

    messages.forEach((msg) => {
      // 1. Determine Chat ID and Relevance
      let chatId: string | null = null;
      let isRelevant = false;

      // Check Group Chat
      if (userGroupIds.includes(msg.receiverId)) {
        chatId = msg.receiverId;
        isRelevant = true;
      }
      // Check 1-on-1 Chat
      else if (
        msg.senderId === realtimeUser.id ||
        msg.receiverId === realtimeUser.id
      ) {
        isRelevant = true;
        const otherId =
          msg.senderId === realtimeUser.id ? msg.receiverId : msg.senderId;
        // Construct Chat ID consistent with ChatUseCases
        chatId =
          realtimeUser.id < otherId
            ? `${realtimeUser.id}_${otherId}`
            : `${otherId}_${realtimeUser.id}`;
      }

      if (isRelevant && chatId) {
        // 2. Check if Unread
        // Message is unread if:
        // - I am NOT the sender
        // - Message timestamp is > lastReadTimestamp for this chat
        const lastRead = lastReadTimestamps[chatId] || 0;
        const msgTime = new Date(msg.timestamp).getTime();

        if (msg.senderId !== realtimeUser.id && msgTime > lastRead) {
          newCounts[chatId] = (newCounts[chatId] || 0) + 1;
        }
      }
    });

    // Map internal Chat IDs to display IDs (Friend ID or Group ID)
    // The UI (FlatList) iterates over Friends and Groups by their ID.
    // For Groups: ChatID IS GroupID.
    // For Friends: ChatID is composite. We need to map it back or lookup differently.
    // Easier: Store counts keyed by ChatID, and in render, construct ChatID to lookup.

    setUnreadCounts(newCounts);
  };

  const getUnreadCountForFriend = (friendId: string) => {
    if (!realtimeUser) return 0;
    const chatId =
      realtimeUser.id < friendId
        ? `${realtimeUser.id}_${friendId}`
        : `${friendId}_${realtimeUser.id}`;
    return unreadCounts[chatId] || 0;
  };

  const getUnreadCountForGroup = (groupId: string) => {
    return unreadCounts[groupId] || 0;
  };

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
    navigation.navigate(NAVIGATOR_NAMES.ChatNavigator, {
      screen: CHAT_SCREEN_NAMES.Chat,
      params: { userId },
    });
  };

  const handleGroupPress = (groupId: string) => {
    navigation.navigate(NAVIGATOR_NAMES.ChatNavigator, {
      screen: CHAT_SCREEN_NAMES.GroupChat,
      params: { groupId },
    });
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
            unreadMessageCount={getUnreadCountForGroup(group.id)}
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
                  unreadMessageCount={getUnreadCountForFriend(item.id)}
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
