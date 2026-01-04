import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import SearchBar from "../../components/ui/SearchBar";
import UserCard from "../../components/user/UserCard";
import User from "../../../domain/entities/user";

// Mock Data (Remove when integrating with backend)
const MOCK_USERS: User[] = [
  {
    id: "1",
    username: "alice_w",
    email: "alice@example.com",
    password: "",
    isOnline: true,
    friends: [],
  },
  {
    id: "2",
    username: "bob_builder",
    email: "bob@example.com",
    password: "",
    isOnline: false,
    friends: [],
  },
  {
    id: "3",
    username: "charlie_brown",
    email: "charlie@example.com",
    password: "",
    isOnline: true,
    friends: [],
  },
  {
    id: "4",
    username: "diana_prince",
    email: "diana@example.com",
    password: "",
    isOnline: false,
    friends: [],
  },
  {
    id: "5",
    username: "ethan_hunt",
    email: "ethan@example.com",
    password: "",
    isOnline: true,
    friends: [],
  },
];

function DiscoverScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  const handleAddFriend = (userId: string) => {
    console.log("Add friend request sent to:", userId);
    // Future integration: call UseCase to send friend request
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text) {
      const filtered = MOCK_USERS.filter(
        (u) =>
          u.username.toLowerCase().includes(text.toLowerCase()) ||
          u.email.toLowerCase().includes(text.toLowerCase())
      );
      setUsers(filtered);
    } else {
      setUsers(MOCK_USERS);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Discover People
        </Text>
      </View>
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search by username or email"
          value={searchQuery}
          onChangeText={handleSearch}
          onClear={() => handleSearch("")}
        />
      </View>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserCard user={item} onAddFriend={handleAddFriend} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No users found.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 5,
  },
  listContent: {
    padding: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default DiscoverScreen;
