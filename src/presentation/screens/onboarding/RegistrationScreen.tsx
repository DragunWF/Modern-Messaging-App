import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import TextInput from "../../components/ui/TextInput";
import Button from "../../components/ui/Button";
import { lightTheme } from "../../../shared/constants/colors";

interface RegistrationScreenProps {
  navigation: any;
}

const RegistrationScreen = ({ navigation }: RegistrationScreenProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      await register(email, password, username);
      // Upon successful registration, the AuthContext should update user state,
      // and the MainNavigator (if set up) should automatically switch to Home.
      // Or we can manually navigate if needed, but usually auth state drives navigation.
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message || "An error occurred");
    }
  };

  const handleGoToLogin = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Create an account</Text>
          <Text style={styles.subtitle}>Start your journey with us today</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <Button title="Register" onPress={handleRegister} />
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={handleGoToLogin}>
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: lightTheme.background,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: lightTheme.textPrimary,
  },
  subtitle: {
    fontSize: 18,
    color: lightTheme.textSecondary,
    marginTop: 8,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 30,
  },
  loginContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  loginText: {
    color: lightTheme.textSecondary,
    fontSize: 16,
  },
  loginButtonText: {
    color: lightTheme.info,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default RegistrationScreen;
