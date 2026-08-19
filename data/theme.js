// Semantic, mode-aware palettes. Both palettes expose the same keys so
// screens never branch on mode directly — they just read colors.<token>.
export const radius = {
  sm: 12,
  md: 20,
  lg: 24,
  pill: 999,
};

const shared = {
  gold: "#D4A94E",
  blue: "#1E4FD8",
  blueLight: "#4C7DFF",
};

export const lightColors = {
  ...shared,
  mode: "light",
  bg: "#EAF1FF",
  surface: "#FFFFFF",
  surfaceAlt: "#EDF1F7",
  navy: "#0B1E3D",
  navyDeep: "#081530",
  ice: "#EAF1FF",
  white: "#FFFFFF",
  textPrimary: "#0B1E3D",
  textSecondary: "#8A94A6",
  gray: "#8A94A6",
  grayLight: "#EDF1F7",
  success: "#1FA97A",
  danger: "#E5484D",
  positive: "#1FA97A",
  glassBorder: "rgba(255,255,255,0.35)",
  glassFill: "rgba(255,255,255,0.14)",
  glassOverlayA: "rgba(255,255,255,0.55)",
  glassOverlayB: "rgba(255,255,255,0.25)",
  chipBg: "#FFFFFF",
  shadowColor: "#0B1E3D",
};

export const darkColors = {
  ...shared,
  mode: "dark",
  bg: "#080D18",
  surface: "#121A2C",
  surfaceAlt: "#182338",
  navy: "#0B1E3D",
  navyDeep: "#050A16",
  ice: "#0F1830",
  white: "#F4F7FD",
  textPrimary: "#F1F4FB",
  textSecondary: "#8C97AE",
  gray: "#8C97AE",
  grayLight: "#1B2740",
  success: "#33C08C",
  danger: "#FF6B6F",
  positive: "#33C08C",
  glassBorder: "rgba(255,255,255,0.10)",
  glassFill: "rgba(255,255,255,0.05)",
  glassOverlayA: "rgba(255,255,255,0.10)",
  glassOverlayB: "rgba(255,255,255,0.03)",
  chipBg: "#121A2C",
  shadowColor: "#000000",
};

export function getShadow(colors) {
  return {
    card: {
      shadowColor: colors.shadowColor,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: colors.mode === "dark" ? 0.5 : 0.18,
      shadowRadius: 20,
      elevation: 8,
    },
    soft: {
      shadowColor: colors.shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: colors.mode === "dark" ? 0.4 : 0.1,
      shadowRadius: 10,
      elevation: 4,
    },
  };
}

// Backward-compatible static export (light mode) for any straggler imports.
export const colors = lightColors;
export const shadow = getShadow(lightColors);
