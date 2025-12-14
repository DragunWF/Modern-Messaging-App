import React from "react";
import { Pressable, Text, StyleSheet, PressableProps } from "react-native";
import { lightTheme } from "../../../shared/constants/colors";

interface ButtonProps extends PressableProps {
  title: string;
}

const Button = ({ title, style, ...props }: ButtonProps) => {
  return (
    <Pressable
      // @ts-ignore
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
      {...props}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    padding: 18,
    backgroundColor: lightTheme.primary,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pressed: {
    opacity: 0.75,
  },
  buttonText: {
    color: lightTheme.textInverse,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Button;
