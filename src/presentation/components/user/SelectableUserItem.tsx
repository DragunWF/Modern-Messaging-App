import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import User from "../../../domain/entities/user";

interface SelectableUserItemProps {
  user: User;
  isSelected: boolean;
  onToggleSelect: (userId: string) => void;
  isAlreadyMember?: boolean; // New prop to indicate if user is already in group
}

const SelectableUserItem = ({
  user,
  isSelected,
  onToggleSelect,
  isAlreadyMember = false,
}: SelectableUserItemProps) => {
  const { colors } = useTheme();

  const handlePress = () => {
    if (!isAlreadyMember) {
      onToggleSelect(user.id);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.backgroundCard,
          borderColor: colors.border,
          opacity: isAlreadyMember ? 0.6 : 1, // Visually dim if already a member
        },
      ]}
      onPress={handlePress}
      disabled={isAlreadyMember}
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
      {isAlreadyMember ? (
        <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
      ) : (
        <Ionicons
          name={isSelected ? "radio-button-on" : "radio-button-off"}
          size={24}
          color={isSelected ? colors.primary : colors.textSecondary}
        />
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
  avatar: {
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SelectableUserItem;
