import React, { useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { ChevronLeft, Wifi, CheckCircle2, Link2, Link2Off } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";
import { radius } from "../data/theme";
import { carouselCards, getAccountById } from "../data/accounts";
import NfcPulse from "../components/NfcPulse";
import FadeInUp from "../components/FadeInUp";
import PressScale from "../components/PressScale";

const money = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

function showDemo(msg = "Demo mode — not a real action") {
  if (Platform.OS === "android") {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Alert.alert("Demo mode", msg);
  }
}

export default function CardPayScreen({ route, navigation }) {
  const { colors, shadow } = useTheme();
  const styles = useMemo(() => makeStyles(colors, shadow), [colors, shadow]);
  const card = carouselCards.find((c) => c.id === route.params?.cardId) || carouselCards[0];
  const account = card.accountId ? getAccountById(card.accountId) : null;

  const [payState, setPayState] = useState("ready"); // ready | processing | approved
  const payStateRef = useRef("ready");
  const flash = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;

  const setPay = (next) => {
    payStateRef.current = next;
    setPayState(next);
  };

  const handleTapToPay = () => {
    // Guard against duplicate press events (e.g. a device firing both
    // pointer and mouse events for one tap) with a synchronous ref instead
    // of the React state closure, which can be stale within the same tick.
    if (payStateRef.current !== "ready") return;

    // State transitions run on their own timers, independent of whether the
    // accompanying Animated.timing calls actually complete — an animation
    // that gets interrupted, throttled (e.g. a backgrounded tab), or never
    // resolves its native/JS driver shouldn't be able to strand the flow.
    setPay("processing");
    flash.setValue(0);
    Animated.timing(flash, { toValue: 1, duration: 220, useNativeDriver: true }).start();

    setTimeout(() => {
      setPay("approved");
      checkScale.setValue(0);
      Animated.spring(checkScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 18,
        bounciness: 10,
      }).start();

      setTimeout(() => {
        Animated.timing(flash, { toValue: 0, duration: 250, useNativeDriver: true }).start();
        setTimeout(() => setPay("ready"), 350);
      }, 1400);
    }, 220);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <FadeInUp delay={0} duration={350}>
          <View style={styles.topBar}>
            <PressScale onPress={() => navigation.goBack()} style={styles.backBtn} scaleTo={0.88} hitSlop={10}>
              <ChevronLeft size={20} color={colors.textPrimary} />
            </PressScale>
            <Text style={styles.topBarTitle}>{card.label}</Text>
            <View style={{ width: 38 }} />
          </View>
        </FadeInUp>

        <FadeInUp delay={100} duration={450} fromScale={0.94}>
          <View style={styles.cardWrap}>
            <Image source={card.image} style={styles.cardImg} resizeMode="contain" />
          </View>
        </FadeInUp>

        <FadeInUp delay={220}>
          <Text style={styles.cardMeta}>
            {card.network} •••• {card.last4}
          </Text>
        </FadeInUp>

        {/* Tap to pay emulation */}
        <FadeInUp delay={300} duration={500}>
          <Pressable onPress={handleTapToPay} style={styles.payZone}>
            <View style={styles.pulseWrap}>
              <NfcPulse color={colors.blue} size={200} active={payState === "ready"} />
              <Animated.View
                style={[
                  styles.centerIcon,
                  {
                    opacity: flash.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
                  },
                ]}
              >
                <Wifi size={40} color="#FFFFFF" />
              </Animated.View>
              {payState === "approved" && (
                <Animated.View
                  style={[
                    styles.centerIcon,
                    { transform: [{ scale: checkScale }] },
                  ]}
                >
                  <CheckCircle2 size={48} color="#FFFFFF" />
                </Animated.View>
              )}
            </View>
            <Text style={styles.payLabel}>
              {payState === "ready" && "Hold Near Reader"}
              {payState === "processing" && "Processing…"}
              {payState === "approved" && "Payment Approved"}
            </Text>
            <Text style={styles.payHint}>
              {payState === "approved" ? "Demo mode — no real charge" : "Tap this card to simulate a contactless payment"}
            </Text>
          </Pressable>
        </FadeInUp>

        {/* Linked account detail */}
        <FadeInUp delay={420}>
          <View style={styles.detailPanel}>
            <View style={styles.linkRow}>
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
              <View>
                <Row label="Account" value={account.name} styles={styles} />
                <Row label="Acct Number" value={account.accountNumber} styles={styles} />
                <Row
                  label={account.availableBalance !== undefined ? "Available Balance" : "Balance"}
                  value={money(account.availableBalance ?? account.totalBalance)}
                  strong
                  styles={styles}
                />
              </View>
            ) : (
              <Text style={styles.emptyText}>
                This card isn't connected to a Sallar account yet.
              </Text>
            )}
          </View>
        </FadeInUp>

        <FadeInUp delay={480}>
          <View style={styles.actionsRow}>
            <ActionChip label="Freeze Card" styles={styles} onPress={() => showDemo("Card frozen — demo mode")} />
            <ActionChip label="Set Limit" styles={styles} onPress={() => showDemo("Spend limits — demo mode")} />
            <ActionChip label="View PIN" styles={styles} onPress={() => showDemo("PIN reveal — demo mode")} />
          </View>
        </FadeInUp>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value, strong, styles }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={strong ? styles.rowValueStrong : styles.rowValue}>{value}</Text>
    </View>
  );
}

function ActionChip({ label, styles, onPress }) {
  return (
    <PressScale onPress={onPress} scaleTo={0.95} style={styles.actionChip}>
      <Text style={styles.actionChipText}>{label}</Text>
    </PressScale>
  );
}

const makeStyles = (colors, shadow) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    scroll: { padding: 20, paddingBottom: 48 },
    topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    backBtn: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      alignItems: "center",
      justifyContent: "center",
    },
    topBarTitle: { fontSize: 15, fontWeight: "800", color: colors.textPrimary },
    cardWrap: { marginTop: 22, alignItems: "center", justifyContent: "center" },
    cardImg: { width: "100%", maxWidth: 420, height: 260 },
    cardMeta: {
      textAlign: "center",
      marginTop: 10,
      fontSize: 13,
      fontWeight: "700",
      color: colors.textSecondary,
    },
    payZone: {
      marginTop: 30,
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      paddingVertical: 28,
      ...shadow.soft,
    },
    pulseWrap: { alignItems: "center", justifyContent: "center" },
    centerIcon: {
      position: "absolute",
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.blue,
      alignItems: "center",
      justifyContent: "center",
    },
    payLabel: { marginTop: 16, fontSize: 16, fontWeight: "800", color: colors.textPrimary },
    payHint: { marginTop: 4, fontSize: 12, color: colors.textSecondary },
    detailPanel: {
      marginTop: 20,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      padding: 18,
    },
    linkRow: { flexDirection: "row", justifyContent: "flex-end" },
    linkBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 999,
    },
    linkText: { fontSize: 11.5, fontWeight: "700" },
    row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
    rowLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: "600" },
    rowValue: { fontSize: 13, color: colors.textPrimary, fontWeight: "700" },
    rowValueStrong: { fontSize: 16, color: colors.textPrimary, fontWeight: "800" },
    emptyText: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
    actionsRow: { flexDirection: "row", gap: 10, marginTop: 16 },
    actionChip: {
      flex: 1,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      borderRadius: radius.md,
      paddingVertical: 12,
      alignItems: "center",
    },
    actionChipText: { fontSize: 12.5, fontWeight: "700", color: colors.textPrimary },
  });
