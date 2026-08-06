import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  SafeAreaView,
  ToastAndroid,
  Platform,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { LogOut, CreditCard, TrendingUp, Landmark } from "lucide-react-native";
import { colors, radius, shadow } from "../data/theme";
import { user, accounts, otherAccounts, cards, getTotalBalance } from "../data/accounts";
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

export default function WalletScreen() {
  const { signOut } = useSession();
  const total = getTotalBalance();
  const [activeCard, setActiveCard] = useState(0);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <View style={styles.profilePill}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <Text style={styles.userName}>{user.name}</Text>
          </View>
          <Pressable onPress={signOut} style={styles.signOutBtn} hitSlop={10}>
            <LogOut size={18} color={colors.navy} />
          </Pressable>
        </View>

        <View style={styles.balanceBlock}>
          <Text style={styles.balanceLabel}>Total Balance Across All Accounts</Text>
          <Text style={styles.balanceValue}>{money(total)}</Text>
        </View>

        {/* Card stack */}
        <View style={styles.stackWrap}>
          {/* front card */}
          <Pressable
            onPress={() => {
              setActiveCard((c) => (c + 1) % 3);
              showDemo("Card details — demo mode");
            }}
            style={({ pressed }) => [styles.frontCardWrap, pressed && { transform: [{ scale: 0.98 }] }]}
          >
            <Image
              source={require("../assets/sallar_top_card.png")}
              style={styles.frontCardImg}
              resizeMode="contain"
            />
          </Pressable>
        </View>

        {/* Accounts */}
        <SectionHeader title="Your Accounts" />
        <GlassCard>
          <AccountRow
            title={accounts[0].name}
            sub={`Acct ${accounts[0].accountNumber}`}
            available={accounts[0].availableBalance}
            total={accounts[0].totalBalance}
            linked={accounts[0].linkedCard}
          />
        </GlassCard>
        <GlassCard>
          <AccountRow
            title={accounts[1].name}
            sub={`Acct ${accounts[1].accountNumber}`}
            total={accounts[1].totalBalance}
            linked={accounts[1].linkedCard || "N/A"}
          />
        </GlassCard>

        {/* Other banking accounts */}
        <SectionHeader title="Other Banking Accounts" />
        <View style={styles.linkedCard}>
          <View style={styles.linkedRow}>
            <View style={styles.linkedIconWrap}>
              <TrendingUp size={18} color={colors.gray} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.linkedTitle}>{otherAccounts[0].name}</Text>
              <Text style={styles.linkedSub}>Acct {otherAccounts[0].accountNumber} · Linked</Text>
            </View>
            <Text style={styles.linkedBalance}>{money(otherAccounts[0].totalBalance)}</Text>
          </View>
        </View>

        {/* Cards */}
        <SectionHeader title="Cards" />
        {cards.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => showDemo(`${c.network} — demo mode`)}
            style={({ pressed }) => [styles.cardChip, pressed && { opacity: 0.8 }]}
          >
            <View
              style={[
                styles.cardChipIcon,
                { backgroundColor: c.type === "credit" ? colors.navy : colors.blue },
              ]}
            >
              <CreditCard size={16} color={colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardChipLabel}>{c.label}</Text>
              <Text style={styles.cardChipNetwork}>{c.network}</Text>
            </View>
            <Text style={styles.cardChipLast4}>••{c.last4}</Text>
          </Pressable>
        ))}

        {/* Footer */}
        <View style={styles.footerBanner}>
          <Landmark size={16} color={colors.white} />
          <Text style={styles.footerBannerText}>Owned and Operated By Tamato.Design</Text>
        </View>
        <Text style={styles.legal}>© Sallar Financial Inc. All rights reserved.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({ title }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

function GlassCard({ children }) {
  return (
    <View style={styles.glassOuter}>
      <BlurView intensity={40} tint="light" style={styles.glassBlur}>
        <LinearGradient
          colors={["rgba(255,255,255,0.55)", "rgba(255,255,255,0.25)"]}
          style={styles.glassInner}
        >
          {children}
        </LinearGradient>
      </BlurView>
    </View>
  );
}

function AccountRow({ title, sub, available, total, linked }) {
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
        <Text style={styles.accountLineLabel}>Linked Card</Text>
        <Text style={styles.accountLineValue}>{linked}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ice },
  scroll: { padding: 20, paddingBottom: 48 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  profilePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
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
  avatarText: { color: colors.white, fontWeight: "800", fontSize: 13 },
  userName: { fontWeight: "700", color: colors.navy, fontSize: 14 },
  signOutBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  balanceBlock: { marginTop: 22, paddingHorizontal: 4 },
  balanceLabel: { fontSize: 12.5, fontWeight: "700", color: colors.gray, letterSpacing: 0.3 },
  balanceValue: { fontSize: 38, fontWeight: "900", color: colors.navy, marginTop: 4 },

  stackWrap: { height: 260, marginTop: 28, alignItems: "center", justifyContent: "center" },
  frontCardWrap: {
    width: "100%",
    ...shadow.card,
  },
  frontCardImg: { width: "100%", height: 260, borderRadius: radius.lg },

  sectionHeader: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.navy,
    marginTop: 30,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  glassOuter: {
    borderRadius: radius.md,
    overflow: "hidden",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    ...shadow.soft,
  },
  glassBlur: { borderRadius: radius.md },
  glassInner: { padding: 18 },
  accountRowTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  accountName: { fontSize: 16, fontWeight: "800", color: colors.navy },
  accountTotal: { fontSize: 17, fontWeight: "800", color: colors.navy },
  accountSub: { fontSize: 12.5, color: colors.gray, marginTop: 2, marginBottom: 12 },
  accountLineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  accountLineLabel: { fontSize: 13, color: colors.gray, fontWeight: "600" },
  accountLineValue: { fontSize: 13, color: colors.navy, fontWeight: "700" },

  linkedCard: {
    backgroundColor: "rgba(255,255,255,0.5)",
    borderWidth: 1.5,
    borderColor: colors.grayLight,
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
    backgroundColor: colors.grayLight,
    alignItems: "center",
    justifyContent: "center",
  },
  linkedTitle: { fontSize: 14.5, fontWeight: "700", color: colors.navy },
  linkedSub: { fontSize: 12, color: colors.gray, marginTop: 2 },
  linkedBalance: { fontSize: 15, fontWeight: "800", color: colors.navy },

  cardChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
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
  cardChipLabel: { fontSize: 14, fontWeight: "700", color: colors.navy },
  cardChipNetwork: { fontSize: 11.5, color: colors.gray, marginTop: 2 },
  cardChipLast4: { fontSize: 13, fontWeight: "700", color: colors.gray },

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
  footerBannerText: { color: colors.white, fontWeight: "700", fontSize: 12.5 },
  legal: {
    textAlign: "center",
    color: colors.gray,
    fontSize: 11,
    marginTop: 12,
  },
});
