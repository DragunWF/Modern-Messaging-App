import { createStackNavigator } from "@react-navigation/stack";
import {
  NAVIGATOR_NAMES,
  SETTINGS_SCREEN_NAMES,
} from "../../../shared/constants/navigation";
import SettingsScreen from "../../screens/home/SettingsScreen";
import ProfileScreen from "../../screens/settings/ProfileScreen";

const Stack = createStackNavigator();

function SettingsNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={SETTINGS_SCREEN_NAMES.Settings}
      id={NAVIGATOR_NAMES.SettingsNavigator}
    >
      <Stack.Screen
        name={SETTINGS_SCREEN_NAMES.Settings}
        component={SettingsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={SETTINGS_SCREEN_NAMES.Profile}
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default SettingsNavigator;
