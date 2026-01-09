import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { useTheme } from "../../context/ThemeContext";

interface TypingIndicatorProps {
  text: string;
}

const Dot = ({ delay }: { delay: number }) => {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -3,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    // Start with a delay
    const timeout = setTimeout(() => {
      animation.start();
    }, delay);

    return () => {
      clearTimeout(timeout);
      animation.stop();
    };
  }, [delay, opacity, translateY]);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          backgroundColor: colors.textSecondary,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    />
  );
};

const TypingIndicator = ({ text }: TypingIndicatorProps) => {
  const { colors } = useTheme();

  if (!text) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.textSecondary }]}>{text}</Text>
      <View style={styles.dotsContainer}>
        <Dot delay={0} />
        <Dot delay={200} />
        <Dot delay={400} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 8,
    paddingTop: 4,
    height: 30, // Fixed height to prevent layout jumps if possible
  },
  text: {
    fontSize: 12,
    marginRight: 4,
    fontWeight: "500",
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 12,
    marginBottom: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },
});

export default TypingIndicator;
