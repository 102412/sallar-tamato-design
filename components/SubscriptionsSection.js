import React from "react";
import { StyleSheet, Text, View } from "react-native";
import BrandBadge from "./BrandBadge";
import FadeInUp from "./FadeInUp";
import PressScale from "./PressScale";
import { useTheme } from "../context/ThemeContext";
import { subscriptions, getMonthlySubscriptionTotal } from "../data/subscriptions";

const money = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

export default function SubscriptionsSection({ baseDelay = 0, onPressItem }) {
  const { colors, shadow } = useTheme();
  const total = getMonthlySubscriptionTotal();

  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionHeader, { color: colors.textPrimary }]}>Subscriptions</Text>
        <Text style={[styles.headerTotal, { color: colors.textSecondary }]}>
          {money(total)}/mo
        </Text>
      </View>
      {subscriptions.map((s, i) => (
        <FadeInUp key={s.id} delay={baseDelay + i * 60}>
          <PressScale
            onPress={() => onPressItem && onPressItem(s)}
            scaleTo={0.98}
            style={[
              styles.row,
              shadow.soft,
              { backgroundColor: colors.surface, borderColor: colors.glassBorder },
            ]}
          >
            <BrandBadge brand={s.brand} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.name, { color: colors.textPrimary }]}>{s.name}</Text>
              <Text style={[styles.cardUsed, { color: colors.textSecondary }]}>
                {s.cardNetwork} ••{s.cardLast4}
              </Text>
            </View>
            <Text style={[styles.amount, { color: colors.textPrimary }]}>
              {money(s.amount)}
              <Text style={[styles.amountUnit, { color: colors.textSecondary }]}>/mo</Text>
            </Text>
          </PressScale>
        </FadeInUp>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginTop: 30,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionHeader: { fontSize: 15, fontWeight: "800" },
  headerTotal: { fontSize: 12.5, fontWeight: "700" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  name: { fontSize: 14, fontWeight: "700" },
  cardUsed: { fontSize: 11.5, marginTop: 3, fontWeight: "600" },
  amount: { fontSize: 15, fontWeight: "800" },
  amountUnit: { fontSize: 11, fontWeight: "600" },
});
