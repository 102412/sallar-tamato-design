import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Animated,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../components/Logo";
import FadeInUp from "../components/FadeInUp";
import PressScale from "../components/PressScale";
import { colors, radius, shadow } from "../data/theme";
import { user } from "../data/accounts";
import { useSession } from "../context/SessionContext";

const VALID_EMAIL = "Rylandritchie12@gmail.com";
const VALID_PASSWORD = "Keith2134!";

export default function LoginScreen({ navigation }) {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const shake = useRef(new Animated.Value(0)).current;

  const runShake = () => {
    shake.setValue(0);
    Animated.sequence([
      Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleLogin = async () => {
    if (
      email.trim().toLowerCase() === VALID_EMAIL.toLowerCase() &&
      password === VALID_PASSWORD
    ) {
      setError("");
      await signIn();
    } else {
      setError("Incorrect email or password. Please try again.");
      runShake();
    }
  };

  return (
    <LinearGradient colors={[colors.navy, colors.navyDeep]} style={styles.bg}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.center}
        >
          <FadeInUp delay={0} duration={450}>
            <View style={styles.logoWrap}>
              <Logo size={30} color={colors.white} accent={colors.gold} />
            </View>
          </FadeInUp>

          <FadeInUp delay={100} duration={450} distance={26}>
            <Animated.View
              style={[
                styles.card,
                {
                  transform: [
                    {
                      translateX: shake.interpolate({
                        inputRange: [-1, 1],
                        outputRange: [-8, 8],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>Log in to access your accounts</Text>

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={colors.gray}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={colors.gray}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <PressScale onPress={handleLogin} style={styles.loginBtn}>
                <Text style={styles.loginBtnText}>Log In</Text>
              </PressScale>

              <Text style={styles.forgot}>Forgot password?</Text>
            </Animated.View>
          </FadeInUp>

          <FadeInUp delay={200}>
            <PressScale onPress={() => navigation.goBack()} scaleTo={0.94} hitSlop={10}>
              <Text style={styles.backLink}>← Back to home</Text>
            </PressScale>
          </FadeInUp>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  logoWrap: { marginBottom: 28 },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 26,
    ...shadow.card,
  },
  title: { fontSize: 24, fontWeight: "900", color: colors.navy, marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.gray, marginBottom: 22 },
  label: { fontSize: 12.5, fontWeight: "700", color: colors.navy, marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1.5,
    borderColor: colors.grayLight,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.navy,
    backgroundColor: colors.grayLight,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 14,
    fontWeight: "600",
  },
  loginBtn: {
    backgroundColor: colors.blue,
    borderRadius: radius.md,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 22,
  },
  loginBtnText: { color: colors.white, fontWeight: "800", fontSize: 15 },
  forgot: {
    textAlign: "center",
    color: colors.gray,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 16,
  },
  backLink: { color: "rgba(255,255,255,0.7)", marginTop: 22, fontSize: 13, fontWeight: "600" },
});
