import { NavigationContainer } from "@react-navigation/native";
import LoginNavigator from "./LoginNavigator";

function NavigationWrapper() {
  return (
    <NavigationContainer>
      <LoginNavigator />
    </NavigationContainer>
  );
}

export default NavigationWrapper;
