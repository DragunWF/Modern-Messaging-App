import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import GroupChat from "../../../domain/entities/groupChat";

interface GroupListItemProps {
  groupChat: GroupChat;
  onPress: (groupId: string) => void;
}

const GroupListItem = ({ groupChat, onPress }: GroupListItemProps) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.backgroundCard, borderColor: colors.border },
      ]}
      onPress={() => onPress(groupChat.id)}
    >
      <View style={styles.avatarContainer}>
        <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primarySoft }]}>
            <MaterialIcons name="groups" size={30} color={colors.primary} />
        </View>
      </View>
      <View style={styles.info}>
        <Text style={[styles.groupName, { color: colors.textPrimary }]}>
          {groupChat.name}
        </Text>
        <Text style={[styles.memberCount, { color: colors.textSecondary }]}>
          {groupChat.memberIds?.length || 0} members
        </Text>
      </View>
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
    marginRight: 15,
  },
  avatarPlaceholder: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  memberCount: {
    fontSize: 12,
  },
});

export default GroupListItem;
