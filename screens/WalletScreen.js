import React, { useMemo, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ToastAndroid,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { LogOut, CreditCard, TrendingUp, Landmark } from "lucide-react-native";
import FadeInUp from "../components/FadeInUp";
import PressScale from "../components/PressScale";
import ThemeToggle from "../components/ThemeToggle";
import CardCarousel from "../components/CardCarousel";
import CardDetailPanel from "../components/CardDetailPanel";
import SubscriptionsSection from "../components/SubscriptionsSection";
import TransactionsSection from "../components/TransactionsSection";
import { useTheme } from "../context/ThemeContext";
import { radius } from "../data/theme";
import { user, accounts, otherAccounts, cards, carouselCards, getTotalBalance } from "../data/accounts";
import { useSession } from "../context/SessionContext";

const initials = user.name
  .split(" ")
  .map((n) => n[0])
  .join("")
  .slice(0, 2);

const money = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

function showDemo(msg = "Demo mode — not a real action") {
  if (Platform.OS === "android") {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Alert.alert("Demo mode", msg);
  }
}

const DEFAULT_CARD_ID = "amex-platinum";
const DEFAULT_CARD_INDEX = Math.max(
  0,
  carouselCards.findIndex((c) => c.id === DEFAULT_CARD_ID)
);

export default function WalletScreen({ navigation }) {
  const { signOut } = useSession();
  const { colors, shadow } = useTheme();
  const styles = useMemo(() => makeStyles(colors, shadow), [colors, shadow]);
  const total = getTotalBalance();
  const [activeCardIndex, setActiveCardIndex] = useState(DEFAULT_CARD_INDEX);
  const activeCard = carouselCards[activeCardIndex];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Top bar */}
        <FadeInUp delay={0} duration={400}>
          <View style={styles.topBar}>
            <View style={styles.profilePill}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <Text style={styles.userName}>{user.name}</Text>
            </View>
            <View style={styles.topBarRight}>
              <ThemeToggle />
              <PressScale onPress={signOut} style={styles.signOutBtn} scaleTo={0.88} hitSlop={10}>
                <LogOut size={18} color={colors.textPrimary} />
              </PressScale>
            </View>
          </View>
        </FadeInUp>

        <FadeInUp delay={80}>
          <View style={styles.balanceBlock}>
            <Text style={styles.balanceLabel}>Total Balance Across All Accounts</Text>
            <Text style={styles.balanceValue}>{money(total)}</Text>
          </View>
        </FadeInUp>

        {/* Card carousel — swipe to browse (updates the panel below), tap a card to open its dedicated page */}
        <FadeInUp delay={160} duration={550} distance={14} fromScale={0.96}>
          <CardCarousel
            cards={carouselCards}
            activeIndex={activeCardIndex}
            initialIndex={DEFAULT_CARD_INDEX}
            onChangeIndex={setActiveCardIndex}
            onPressCard={(card) => navigation.navigate("CardPay", { cardId: card.id })}
          />
        </FadeInUp>

        <CardDetailPanel card={activeCard} />

        {/* Accounts */}
        <FadeInUp delay={260}>
          <SectionHeader title="Your Accounts" styles={styles} />
        </FadeInUp>
        <FadeInUp delay={320}>
          <GlassCard colors={colors}>
            <AccountRow
              styles={styles}
              title={accounts[0].name}
              sub={`Acct ${accounts[0].accountNumber}`}
              available={accounts[0].availableBalance}
              total={accounts[0].totalBalance}
              linked={describeLinkedCards(accounts[0], carouselCards)}
            />
          </GlassCard>
        </FadeInUp>
        <FadeInUp delay={380}>
          <GlassCard colors={colors}>
            <AccountRow
              styles={styles}
              title={accounts[1].name}
              sub={`Acct ${accounts[1].accountNumber}`}
              total={accounts[1].totalBalance}
              linked={describeLinkedCards(accounts[1], carouselCards)}
            />
          </GlassCard>
        </FadeInUp>

        {/* Other banking accounts */}
        <FadeInUp delay={440}>
          <SectionHeader title="Other Banking Accounts" styles={styles} />
        </FadeInUp>
        <FadeInUp delay={480}>
          <View style={styles.linkedCard}>
            <View style={styles.linkedRow}>
              <View style={styles.linkedIconWrap}>
                <TrendingUp size={18} color={colors.textSecondary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.linkedTitle}>{otherAccounts[0].name}</Text>
                <Text style={styles.linkedSub}>Acct {otherAccounts[0].accountNumber} · Linked</Text>
              </View>
              <Text style={styles.linkedBalance}>{money(otherAccounts[0].totalBalance)}</Text>
            </View>
          </View>
        </FadeInUp>

        {/* Subscriptions */}
        <SubscriptionsSection
          baseDelay={540}
          onPressItem={(s) => showDemo(`${s.name} — demo mode`)}
        />

        {/* Recent transactions */}
        <TransactionsSection
          baseDelay={780}
          onPressItem={(t) => showDemo(`${t.merchant} — demo mode`)}
        />

        {/* Cards */}
        <FadeInUp delay={960}>
          <SectionHeader title="Cards" styles={styles} />
        </FadeInUp>
        {cards.map((c, i) => (
          <FadeInUp key={c.id} delay={1000 + i * 60}>
            <PressScale
              onPress={() => showDemo(`${c.network} — demo mode`)}
              scaleTo={0.97}
              style={styles.cardChip}
            >
              <View
                style={[
                  styles.cardChipIcon,
                  { backgroundColor: c.type === "credit" ? colors.navy : colors.blue },
                ]}
              >
                <CreditCard size={16} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardChipLabel}>{c.label}</Text>
                <Text style={styles.cardChipNetwork}>{c.network}</Text>
              </View>
              <Text style={styles.cardChipLast4}>••{c.last4}</Text>
            </PressScale>
          </FadeInUp>
        ))}

        {/* Footer */}
        <FadeInUp delay={1140}>
          <View style={styles.footerBanner}>
            <Landmark size={16} color="#FFFFFF" />
            <Text style={styles.footerBannerText}>Owned and Operated By Tamato.Design</Text>
          </View>
          <Text style={styles.legal}>© Sallar Financial Inc. All rights reserved.</Text>
        </FadeInUp>
      </ScrollView>
    </SafeAreaView>
  );
}

function describeLinkedCards(account, carousel) {
  const list = (account.linkedCards || [])
    .map((id) => carousel.find((c) => c.id === id))
    .filter(Boolean);
  if (list.length === 0) return "N/A";
  return list.map((c) => `${c.label} ••${c.last4}`).join(", ");
}

function SectionHeader({ title, styles }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

function GlassCard({ children, colors }) {
  return (
    <View
      style={{
        borderRadius: radius.md,
        overflow: "hidden",
        marginBottom: 14,
        borderWidth: 1,
        borderColor: colors.glassBorder,
      }}
    >
      <BlurView intensity={40} tint={colors.mode === "dark" ? "dark" : "light"} style={{ borderRadius: radius.md }}>
        <LinearGradient
          colors={[colors.glassOverlayA, colors.glassOverlayB]}
          style={{ padding: 18 }}
        >
          {children}
        </LinearGradient>
      </BlurView>
    </View>
  );
}

function AccountRow({ title, sub, available, total, linked, styles }) {
  return (
    <View>
      <View style={styles.accountRowTop}>
        <Text style={styles.accountName}>{title}</Text>
        <Text style={styles.accountTotal}>{money(total)}</Text>
      </View>
      <Text style={styles.accountSub}>{sub}</Text>
      {available !== undefined && (
        <View style={styles.accountLineRow}>
          <Text style={styles.accountLineLabel}>Available Balance</Text>
          <Text style={styles.accountLineValue}>{money(available)}</Text>
        </View>
      )}
      <View style={styles.accountLineRow}>
        <Text style={styles.accountLineLabel}>Total Balance</Text>
        <Text style={styles.accountLineValue}>{money(total)}</Text>
      </View>
      <View style={styles.accountLineRow}>
        <Text style={styles.accountLineLabel}>Linked Card{linked.includes(",") ? "s" : ""}</Text>
        <Text style={[styles.accountLineValue, { flexShrink: 1, textAlign: "right" }]}>
          {linked}
        </Text>
      </View>
    </View>
  );
}

const makeStyles = (colors, shadow) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    scroll: { padding: 20, paddingBottom: 48 },
    topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    topBarRight: { flexDirection: "row", alignItems: "center", gap: 12 },
    profilePill: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      borderRadius: radius.pill,
      paddingVertical: 6,
      paddingHorizontal: 8,
      paddingRight: 16,
      gap: 10,
    },
    avatar: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: colors.navy,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: { color: "#FFFFFF", fontWeight: "800", fontSize: 13 },
    userName: { fontWeight: "700", color: colors.textPrimary, fontSize: 14 },
    signOutBtn: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      alignItems: "center",
      justifyContent: "center",
    },
    balanceBlock: { marginTop: 22, paddingHorizontal: 4 },
    balanceLabel: { fontSize: 12.5, fontWeight: "700", color: colors.textSecondary, letterSpacing: 0.3 },
    balanceValue: { fontSize: 38, fontWeight: "900", color: colors.textPrimary, marginTop: 4 },

    sectionHeader: {
      fontSize: 15,
      fontWeight: "800",
      color: colors.textPrimary,
      marginTop: 30,
      marginBottom: 12,
      paddingHorizontal: 4,
    },
    accountRowTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    accountName: { fontSize: 16, fontWeight: "800", color: colors.textPrimary },
    accountTotal: { fontSize: 17, fontWeight: "800", color: colors.textPrimary },
    accountSub: { fontSize: 12.5, color: colors.textSecondary, marginTop: 2, marginBottom: 12 },
    accountLineRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 5,
      gap: 12,
    },
    accountLineLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: "600" },
    accountLineValue: { fontSize: 13, color: colors.textPrimary, fontWeight: "700" },

    linkedCard: {
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.glassBorder,
      borderStyle: "dashed",
      borderRadius: radius.md,
      padding: 16,
      marginBottom: 14,
    },
    linkedRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    linkedIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.surfaceAlt,
      alignItems: "center",
      justifyContent: "center",
    },
    linkedTitle: { fontSize: 14.5, fontWeight: "700", color: colors.textPrimary },
    linkedSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
    linkedBalance: { fontSize: 15, fontWeight: "800", color: colors.textPrimary },

    cardChip: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: 14,
      marginBottom: 10,
      gap: 12,
      ...shadow.soft,
    },
    cardChipIcon: {
      width: 34,
      height: 34,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    cardChipLabel: { fontSize: 14, fontWeight: "700", color: colors.textPrimary },
    cardChipNetwork: { fontSize: 11.5, color: colors.textSecondary, marginTop: 2 },
    cardChipLast4: { fontSize: 13, fontWeight: "700", color: colors.textSecondary },

    footerBanner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: colors.navy,
      borderRadius: radius.md,
      paddingVertical: 14,
      marginTop: 34,
    },
    footerBannerText: { color: "#FFFFFF", fontWeight: "700", fontSize: 12.5 },
    legal: {
      textAlign: "center",
      color: colors.textSecondary,
      fontSize: 11,
      marginTop: 12,
    },
  });
