import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity, // Added TouchableOpacity
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import Header from "../../components/ui/Header";
import SearchBar from "../../components/ui/SearchBar";
import FriendListItem from "../../components/user/FriendListItem";
import User from "../../../domain/entities/user";
import { Ionicons, AntDesign } from "@expo/vector-icons"; // Added Ionicons

// Define a type for mock friends
interface MockFriend extends User {
  unreadMessageCount?: number;
}

// Mock Data for UI Layout
const MOCK_FRIENDS: MockFriend[] = [
  {
    id: "1",
    username: "Alice Wonderland",
    email: "alice@example.com",
    password: "",
    isOnline: true,
    friends: [],
    friendRequests: [],
    outgoingFriendRequests: [],
    unreadMessageCount: 3,
  },
  {
    id: "2",
    username: "Bob Builder",
    email: "bob@example.com",
    password: "",
    isOnline: false,
    friends: [],
    friendRequests: [],
    outgoingFriendRequests: [],
    unreadMessageCount: 0,
  },
  {
    id: "3",
    username: "Charlie Chaplin",
    email: "charlie@example.com",
    password: "",
    isOnline: true,
    friends: [],
    friendRequests: [],
    outgoingFriendRequests: [],
  },
  {
    id: "4",
    username: "David Bowie",
    email: "david@example.com",
    password: "",
    isOnline: false,
    friends: [],
    friendRequests: [],
    outgoingFriendRequests: [],
    unreadMessageCount: 15,
  },
  {
    id: "5",
    username: "Eve Polastri",
    email: "eve@example.com",
    password: "",
    isOnline: true,
    friends: [],
    friendRequests: [],
    outgoingFriendRequests: [],
  },
];

function HomeScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedFriends, setDisplayedFriends] = useState(MOCK_FRIENDS);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text) {
      const filtered = MOCK_FRIENDS.filter((friend) =>
        friend.username.toLowerCase().includes(text.toLowerCase())
      );
      setDisplayedFriends(filtered);
    } else {
      setDisplayedFriends(MOCK_FRIENDS);
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
            style={styles.searchBar} // Added style prop
          />
          <TouchableOpacity
            onPress={handleCreateGroupChatPress}
            style={styles.createGroupButton}
          >
            <AntDesign name="usergroup-add" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={displayedFriends}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FriendListItem
              user={item}
              onPress={handleFriendPress}
              unreadMessageCount={item.unreadMessageCount}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No friends found.
            </Text>
          }
        />
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
  searchAndCreateGroupContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 5, // Adjusted to balance SearchBar's own margin-bottom
  },
  searchBar: {
    flex: 1,
    marginBottom: 0, // Override SearchBar's default marginBottom
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
});

export default HomeScreen;
