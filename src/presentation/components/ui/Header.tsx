import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { lightTheme } from "../../../shared/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.headerContainer,
        { paddingTop: insets.top > 0 ? insets.top + 10 : 15 }, // Add some extra padding if there's an inset, or default
      ]}
    >
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    backgroundColor: lightTheme.backgroundCard, // Use a card background for the header
    paddingBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    color: lightTheme.textPrimary,
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Header;
