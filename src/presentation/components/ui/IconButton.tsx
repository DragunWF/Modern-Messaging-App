import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  PressableProps,
  View,
} from "react-native";
import { lightTheme } from "../../../shared/constants/colors";
import { MaterialIcons } from "@expo/vector-icons";

interface IconButtonProps extends PressableProps {
  title: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
  iconSize?: number;
}

const IconButton = ({
  title,
  iconName,
  iconColor = lightTheme.textPrimary,
  iconSize = 24,
  style,
  ...props
}: IconButtonProps) => {
  return (
    <Pressable
      // @ts-ignore
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
      {...props}
    >
      <View style={styles.contentContainer}>
        <MaterialIcons
          name={iconName}
          size={iconSize}
          color={iconColor}
          style={styles.icon}
        />
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    padding: 18,
    backgroundColor: lightTheme.backgroundCard,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  pressed: {
    opacity: 0.75,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 15,
  },
  buttonText: {
    color: lightTheme.textPrimary,
    fontSize: 18,
    fontWeight: "500",
  },
});

export default IconButton;
