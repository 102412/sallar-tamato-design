import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

// Concentric rings that continuously pulse outward from a center point,
// emulating an NFC/"tap to pay" ready state.
export default function NfcPulse({ color = "#1E4FD8", size = 220, active = true }) {
  const ring1 = useRef(new Animated.Value(0)).current;
  const ring2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) return;
    const loop = (val, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, { toValue: 1, duration: 1800, useNativeDriver: true }),
          Animated.timing(val, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      );
    const a1 = loop(ring1, 0);
    const a2 = loop(ring2, 900);
    a1.start();
    a2.start();
    return () => {
      a1.stop();
      a2.stop();
    };
  }, [active, ring1, ring2]);

  const ringStyle = (val) => ({
    position: "absolute",
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: 2,
    borderColor: color,
    opacity: val.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] }),
    transform: [
      {
        scale: val.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
      },
    ],
  });

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Animated.View style={ringStyle(ring1)} />
      <Animated.View style={ringStyle(ring2)} />
      <View style={[styles.core, { width: size * 0.4, height: size * 0.4, borderRadius: (size * 0.4) / 2, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  core: { alignItems: "center", justifyContent: "center" },
});
