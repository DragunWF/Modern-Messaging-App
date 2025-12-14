import React from "react";
import {
  TextInput as RNTextInput,
  TextInputProps,
  StyleSheet,
} from "react-native";

const TextInput = (props: TextInputProps) => {
  return <RNTextInput style={[styles.input, props.style]} {...props} />;
};

const styles = StyleSheet.create({
  input: {
    width: "100%",
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});

export default TextInput;
