import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Alert, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import { useService } from "../../context/ServiceContext";
import { useAuth } from "../../context/AuthContext";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import User from "../../../domain/entities/user";
import Button from "../../components/ui/Button";
import Header from "../../components/ui/Header";
import {
  CHAT_SCREEN_NAMES,
  NAVIGATOR_NAMES,
  HOME_SCREEN_NAMES,
} from "../../../shared/constants/navigation";

function UserProfileScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { userUseCases } = useService();
  const { user: authUser } = useAuth();

  const { userId } = route.params;
  const [friendProfile, setFriendProfile] = useState<User | null>(null);

  useEffect(() => {
    const fetchFriendProfile = async () => {
      if (userId) {
        const user = await userUseCases.getUserById(userId);
        setFriendProfile(user);
      }
    };
    fetchFriendProfile();
  }, [userId, userUseCases]);

  const handleRemoveFriend = () => {
    if (!authUser?.id || !friendProfile?.id) {
      Alert.alert("Error", "Could not remove friend. User data missing.");
      return;
    }

    Alert.alert(
      "Remove Friend",
      `Are you sure you want to remove ${friendProfile.username} as a friend?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await userUseCases.removeFriend(authUser.id, friendProfile.id);
              Alert.alert(
                "Success",
                `${friendProfile.username} has been removed from your friends.`
              );

              // Navigate back to Home Screen
              navigation.navigate(NAVIGATOR_NAMES.HomeNavigator, {
                screen: HOME_SCREEN_NAMES.Home,
              });
            } catch (error) {
              console.error("Error removing friend:", error);
              Alert.alert("Error", "Failed to remove friend.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (!friendProfile) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header
          title="Profile"
          onBackPress={() => navigation.goBack()}
          rightComponent={null}
        />
        <View style={styles.loadingContainer}>
          <Text style={{ color: colors.textPrimary }}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Profile"
        onBackPress={() => navigation.goBack()}
        rightComponent={null}
      />
      <View style={styles.profileContent}>
        <FontAwesome
          name="user-circle"
          size={100}
          color={colors.textPlaceholder}
          style={styles.avatar}
        />
        <Text style={[styles.username, { color: colors.textPrimary }]}>
          {friendProfile.username}
        </Text>
        <View style={styles.statusContainer}>
          <Ionicons
            name="ellipse"
            size={14}
            color={
              friendProfile.isOnline ? colors.success : colors.textSecondary
            }
            style={styles.statusIcon}
          />
          <Text style={[styles.statusText, { color: colors.textPrimary }]}>
            {friendProfile.isOnline ? "Online" : "Offline"}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Remove Friend" onPress={handleRemoveFriend} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileContent: {
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
  },
  avatar: {
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  statusIcon: {
    marginRight: 5,
  },
  statusText: {
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 10,
    width: "80%",
  },
});

export default UserProfileScreen;
