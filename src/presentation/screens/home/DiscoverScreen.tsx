import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useService } from "../../context/ServiceContext";
import SearchBar from "../../components/ui/SearchBar";
import UserCard from "../../components/user/UserCard";
import User from "../../../domain/entities/user";

function DiscoverScreen() {
  const { colors } = useTheme();
  // Using user from useAuth for the ID, but will refetch full user for outgoing requests
  const { user: authUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // State to hold the current user's full, up-to-date profile including outgoingFriendRequests
  const [fullCurrentUser, setFullCurrentUser] = useState<User | null>(null);

  // Access Use Cases via ServiceContext
  const { userUseCases } = useService();

  useEffect(() => {
    fetchUsersAndCurrentUser();
  }, [authUser?.id]); // Re-fetch if the authenticated user changes

  const fetchUsersAndCurrentUser = async () => {
    setIsLoading(true);
    try {
      // Fetch all users
      const allFetchedUsers = await userUseCases.getAllUsers();

      // Fetch the most up-to-date current user profile from the database
      let currentLoggedInUser: User | null = null;
      if (authUser?.id) {
        currentLoggedInUser = await userUseCases.getUserById(authUser.id);
        setFullCurrentUser(currentLoggedInUser);
      }

      // Filter out current user from the list to display
      const filteredUsers = allFetchedUsers.filter(
        (u) => u.id !== authUser?.id
      );
      setAllUsers(filteredUsers);
      setDisplayedUsers(filteredUsers);
    } catch (error) {
      console.error("Failed to fetch users or current user", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFriend = async (userId: string) => {
    if (!authUser?.id) {
      Alert.alert("Error", "You must be logged in to send friend requests.");
      return;
    }
    try {
      await userUseCases.sendFriendRequest(authUser.id, userId);
      Alert.alert("Success", "Friend request sent!");
      // Refresh both lists to update the button state
      fetchUsersAndCurrentUser();
    } catch (error: any) {
      console.error("Failed to send friend request", error);
      Alert.alert("Error", error.message || "Failed to send friend request");
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text) {
      const filtered = allUsers.filter(
        (u) =>
          u.username.toLowerCase().includes(text.toLowerCase()) ||
          u.email.toLowerCase().includes(text.toLowerCase())
      );
      setDisplayedUsers(filtered);
    } else {
      setDisplayedUsers(allUsers);
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
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={displayedUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <UserCard
              user={item}
              onAddFriend={handleAddFriend}
              isRequestPending={
                !!fullCurrentUser?.outgoingFriendRequests?.includes(item.id)
              }
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No users found.
            </Text>
          }
        />
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DiscoverScreen;
