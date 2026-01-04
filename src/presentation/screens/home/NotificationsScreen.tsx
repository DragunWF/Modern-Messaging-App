import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useService } from "../../context/ServiceContext";
import Notification from "../../../domain/entities/notification";
import { Ionicons } from "@expo/vector-icons";

function NotificationsScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use dependency injection via ServiceContext
  const { userUseCases } = useService();

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await userUseCases.getNotifications(user.id);
      // Sort by newest first
      const sorted = data.sort((a, b) => b.createdAt - a.createdAt);
      setNotifications(sorted);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (notification: Notification) => {
    if (!user) return;
    try {
      await userUseCases.acceptFriendRequest(
        user.id,
        notification.senderId,
        notification.id
      );
      Alert.alert("Success", "Friend request accepted!");
      fetchNotifications(); // Refresh list
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to accept request");
    }
  };

  const handleReject = async (notification: Notification) => {
    if (!user) return;
    try {
      await userUseCases.rejectFriendRequest(
        user.id,
        notification.senderId,
        notification.id
      );
      Alert.alert("Ignored", "Friend request ignored.");
      fetchNotifications(); // Refresh list
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to reject request");
    }
  };

  const renderItem = ({ item }: { item: Notification }) => {
    const isFriendRequest = item.type === "FRIEND_REQUEST";

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.backgroundCard,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.textContainer}>
          <Text style={[styles.message, { color: colors.textPrimary }]}>
            {isFriendRequest
              ? `${item.data?.username} sent you a friend request.`
              : `${item.data?.username} accepted your friend request.`}
          </Text>
          <Text style={[styles.time, { color: colors.textSecondary }]}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {isFriendRequest && !item.isRead && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={() => handleAccept(item)}
            >
              <Ionicons name="checkmark" size={20} color={colors.textInverse} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colors.error, marginLeft: 10 },
              ]}
              onPress={() => handleReject(item)}
            >
              <Ionicons name="close" size={20} color={colors.textInverse} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Notifications
        </Text>
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No notifications yet.
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  list: {
    padding: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
  },
  button: {
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default NotificationsScreen;
