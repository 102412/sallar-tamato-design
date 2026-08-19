import React, { useMemo } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ShieldCheck, Zap, SlidersHorizontal, HeartHandshake } from "lucide-react-native";
import Logo from "../components/Logo";
import FadeInUp from "../components/FadeInUp";
import PressScale from "../components/PressScale";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { radius } from "../data/theme";

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Transfers",
    desc: "Move money between accounts in seconds, not days.",
  },
  {
    icon: SlidersHorizontal,
    title: "Smart Card Controls",
    desc: "Freeze cards, set limits, and track spend in real time.",
  },
  {
    icon: HeartHandshake,
    title: "No Hidden Fees",
    desc: "Transparent pricing on every account, every time.",
  },
];

export default function LandingScreen({ navigation }) {
  const { colors, shadow } = useTheme();
  const styles = useMemo(() => makeStyles(colors, shadow), [colors, shadow]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Top nav */}
        <FadeInUp delay={0} duration={400}>
          <View style={styles.nav}>
            <Logo size={22} color={colors.textPrimary} />
            <View style={styles.navRight}>
              <ThemeToggle />
              <PressScale onPress={() => navigation.navigate("Login")} style={styles.ghostBtn}>
                <Text style={styles.ghostBtnText}>Log In</Text>
              </PressScale>
            </View>
          </View>
        </FadeInUp>

        {/* Hero */}
        <View style={styles.hero}>
          <FadeInUp delay={80}>
            <Text style={styles.heroTitle}>Banking that moves with you</Text>
          </FadeInUp>
          <FadeInUp delay={160}>
            <Text style={styles.heroSubhead}>
              One place for your accounts, cards, and cash flow — designed to feel effortless.
            </Text>
          </FadeInUp>
          <FadeInUp delay={240}>
            <PressScale
              onPress={() => navigation.navigate("Login")}
              style={styles.ctaBtn}
            >
              <Text style={styles.ctaBtnText}>Get Started</Text>
            </PressScale>
          </FadeInUp>
        </View>

        {/* Trust strip */}
        <FadeInUp delay={320}>
          <View style={styles.trustStrip}>
            {[
              { icon: ShieldCheck, label: "Bank-Grade Encryption" },
              { icon: HeartHandshake, label: "24/7 Support" },
              { icon: ShieldCheck, label: "Member Protection*" },
            ].map((t, i) => (
              <View key={i} style={styles.trustItem}>
                <t.icon size={18} color={colors.blue} />
                <Text style={styles.trustLabel}>{t.label}</Text>
              </View>
            ))}
          </View>
        </FadeInUp>

        {/* Feature blocks */}
        <View style={styles.features}>
          {FEATURES.map((f, i) => (
            <FadeInUp key={i} delay={400 + i * 100}>
              <View style={styles.featureCard}>
                <View style={styles.featureIconWrap}>
                  <f.icon size={22} color={colors.blue} />
                </View>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </FadeInUp>
          ))}
        </View>

        {/* Final CTA banner */}
        <FadeInUp delay={700}>
          <LinearGradient
            colors={[colors.navy, colors.blue]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bannerCard}
          >
            <Text style={styles.bannerTitle}>Ready to get started?</Text>
            <Text style={styles.bannerSubhead}>Join Sallar in minutes.</Text>
            <PressScale
              onPress={() => navigation.navigate("Login")}
              style={styles.bannerBtn}
            >
              <Text style={styles.bannerBtnText}>Get Started</Text>
            </PressScale>
          </LinearGradient>
        </FadeInUp>

        {/* Footer */}
        <FadeInUp delay={780}>
          <View style={styles.footer}>
            <Logo size={16} color={colors.textPrimary} />
            <View style={styles.footerLinks}>
              <Text style={styles.footerLink}>Privacy</Text>
              <Text style={styles.footerLink}>Terms</Text>
              <Text style={styles.footerLink}>Contact</Text>
            </View>
            <Text style={styles.disclosure}>
              This is a non-functional design/demo project — not a real bank or financial
              institution. * fictional, illustrative only.
            </Text>
          </View>
        </FadeInUp>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors, shadow) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    scroll: { paddingBottom: 40 },
    nav: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingTop: 18,
      paddingBottom: 8,
    },
    navRight: { flexDirection: "row", alignItems: "center", gap: 14 },
    ghostBtn: {
      paddingVertical: 8,
      paddingHorizontal: 18,
      borderRadius: radius.pill,
      borderWidth: 1.5,
      borderColor: colors.textPrimary,
    },
    ghostBtnText: { color: colors.textPrimary, fontWeight: "700", fontSize: 14 },
    hero: { paddingHorizontal: 24, paddingTop: 36, paddingBottom: 28 },
    heroTitle: {
      fontSize: 34,
      fontWeight: "900",
      color: colors.textPrimary,
      lineHeight: 40,
      marginBottom: 12,
    },
    heroSubhead: {
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: 24,
    },
    ctaBtn: {
      backgroundColor: colors.blue,
      paddingVertical: 16,
      borderRadius: radius.md,
      alignItems: "center",
      ...shadow.soft,
    },
    ctaBtnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 16 },
    trustStrip: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 24,
      paddingVertical: 20,
      backgroundColor: colors.surfaceAlt,
      marginHorizontal: 24,
      borderRadius: radius.md,
    },
    trustItem: { alignItems: "center", flex: 1, gap: 6 },
    trustLabel: {
      fontSize: 11,
      color: colors.textPrimary,
      fontWeight: "600",
      textAlign: "center",
    },
    features: { paddingHorizontal: 24, paddingTop: 32, gap: 16 },
    featureCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      ...shadow.soft,
    },
    featureIconWrap: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.surfaceAlt,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    featureTitle: { fontSize: 16, fontWeight: "800", color: colors.textPrimary, marginBottom: 4 },
    featureDesc: { fontSize: 13.5, color: colors.textSecondary, lineHeight: 19 },
    bannerCard: {
      marginHorizontal: 24,
      marginTop: 32,
      borderRadius: radius.lg,
      padding: 28,
      alignItems: "flex-start",
    },
    bannerTitle: { fontSize: 22, fontWeight: "900", color: "#FFFFFF", marginBottom: 4 },
    bannerSubhead: { fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 18 },
    bannerBtn: {
      backgroundColor: "#FFFFFF",
      paddingVertical: 12,
      paddingHorizontal: 22,
      borderRadius: radius.pill,
    },
    bannerBtnText: { color: colors.navy, fontWeight: "800", fontSize: 14 },
    footer: { paddingHorizontal: 24, paddingTop: 40, alignItems: "center", gap: 14 },
    footerLinks: { flexDirection: "row", gap: 20 },
    footerLink: { color: colors.textSecondary, fontSize: 13, fontWeight: "600" },
    disclosure: {
      fontSize: 11,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 16,
      marginTop: 6,
    },
  });
