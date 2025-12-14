import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NAVIGATOR_NAMES,
  HOME_SCREEN_NAMES,
} from "../../../shared/constants/navigation";

import HomeScreen from "../../screens/main/HomeScreen";
import DiscoverScreen from "../../screens/main/DiscoverScreen";
import NotificationsScreen from "../../screens/main/NotificationsScreen";

const BottomTab = createBottomTabNavigator();

function HomeNavigator() {
  return (
    <BottomTab.Navigator id={NAVIGATOR_NAMES.HomeNavigator}>
      <BottomTab.Screen name={HOME_SCREEN_NAMES.Home} component={HomeScreen} />
      <BottomTab.Screen
        name={HOME_SCREEN_NAMES.Discover}
        component={DiscoverScreen}
      />
      <BottomTab.Screen
        name={HOME_SCREEN_NAMES.Notifications}
        component={NotificationsScreen}
      />
    </BottomTab.Navigator>
  );
}

export default HomeNavigator;
