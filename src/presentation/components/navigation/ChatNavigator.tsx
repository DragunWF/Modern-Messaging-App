import { createStackNavigator } from "@react-navigation/stack";

import {
  NAVIGATOR_NAMES,
  CHAT_SCREEN_NAMES,
} from "../../../shared/constants/navigation";
import ChatScreen from "../../screens/chat/ChatScreen";
import UserProfileScreen from "../../screens/chat/UserProfileScreen";
import GroupProfileScreen from "../../screens/chat/GroupProfileScreen";

const Stack = createStackNavigator();

function ChatNavigator() {
  return (
    <Stack.Navigator
      id={NAVIGATOR_NAMES.ChatNavigator}
      initialRouteName={CHAT_SCREEN_NAMES.Chat}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={CHAT_SCREEN_NAMES.Chat} component={ChatScreen} />
      <Stack.Screen name={CHAT_SCREEN_NAMES.GroupChat} component={ChatScreen} />
      <Stack.Screen
        name={CHAT_SCREEN_NAMES.UserProfile}
        component={UserProfileScreen}
      />
      <Stack.Screen
        name={CHAT_SCREEN_NAMES.GroupProfile}
        component={GroupProfileScreen}
      />
    </Stack.Navigator>
  );
}

export default ChatNavigator;
