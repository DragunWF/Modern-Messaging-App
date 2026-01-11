import { StyleSheet, View, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Button from "../../components/ui/Button";
import Header from "../../components/ui/Header";

interface ProfileScreenProps {
  navigation: any;
}

function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { user } = useAuth();
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    profileContent: {
      flex: 1,
      alignItems: "center",
      paddingTop: 50,
    },
    profileIcon: {
      marginBottom: 20,
    },
    username: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.textPrimary,
      marginBottom: 5,
    },
    email: {
      fontSize: 18,
      color: colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <Header
        title="Profile"
        onBackPress={() => navigation.goBack()}
        rightComponent={null}
      />
      <View style={styles.profileContent}>
        {user ? (
          <>
            <FontAwesome
              name="user-circle"
              size={100}
              color={colors.primary}
              style={styles.profileIcon}
            />
            <Text style={styles.username}>{user.username}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </>
        ) : (
          <Text>Loading profile...</Text>
        )}
      </View>
    </View>
  );
}

export default ProfileScreen;
