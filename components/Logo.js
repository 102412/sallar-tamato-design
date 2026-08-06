import React from "react";
import { Text, View } from "react-native";

// Text-based Sallar wordmark, styled to echo the icon (bold, italic-lean "SAL" + "LAR" stack feel)
// simplified to a clean single-line wordmark for in-app use.
export default function Logo({ size = 22, color = "#0B1E3D", accent = "#D4762A" }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text
        style={{
          fontSize: size,
          fontWeight: "900",
          letterSpacing: 0.5,
          color,
        }}
      >
        SAL
        <Text style={{ color: accent }}>LAR</Text>
      </Text>
    </View>
  );
}
