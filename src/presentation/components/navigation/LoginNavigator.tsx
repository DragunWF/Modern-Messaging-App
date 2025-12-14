import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../../screens/onboarding/LoginScreen";

const Stack = createStackNavigator();

function LoginNavigator() {
  return (
    <Stack.Navigator id="LoginNavigator">
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

export default LoginNavigator;
