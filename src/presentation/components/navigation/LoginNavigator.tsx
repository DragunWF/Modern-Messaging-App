import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../../screens/onboarding/LoginScreen";
import RegistrationScreen from "../../screens/onboarding/RegistrationScreen";
import { ONBOARDING_SCREEN_NAMES } from "../../../shared/constants/navigation";

const Stack = createStackNavigator();

function LoginNavigator() {
  return (
    <Stack.Navigator id="LoginNavigator">
      <Stack.Screen
        name={ONBOARDING_SCREEN_NAMES.Login}
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={ONBOARDING_SCREEN_NAMES.Register}
        component={RegistrationScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default LoginNavigator;
