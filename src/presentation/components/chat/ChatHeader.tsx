import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

interface ChatHeaderProps {
  title: string;
  subtitle?: string; // "Active 5m ago" or "5 members"
  onBackPress: () => void;
  onProfilePress?: () => void; // Made optional
  showProfileImage?: boolean; // New prop
}

const ChatHeader = ({
  title,
  subtitle,
  onBackPress,
  onProfilePress,
  showProfileImage = true, // Default to true for existing uses
}: ChatHeaderProps) => {
  const { colors } = useTheme();

  const ProfileContent = (
    <View style={styles.titleContainer}>
      <View style={styles.avatarPlaceholder}>
        {/* Placeholder for Avatar */}
        <Text style={{ fontSize: 18 }}>👤</Text>
      </View>
      <View>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Ionicons name="chevron-back" size={28} color={colors.primary} />
      </TouchableOpacity>

      {showProfileImage && onProfilePress ? (
        <TouchableOpacity onPress={onProfilePress} style={styles.profileClickableArea}>
          {ProfileContent}
        </TouchableOpacity>
      ) : (
        ProfileContent
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 5,
    marginRight: 5,
  },
  profileClickableArea: {
    flex: 1, // Ensure it takes available space
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e1e1e1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 12,
  },
});

export default ChatHeader;
