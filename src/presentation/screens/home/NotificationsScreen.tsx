import { StyleSheet, View, Text } from "react-native";
import { useTheme } from "@react-navigation/native";

function NotificationsScreen() {
  const { colors } = useTheme();

  return (
    <View
      style={[styles.rootContainer, { backgroundColor: colors.background }]}
    >
      <Text>NotificationsScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
});

export default NotificationsScreen;
