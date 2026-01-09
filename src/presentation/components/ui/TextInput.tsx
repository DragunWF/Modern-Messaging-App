import React from "react";
import {
  TextInput as RNTextInput,
  TextInputProps,
  StyleSheet,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

const TextInput = (props: TextInputProps) => {
  const { colors } = useTheme();

  return (
    <RNTextInput
      style={[
        styles.input,
        {
          backgroundColor: colors.backgroundInput,
          color: colors.textPrimary,
          borderColor: colors.border, // Add border color
        },
        props.style,
      ]}
      placeholderTextColor={colors.textPlaceholder}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 1,
    borderWidth: 1, // Add border width
  },
});

export default TextInput;
