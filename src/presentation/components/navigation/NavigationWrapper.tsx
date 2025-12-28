import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import LoginNavigator from "./LoginNavigator";
import { useAuth } from "../../context/AuthContext";
import HomeNavigator from "./HomeNavigator";

function NavigationWrapper() {
  const { isAuthenticated } = useAuth();
  return (
    <NavigationContainer>
      {isAuthenticated ? <HomeNavigator /> : <LoginNavigator />}
    </NavigationContainer>
  );
}

export default NavigationWrapper;
