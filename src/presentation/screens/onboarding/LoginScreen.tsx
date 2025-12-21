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
import {
  ONBOARDING_SCREEN_NAMES,
  HOME_SCREEN_NAMES,
} from "../../../shared/constants/navigation";
import { useAuth } from "../../context/AuthContext";
import TextInput from "../../components/ui/TextInput";
import Button from "../../components/ui/Button";
import { lightTheme } from "../../../shared/constants/colors";

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    // TODO: Testing navigation, remove later
    navigation.navigate(HOME_SCREEN_NAMES.Home);

    // TODO: Uncomment when ready to test login firebase authentication
    // try {
    //   await login(email, password);
    //   navigation.navigate(HOME_SCREEN_NAMES.Home);
    // } catch (error: any) {
    //   Alert.alert("Login Failed", error.message || "An error occurred");
    // }
  };

  const handleRegister = () => {
    navigation.navigate(ONBOARDING_SCREEN_NAMES.Register);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Login to your account</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.inputContainer}>
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

          <TouchableOpacity style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button title="Login" onPress={handleLogin} />
        </View>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account?</Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.signupButtonText}>Sign Up</Text>
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
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: lightTheme.info,
    fontSize: 14,
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  signupText: {
    color: lightTheme.textSecondary,
    fontSize: 16,
  },
  signupButtonText: {
    color: lightTheme.info,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
});

export default LoginScreen;
