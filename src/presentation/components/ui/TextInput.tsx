import React from "react";
import {
  TextInput as RNTextInput,
  TextInputProps,
  StyleSheet,
} from "react-native";
import { lightTheme } from "../../../shared/constants/colors";

const TextInput = (props: TextInputProps) => {
  return (
    <RNTextInput
      style={[styles.input, props.style]}
      placeholderTextColor={lightTheme.textPlaceholder}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: "100%",
    padding: 15,
    backgroundColor: lightTheme.backgroundInput,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    color: lightTheme.textPrimary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 1,
  },
});

export default TextInput;
