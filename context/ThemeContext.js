import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightColors, darkColors, getShadow } from "../data/theme";

const THEME_KEY = "sallar_theme";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_KEY);
        if (saved === "dark" || saved === "light") setMode(saved);
      } catch (e) {
        // ignore, default to light
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const toggleTheme = async () => {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    try {
      await AsyncStorage.setItem(THEME_KEY, next);
    } catch (e) {
      // ignore persistence failure
    }
  };

  const value = useMemo(() => {
    const colors = mode === "dark" ? darkColors : lightColors;
    return { mode, colors, shadow: getShadow(colors), toggleTheme, ready };
  }, [mode, ready]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
