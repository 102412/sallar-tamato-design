import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { SessionProvider, useSession } from "./context/SessionContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import LandingScreen from "./screens/LandingScreen";
import LoginScreen from "./screens/LoginScreen";
import WalletScreen from "./screens/WalletScreen";
import CardPayScreen from "./screens/CardPayScreen";

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { loggedIn, ready: sessionReady } = useSession();
  const { colors, mode, ready: themeReady } = useTheme();

  if (!sessionReady || !themeReady) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }

  const navTheme = {
    ...(mode === "dark" ? DarkTheme : DefaultTheme),
    colors: {
      ...(mode === "dark" ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.bg,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.glassBorder,
      primary: colors.blue,
    },
  };

  return (
    <>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {loggedIn ? (
            <>
              <Stack.Screen name="Wallet" component={WalletScreen} />
              <Stack.Screen
                name="CardPay"
                component={CardPayScreen}
                options={{ animation: "slide_from_right" }}
              />
            </>
          ) : (
            <>
              <Stack.Screen name="Landing" component={LandingScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SessionProvider>
          <RootNavigator />
        </SessionProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
