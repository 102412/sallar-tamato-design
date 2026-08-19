import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Bot, UtensilsCrossed, Music2, Gamepad2, ShoppingBag, Zap } from "lucide-react-native";

// Simple brand-colored badges standing in for third-party logos. This app
// already treats card networks (Visa®/Mastercard®) as plain text rather
// than reproducing real logo artwork — same rule applies here.
const BRANDS = {
  anthropic: { bg: "#DA7756", icon: Bot, fg: "#FFFFFF" },
  doordash: { bg: "#FF3008", icon: UtensilsCrossed, fg: "#FFFFFF" },
  applemusic: { bg: "#FA2D48", icon: Music2, fg: "#FFFFFF" },
  xbox: { bg: "#107C10", icon: Gamepad2, fg: "#FFFFFF" },
  depop: { bg: "#FF2300", icon: ShoppingBag, fg: "#FFFFFF" },
  stripe: { bg: "#635BFF", icon: Zap, fg: "#FFFFFF" },
};

export default function BrandBadge({ brand, size = 38, iconSize = 18, radius = 12 }) {
  const b = BRANDS[brand] || { bg: "#8A94A6", icon: Zap, fg: "#FFFFFF" };
  const Icon = b.icon;
  return (
    <View
      style={[
        styles.wrap,
        { width: size, height: size, borderRadius: radius, backgroundColor: b.bg },
      ]}
    >
      <Icon size={iconSize} color={b.fg} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
});
