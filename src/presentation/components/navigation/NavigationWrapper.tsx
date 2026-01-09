import { NavigationContainer } from "@react-navigation/native";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginNavigator from "./LoginNavigator";
import { useAuth } from "../../context/AuthContext";
import HomeNavigator from "./HomeNavigator";
import ChatNavigator from "./ChatNavigator";
import { useTheme } from "../../context/ThemeContext";
import { NAVIGATOR_NAMES } from "../../../shared/constants/navigation";

const Stack = createStackNavigator();

function AuthenticatedNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={NAVIGATOR_NAMES.HomeNavigator}
        component={HomeNavigator}
      />
      <Stack.Screen
        name={NAVIGATOR_NAMES.ChatNavigator}
        component={ChatNavigator}
      />
    </Stack.Navigator>
  );
}

function NavigationWrapper() {
  const { isAuthenticated, isLoading } = useAuth();
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AuthenticatedNavigator /> : <LoginNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default NavigationWrapper;
