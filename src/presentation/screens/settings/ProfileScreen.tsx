import { StyleSheet, View, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Button from "../../components/ui/Button";

interface ProfileScreenProps {
  navigation: any;
}

function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { user } = useAuth();
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
      padding: 20,
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
    button: {
      marginTop: 20,
      marginHorizontal: 40,
    },
  });

  const handleBackBtn = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
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
      <Button title="Go Back" style={styles.button} onPress={handleBackBtn} />
    </View>
  );
}

export default ProfileScreen;
