import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import User from "../../../domain/entities/user";

interface FriendListItemProps {
  user: User;
  onPress: (userId: string) => void;
  unreadMessageCount?: number; // New optional prop
}

const FriendListItem = ({
  user,
  onPress,
  unreadMessageCount = 0,
}: FriendListItemProps) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.backgroundCard, borderColor: colors.border },
      ]}
      onPress={() => onPress(user.id)}
    >
      <View style={styles.avatarContainer}>
        <FontAwesome
          name="user-circle"
          size={50}
          color={colors.textPlaceholder}
          style={styles.avatar}
        />
        {/* Online Status Indicator */}
        <View
          style={[
            styles.statusIndicator,
            {
              backgroundColor: user.isOnline
                ? colors.onlineStatus
                : colors.offlineStatus,
              borderColor: colors.backgroundCard, // Border to separate from avatar
            },
          ]}
        />
      </View>
      <View style={styles.info}>
        <Text style={[styles.username, { color: colors.textPrimary }]}>
          {user.username}
        </Text>
        <Text style={[styles.statusText, { color: colors.textSecondary }]}>
          {user.isOnline ? "Online" : "Offline"}
        </Text>
      </View>

      {unreadMessageCount > 0 && (
        <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.unreadText, { color: colors.textInverse }]}>
            {unreadMessageCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 15,
  },
  avatar: {},
  statusIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
  },
  info: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  statusText: {
    fontSize: 12,
  },
  unreadBadge: {
    minWidth: 24, // Ensures it's circular even for single digits
    height: 24,
    borderRadius: 12, // Half of height/width for circular shape
    paddingHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10, // Space from the info text
  },
  unreadText: {
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default FriendListItem;
