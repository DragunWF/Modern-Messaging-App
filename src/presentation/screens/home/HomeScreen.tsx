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
    fetchFriends();
  }, [authUser?.id]);

  const fetchFriends = async () => {
    if (!authUser?.id) return;
    setIsLoading(true);
    try {
      // Use searchFriendsOfUser with empty query to get all friends
      const userFriends = await userUseCases.searchFriendsOfUser(
        authUser.id,
        ""
      );
      setFriends(userFriends);
    } catch (error) {
      console.error("Failed to fetch friends", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    if (!authUser?.id) return;

    try {
      const foundFriends = await userUseCases.searchFriendsOfUser(
        authUser.id,
        text
      );
      setFriends(foundFriends);
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  const handleFriendPress = (userId: string) => {
    navigation.navigate("Chat", { userId });
  };

  // Placeholder for group chat functionality
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
            onChangeText={handleSearch}
            onClear={() => handleSearch("")}
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
              data={friends}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <FriendListItem
                  user={item}
                  onPress={handleFriendPress}
                  unreadMessageCount={0} // TODO: Integrate with real message counts
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
