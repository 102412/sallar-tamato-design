import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Link2, Link2Off } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";
import { getAccountById } from "../data/accounts";

const money = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

// Cross-fades its content whenever the active card changes, so tapping a
// card in the carousel visibly drives the info below rather than the whole
// screen just re-rendering statically.
export default function CardDetailPanel({ card }) {
  const { colors, shadow } = useTheme();
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(card);

  useEffect(() => {
    // The content swap runs on its own timer rather than inside the fade
    // animation's completion callback — an animation that gets interrupted
    // or never resolves its driver shouldn't be able to strand the panel
    // showing stale card info.
    Animated.timing(anim, { toValue: 0, duration: 120, useNativeDriver: true }).start();
    const t = setTimeout(() => {
      setDisplay(card);
      Animated.timing(anim, { toValue: 1, duration: 220, useNativeDriver: true }).start();
    }, 120);
    return () => clearTimeout(t);
  }, [card, anim]);

  const account = display.accountId ? getAccountById(display.accountId) : null;

  return (
    <Animated.View
      style={[
        styles.panel,
        shadow.soft,
        {
          backgroundColor: colors.surface,
          borderColor: colors.glassBorder,
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }),
            },
          ],
        },
      ]}
    >
      <View style={styles.topRow}>
        <View>
          <Text style={[styles.cardName, { color: colors.textPrimary }]}>{display.label}</Text>
          <Text style={[styles.cardMeta, { color: colors.textSecondary }]}>
            {display.network} •••• {display.last4}
          </Text>
        </View>
        <View
          style={[
            styles.linkBadge,
            { backgroundColor: account ? colors.success + "22" : colors.grayLight },
          ]}
        >
          {account ? (
            <Link2 size={13} color={colors.success} />
          ) : (
            <Link2Off size={13} color={colors.textSecondary} />
          )}
          <Text
            style={[
              styles.linkText,
              { color: account ? colors.success : colors.textSecondary },
            ]}
          >
            {account ? "Linked" : "Not linked"}
          </Text>
        </View>
      </View>

      {account ? (
        <View style={styles.accountBlock}>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>Account</Text>
            <Text style={[styles.rowValue, { color: colors.textPrimary }]}>{account.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>Acct Number</Text>
            <Text style={[styles.rowValue, { color: colors.textPrimary }]}>
              {account.accountNumber}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>
              {account.availableBalance !== undefined ? "Available Balance" : "Balance"}
            </Text>
            <Text style={[styles.rowValueStrong, { color: colors.textPrimary }]}>
              {money(account.availableBalance ?? account.totalBalance)}
            </Text>
          </View>
        </View>
      ) : (
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          This card isn't connected to a Sallar account yet.
        </Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: {
    marginTop: 18,
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
  },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  cardName: { fontSize: 16, fontWeight: "800" },
  cardMeta: { fontSize: 12.5, marginTop: 3, fontWeight: "600" },
  linkBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  linkText: { fontSize: 11.5, fontWeight: "700" },
  accountBlock: { marginTop: 14 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  rowLabel: { fontSize: 13, fontWeight: "600" },
  rowValue: { fontSize: 13, fontWeight: "700" },
  rowValueStrong: { fontSize: 15, fontWeight: "800" },
  emptyText: { fontSize: 13, marginTop: 14, lineHeight: 19 },
});
