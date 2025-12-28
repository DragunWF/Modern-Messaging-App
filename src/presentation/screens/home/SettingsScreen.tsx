import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import Header from "../../components/ui/Header";
import IconButton from "../../components/ui/IconButton";
import { lightTheme } from "../../../shared/constants/colors";
import { useAuth } from "../../context/AuthContext";

function SettingsScreen() {
  const { logout } = useAuth();

  const handleToggleTheme = () => {
    console.log("Toggle Theme pressed");
  };

  const handleLogout = () => {
    Alert.alert(
      "Are you sure?",
      "You will have to enter your username and password again to login.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error("Logout failed:", error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          },
        },
      ]
    );
  };

  const handleOpenGithubProfile = () => {
    // Replace with your actual GitHub profile URL
    const githubUrl = "https://github.com/marcplarisan";
    Linking.openURL(githubUrl).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  return (
    <View style={styles.fullScreenContainer}>
      <Header title="Settings" />
      <View style={styles.contentContainer}>
        {/* Theme Toggle Button */}
        <IconButton
          title="Toggle Theme"
          iconName="brightness-6"
          onPress={handleToggleTheme}
        />

        {/* Logout Button */}
        <IconButton title="Logout" iconName="logout" onPress={handleLogout} />

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Developed by Marc Plarisan</Text>
          <TouchableOpacity onPress={handleOpenGithubProfile}>
            <Text style={styles.githubLinkText}>GitHub: DragunWF</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: lightTheme.background,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  footerContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: lightTheme.border,
    backgroundColor: lightTheme.backgroundCard,
    gap: 10,
    marginTop: 18,
  },
  footerText: {
    color: lightTheme.textSecondary,
    fontSize: 14,
  },
  githubLinkText: {
    color: lightTheme.info, // Using info color for links
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default SettingsScreen;
