import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
import { Sun, Moon } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

const WIDTH = 56;
const HEIGHT = 30;
const KNOB = 24;

export default function ThemeToggle() {
  const { mode, toggleTheme, colors } = useTheme();
  const anim = useRef(new Animated.Value(mode === "dark" ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: mode === "dark" ? 1 : 0,
      useNativeDriver: true,
      speed: 22,
      bounciness: 8,
    }).start();
  }, [mode, anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [3, WIDTH - KNOB - 3],
  });

  return (
    <Pressable onPress={toggleTheme} hitSlop={8}>
      <Animated.View
        style={[
          styles.track,
          {
            width: WIDTH,
            height: HEIGHT,
            borderRadius: HEIGHT / 2,
            backgroundColor: colors.surfaceAlt,
            borderColor: colors.glassBorder,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.knob,
            {
              width: KNOB,
              height: KNOB,
              borderRadius: KNOB / 2,
              backgroundColor: colors.navy,
              transform: [{ translateX }],
            },
          ]}
        >
          {mode === "dark" ? (
            <Moon size={13} color={colors.gold} />
          ) : (
            <Sun size={13} color="#F2B441" />
          )}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    borderWidth: 1,
    justifyContent: "center",
  },
  knob: {
    position: "absolute",
    top: 3,
    alignItems: "center",
    justifyContent: "center",
  },
});
