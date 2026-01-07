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
import User from "../../../domain/entities/user";
import { AntDesign } from "@expo/vector-icons";

function HomeScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const { user: authUser } = useAuth();
  const { userUseCases } = useService();

  const [searchQuery, setSearchQuery] = useState("");
  const [friends, setFriends] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authUser?.id) return;
    setIsLoading(true);

    // Subscribe to friends updates (real-time presence)
    const unsubscribe = userUseCases.subscribeToFriends(
      authUser.id,
      (updatedFriends) => {
        setFriends(updatedFriends);
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [authUser?.id]);

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    if (!authUser?.id) return;

    // Search is still done manually for now, or we could filter the live list
    // Filtering the live list is better to keep real-time status updates while searching
    // But since the subscribeToFriends callback updates the 'friends' state directly,
    // we need to maintain a separate 'displayedFriends' state if we want to filter locally,
    // OR we can just rely on the repository search if we don't mind losing real-time for search results.
    // For now, let's keep the existing search behavior (fetching from repo) to match previous logic,
    // BUT typically you'd want to filter the already-fetched friends list to keep them "live".

    if (text) {
      try {
        const foundFriends = await userUseCases.searchFriendsOfUser(
          authUser.id,
          text
        );
        setFriends(foundFriends);
      } catch (error) {
        console.error("Search failed", error);
      }
    } else {
      // If search is cleared, the subscription (which is likely still active)
      // might need to "reset" the list. However, subscribeToFriends doesn't automatically re-emit
      // when we clear search unless we re-subscribe.
      // A better pattern: The subscription maintains the "master" list, and we filter it for display.
      // For this specific iteration, let's just re-trigger the subscription logic by re-mounting or
      // just letting the user see the result of searchFriendsOfUser(id, "") which is effectively all friends.
      // Ideally, we refactor this to:
      // 1. friends (master list from subscription)
      // 2. searchQuery (string)
      // 3. displayedFriends = friends.filter(...)
      // Let's stick to the requested change: replace fetch with subscribe.
      // To fix the search/subscribe conflict:
      // When searching, we pause live updates or just display search results.
      // When clearing search, we re-subscribe?
      // Simpler approach for now:
      // If text is empty, we rely on the subscription (which is already running).
      // But we overwrote 'friends' with search results.
      // We should probably restart the subscription to get the full list back + updates.
      // OR, simpler: just call searchFriendsOfUser again which returns the current snapshot.
      // But the instruction was to USE subscribeToFriends.
      // So let's refine the implementation:
      // We'll store the 'subscribed' friends in a separate state, and filter them.
    }
  };

  // Refactoring to support local filtering of real-time data
  // This is better UX than server-side search for a friend list (usually small)
  // and keeps presence indicators live even when searching.

  const [allFriends, setAllFriends] = useState<User[]>([]);

  useEffect(() => {
    if (!authUser?.id) return;
    setIsLoading(true);

    const unsubscribe = userUseCases.subscribeToFriends(
      authUser.id,
      (updatedFriends) => {
        setAllFriends(updatedFriends);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [authUser?.id]);

  // Derived state for display
  const displayedFriends = searchQuery
    ? allFriends.filter((f) =>
        f.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allFriends;

  const handleLocalSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleFriendPress = (userId: string) => {
    navigation.navigate("Chat", { userId });
  };

  const handleCreateGroupChatPress = () => {
    console.log("Create Group Chat button pressed (UI only)");
  };

  return (
    <View
      style={[styles.rootContainer, { backgroundColor: colors.background }]}
    >
      <Header title="My Friends" />

      <View style={styles.contentContainer}>
        <View style={styles.searchAndCreateGroupContainer}>
          <SearchBar
            placeholder="Search friends..."
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
              renderItem={({ item }) => (
                <FriendListItem
                  user={item}
                  onPress={handleFriendPress}
                  unreadMessageCount={0}
                />
              )}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <Text
                  style={[styles.emptyText, { color: colors.textSecondary }]}
                >
                  {searchQuery
                    ? "No friends found matching your search."
                    : "No friends yet. Go to Discover to add some!"}
                </Text>
              }
            />
          </View>
        )}
      </View>
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
});

export default HomeScreen;
