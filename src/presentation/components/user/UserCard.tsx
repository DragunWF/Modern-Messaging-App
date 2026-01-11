import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import User from "../../../domain/entities/user";

interface UserCardProps {
  user: User;
  onAddFriend: (userId: string) => void;
  isRequestPending: boolean;
  isFriend: boolean;
}

const UserCard = ({
  user,
  onAddFriend,
  isRequestPending,
  isFriend,
}: UserCardProps) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.backgroundCard, borderColor: colors.border },
      ]}
    >
      <FontAwesome
        name="user-circle"
        size={50}
        color={colors.textPlaceholder}
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text style={[styles.username, { color: colors.textPrimary }]}>
          {user.username}
        </Text>
      </View>

      {isFriend ? (
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { color: colors.primary }]}>
            Friends
          </Text>
          <Ionicons
            name="checkmark-circle"
            size={20}
            color={colors.primary}
            style={styles.statusIcon}
          />
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.addButton,
            {
              backgroundColor: isRequestPending
                ? colors.border
                : colors.primary,
            },
          ]}
          onPress={() => onAddFriend(user.id)}
          disabled={isRequestPending}
        >
          <Ionicons
            name={isRequestPending ? "hourglass-outline" : "person-add"}
            size={20}
            color={isRequestPending ? colors.textSecondary : colors.textInverse}
          />
        </TouchableOpacity>
      )}
    </View>
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
  avatar: {
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
  },
  addButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
  },
  statusIcon: {
    marginLeft: 2,
  },
});

export default UserCard;
