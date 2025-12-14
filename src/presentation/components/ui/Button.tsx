import React from "react";
import { Pressable, Text, StyleSheet, PressableProps } from "react-native";

interface ButtonProps extends PressableProps {
  title: string;
}

const Button = ({ title, style, ...props }: ButtonProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        typeof style === "function" ? style({ pressed }) : style,
      ]}
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
    backgroundColor: "#007AFF", // Placeholder button color
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center", // Added for safety
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
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Button;
