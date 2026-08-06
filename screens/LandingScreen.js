import React from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ShieldCheck, Zap, SlidersHorizontal, HeartHandshake } from "lucide-react-native";
import Logo from "../components/Logo";
import { colors, radius, shadow } from "../data/theme";

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
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Top nav */}
        <View style={styles.nav}>
          <Logo size={22} />
          <Pressable
            onPress={() => navigation.navigate("Login")}
            style={styles.ghostBtn}
          >
            <Text style={styles.ghostBtnText}>Log In</Text>
          </Pressable>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Banking that moves with you</Text>
          <Text style={styles.heroSubhead}>
            One place for your accounts, cards, and cash flow — designed to feel effortless.
          </Text>
          <Pressable
            onPress={() => navigation.navigate("Login")}
            style={({ pressed }) => [styles.ctaBtn, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.ctaBtnText}>Get Started</Text>
          </Pressable>
        </View>

        {/* Trust strip */}
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

        {/* Feature blocks */}
        <View style={styles.features}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureCard}>
              <View style={styles.featureIconWrap}>
                <f.icon size={22} color={colors.blue} />
              </View>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          ))}
        </View>

        {/* Final CTA banner */}
        <LinearGradient
          colors={[colors.navy, colors.blue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bannerCard}
        >
          <Text style={styles.bannerTitle}>Ready to get started?</Text>
          <Text style={styles.bannerSubhead}>Join Sallar in minutes.</Text>
          <Pressable
            onPress={() => navigation.navigate("Login")}
            style={({ pressed }) => [styles.bannerBtn, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.bannerBtnText}>Get Started</Text>
          </Pressable>
        </LinearGradient>

        {/* Footer */}
        <View style={styles.footer}>
          <Logo size={16} />
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingBottom: 40 },
  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 8,
  },
  ghostBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.navy,
  },
  ghostBtnText: { color: colors.navy, fontWeight: "700", fontSize: 14 },
  hero: { paddingHorizontal: 24, paddingTop: 36, paddingBottom: 28 },
  heroTitle: {
    fontSize: 34,
    fontWeight: "900",
    color: colors.navy,
    lineHeight: 40,
    marginBottom: 12,
  },
  heroSubhead: {
    fontSize: 16,
    color: colors.gray,
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
  ctaBtnText: { color: colors.white, fontWeight: "800", fontSize: 16 },
  trustStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: colors.ice,
    marginHorizontal: 24,
    borderRadius: radius.md,
  },
  trustItem: { alignItems: "center", flex: 1, gap: 6 },
  trustLabel: {
    fontSize: 11,
    color: colors.navy,
    fontWeight: "600",
    textAlign: "center",
  },
  features: { paddingHorizontal: 24, paddingTop: 32, gap: 16 },
  featureCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.grayLight,
    ...shadow.soft,
  },
  featureIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.ice,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  featureTitle: { fontSize: 16, fontWeight: "800", color: colors.navy, marginBottom: 4 },
  featureDesc: { fontSize: 13.5, color: colors.gray, lineHeight: 19 },
  bannerCard: {
    marginHorizontal: 24,
    marginTop: 32,
    borderRadius: radius.lg,
    padding: 28,
    alignItems: "flex-start",
  },
  bannerTitle: { fontSize: 22, fontWeight: "900", color: colors.white, marginBottom: 4 },
  bannerSubhead: { fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 18 },
  bannerBtn: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: radius.pill,
  },
  bannerBtnText: { color: colors.navy, fontWeight: "800", fontSize: 14 },
  footer: { paddingHorizontal: 24, paddingTop: 40, alignItems: "center", gap: 14 },
  footerLinks: { flexDirection: "row", gap: 20 },
  footerLink: { color: colors.gray, fontSize: 13, fontWeight: "600" },
  disclosure: {
    fontSize: 11,
    color: colors.gray,
    textAlign: "center",
    lineHeight: 16,
    marginTop: 6,
  },
});
