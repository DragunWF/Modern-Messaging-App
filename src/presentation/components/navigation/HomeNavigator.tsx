import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NAVIGATOR_NAMES,
  HOME_SCREEN_NAMES,
} from "../../../shared/constants/navigation";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import HomeScreen from "../../screens/home/HomeScreen";
import DiscoverScreen from "../../screens/home/DiscoverScreen";
import NotificationsScreen from "../../screens/home/NotificationsScreen";

const BottomTab = createBottomTabNavigator();

function HomeNavigator() {
  return (
    <BottomTab.Navigator
      id={NAVIGATOR_NAMES.HomeNavigator}
      initialRouteName={HOME_SCREEN_NAMES.Home}
      screenOptions={{
        headerShown: false,
      }}
    >
      <BottomTab.Screen
        name={HOME_SCREEN_NAMES.Discover}
        component={DiscoverScreen}
        options={{
          tabBarLabel: "Discover",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "compass" : "compass-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name={HOME_SCREEN_NAMES.Home}
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name={HOME_SCREEN_NAMES.Notifications}
        component={NotificationsScreen}
        options={{
          tabBarLabel: "Notifications",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "bell" : "bell-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

export default HomeNavigator;
