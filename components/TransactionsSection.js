import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Clock } from "lucide-react-native";
import BrandBadge from "./BrandBadge";
import FadeInUp from "./FadeInUp";
import PressScale from "./PressScale";
import { useTheme } from "../context/ThemeContext";
import { transactions } from "../data/transactions";

const money = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

export default function TransactionsSection({ baseDelay = 0, onPressItem }) {
  const { colors, shadow } = useTheme();

  return (
    <View>
      <Text style={[styles.sectionHeader, { color: colors.textPrimary }]}>
        Recent Transactions
      </Text>
      {transactions.map((t, i) => {
        const positive = t.direction === "in";
        return (
          <FadeInUp key={t.id} delay={baseDelay + i * 60}>
            <PressScale
              onPress={() => onPressItem && onPressItem(t)}
              scaleTo={0.98}
              style={[
                styles.row,
                shadow.soft,
                { backgroundColor: colors.surface, borderColor: colors.glassBorder },
              ]}
            >
              <BrandBadge brand={t.brand} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.merchant, { color: colors.textPrimary }]}>
                  {t.merchant}
                </Text>
                <View style={styles.metaRow}>
                  {t.status === "pending" ? (
                    <View style={styles.pendingWrap}>
                      <Clock size={11} color={colors.gold} />
                      <Text style={[styles.pendingText, { color: colors.gold }]}>
                        {t.subtitle || "Pending"}
                      </Text>
                    </View>
                  ) : (
                    <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                      {t.dateLabel} @ {t.timeLabel}
                    </Text>
                  )}
                </View>
              </View>
              <Text
                style={[
                  styles.amount,
                  { color: positive ? colors.positive : colors.textPrimary },
                ]}
              >
                {positive ? "+" : "-"}
                {money(t.amount)}
              </Text>
            </PressScale>
          </FadeInUp>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 15,
    fontWeight: "800",
    marginTop: 30,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  merchant: { fontSize: 14, fontWeight: "700" },
  metaRow: { marginTop: 3 },
  dateText: { fontSize: 11.5, fontWeight: "600" },
  pendingWrap: { flexDirection: "row", alignItems: "center", gap: 4 },
  pendingText: { fontSize: 11.5, fontWeight: "700" },
  amount: { fontSize: 15, fontWeight: "800" },
});
