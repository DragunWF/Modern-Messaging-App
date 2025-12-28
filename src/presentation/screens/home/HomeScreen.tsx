import { StyleSheet, View, Text } from "react-native";
import { useTheme } from "../../context/ThemeContext";

function HomeScreen() {
  const { colors } = useTheme();

  return (
    <View
      style={[styles.rootContainer, { backgroundColor: colors.background }]}
    >
      <Text>FriendList</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
});

export default HomeScreen;
