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
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

function SettingsScreen() {
  const { logout } = useAuth();
  const { toggleTheme, colors, currentTheme } = useTheme(); 

  const handleToggleTheme = () => {
    toggleTheme(); // Call toggleTheme from context
  };

  const handleLogout = () => {
    Alert.alert("Are you sure you want to logout of your account?", "", [
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
    ]);
  };

  const handleViewProfile = () => {
    console.log("View Profile pressed");
  };

  const handleOpenGithubProfile = () => {
    // Replace with your actual GitHub profile URL
    const githubUrl = "https://github.com/DragunWF";
    Linking.openURL(githubUrl).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  return (
    <View
      style={[
        styles.rootContainer,
        { backgroundColor: colors.background },
      ]}
    >
      <Header title="Settings" />
      <View style={styles.contentContainer}>
        {/* Theme Toggle Button */}
        <IconButton
          title={`Toggle Theme (${
            currentTheme === "light" ? "Dark" : "Light"
          })`}
          iconName="brightness-6"
          onPress={handleToggleTheme}
        />

        {/* Your Profile Button */}
        <IconButton
          title="Your Profile"
          iconName="person"
          onPress={handleViewProfile}
        />

        {/* Logout Button */}
        <IconButton title="Logout" iconName="logout" onPress={handleLogout} />

        {/* Footer */}
        <View
          style={[
            styles.footerContainer,
            {
              borderTopColor: colors.border,
              backgroundColor: colors.backgroundCard,
            },
          ]}
        >
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Developed by Marc Plarisan
          </Text>
          <TouchableOpacity onPress={handleOpenGithubProfile}>
            <Text style={[styles.githubLinkText, { color: colors.info }]}>
              GitHub: DragunWF
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
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
    gap: 10,
    marginTop: 18,
  },
  footerText: {
    fontSize: 14,
  },
  githubLinkText: {
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default SettingsScreen;
