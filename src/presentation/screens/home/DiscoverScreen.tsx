import { StyleSheet, View, Text } from "react-native";
import { useTheme } from "../../context/ThemeContext";

function DiscoverScreen() {
  const { colors } = useTheme();

  return (
    <View
      style={[styles.rootContainer, { backgroundColor: colors.background }]}
    >
      <Text>DiscoverScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
});

export default DiscoverScreen;
