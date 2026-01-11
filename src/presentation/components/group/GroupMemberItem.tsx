import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import User from "../../../domain/entities/user";

interface GroupMemberItemProps {
  user: User;
  onRemove: (userId: string) => void;
}

const GroupMemberItem = ({ user, onRemove }: GroupMemberItemProps) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.backgroundCard, borderColor: colors.border },
      ]}
    >
      <FontAwesome
        name="user-circle"
        size={40}
        color={colors.textPlaceholder}
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text style={[styles.username, { color: colors.textPrimary }]}>
          {user.username}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.removeButton]}
        onPress={() => onRemove(user.id)}
      >
        <Ionicons name="trash-outline" size={24} color={colors.error} />
      </TouchableOpacity>
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
  avatar: {
    marginRight: 15,
  },
  info: {
    flex: 1, // Take up remaining space
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
  },
  removeButton: {
    padding: 8,
  },
});

export default GroupMemberItem;
