import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import SearchBar from "../../components/ui/SearchBar";
import UserCard from "../../components/user/UserCard";
import User from "../../../domain/entities/user";
import { UserUseCases } from "../../../application/useCases/userUseCases";
import UserRepository from "../../../infrastructure/repositories/userRepository";
import { FirebaseAuthService } from "../../../infrastructure/auth/authService";

function DiscoverScreen() {
  const { colors } = useTheme();
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Use Case
  // In a real app, use dependency injection or a service locator
  const authService = new FirebaseAuthService();
  const userRepository = new UserRepository();
  const userUseCases = new UserUseCases(authService, userRepository);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const users = await userUseCases.getAllUsers();
      // Filter out current user
      const filteredUsers = users.filter((u) => u.id !== currentUser?.id);
      setAllUsers(filteredUsers);
      setDisplayedUsers(filteredUsers);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFriend = (userId: string) => {
    console.log("Add friend request sent to:", userId);
    // Future integration: call UseCase to send friend request
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
            <UserCard user={item} onAddFriend={handleAddFriend} />
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
