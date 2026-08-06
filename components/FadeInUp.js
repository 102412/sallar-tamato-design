import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

// Reusable mount-in animation: fades + slides up. Stagger children across a
// screen by passing increasing `delay` values.
export default function FadeInUp({
  children,
  delay = 0,
  duration = 500,
  distance = 18,
  fromScale,
  style,
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = Animated.timing(anim, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    });
    timer.start();
    return () => timer.stop();
  }, [anim, delay, duration]);

  const transform = [
    {
      translateY: anim.interpolate({
        inputRange: [0, 1],
        outputRange: [distance, 0],
      }),
    },
  ];
  if (fromScale) {
    transform.push({
      scale: anim.interpolate({ inputRange: [0, 1], outputRange: [fromScale, 1] }),
    });
  }

  return (
    <Animated.View style={[style, { opacity: anim, transform }]}>{children}</Animated.View>
  );
}
