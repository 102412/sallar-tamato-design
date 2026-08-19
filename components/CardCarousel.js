import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

// RN Web's useWindowDimensions/Dimensions.get can report 0 on first paint
// in this Metro-web build, which would make card sizing negative and crash
// Animated.interpolate. Read straight from the DOM window on web, with a
// safe fallback everywhere else, and keep it live on resize.
function useSafeWindowWidth() {
  const getWidth = () => {
    if (typeof window !== "undefined" && window.innerWidth > 0) return window.innerWidth;
    const d = Dimensions.get("window").width;
    return d > 0 ? d : 375;
  };
  const [width, setWidth] = useState(getWidth);

  useEffect(() => {
    const onResize = () => setWidth(getWidth());
    if (typeof window !== "undefined" && window.addEventListener) {
      window.addEventListener("resize", onResize);
    }
    const sub = Dimensions.addEventListener?.("change", onResize);
    // Re-check shortly after mount in case the window wasn't ready yet.
    const t = setTimeout(onResize, 50);
    return () => {
      if (typeof window !== "undefined" && window.removeEventListener) {
        window.removeEventListener("resize", onResize);
      }
      sub?.remove?.();
      clearTimeout(t);
    };
  }, []);

  return width;
}

const CARD_HEIGHT = 340;
const SPACING = 18;

// Horizontal, snapping, staggered card stack. Adjacent cards peek in and
// scale/fade based on scroll distance from center. A tap opens that card's
// dedicated page (via onPressCard); the scroll gesture alone drives which
// card is "active" for the preview panel underneath.
//
// Sizing is derived from useWindowDimensions (not Dimensions.get at module
// scope) — on web the module can evaluate before the window has a real
// width, which would otherwise make these values 0/negative and crash
// Animated.interpolate with a non-monotonic inputRange.
export default function CardCarousel({ cards, activeIndex, initialIndex = 0, onChangeIndex, onPressCard }) {
  const { colors } = useTheme();
  const screenWidth = useSafeWindowWidth();

  const { cardWidth, itemSize, sideInset } = useMemo(() => {
    const width = Math.max(240, Math.min(screenWidth - 40, 420));
    return {
      cardWidth: width,
      itemSize: width + SPACING,
      sideInset: (screenWidth - width) / 2,
    };
  }, [screenWidth]);

  const scrollX = useRef(new Animated.Value(initialIndex * itemSize)).current;
  const listRef = useRef(null);
  const [pressedId, setPressedId] = useState(null);

  const snapToIndex = (index, animated = true) => {
    const clamped = Math.max(0, Math.min(cards.length - 1, index));
    listRef.current?.scrollTo({ x: clamped * itemSize, animated });
    if (clamped !== activeIndex) onChangeIndex(clamped);
  };

  // Center on the requested starting card after mount. Neither `onLayout`
  // nor `requestAnimationFrame` fire reliably for this in every RN Web
  // environment (onLayout can simply never call back on Animated.ScrollView;
  // rAF is throttled/paused in backgrounded or non-compositing tabs), so
  // this uses plain timers, re-asserting a couple of times since the very
  // first imperative scrollTo can silently no-op before layout has settled.
  useEffect(() => {
    const target = initialIndex * itemSize;
    const timers = [0, 80, 250].map((delay) =>
      setTimeout(() => listRef.current?.scrollTo({ x: target, animated: false }), delay)
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nearestIndexFor = (x) => Math.max(0, Math.min(cards.length - 1, Math.round(x / itemSize)));

  const handleMomentumEnd = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    snapToIndex(nearestIndexFor(x));
  };

  const handleScrollEndDrag = (e) => {
    // Fallback for platforms/gestures (e.g. trackpad flicks on web) that
    // don't reliably fire onMomentumScrollEnd — re-snap to the nearest card.
    const x = e.nativeEvent.contentOffset.x;
    snapToIndex(nearestIndexFor(x));
  };

  return (
    <View style={styles.wrap}>
      <Animated.ScrollView
        ref={listRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemSize}
        snapToAlignment="start"
        decelerationRate="fast"
        contentOffset={{ x: initialIndex * itemSize, y: 0 }}
        contentContainerStyle={{ paddingHorizontal: sideInset }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumEnd}
        onScrollEndDrag={handleScrollEndDrag}
      >
        {cards.map((card, i) => {
          const inputRange = [(i - 1) * itemSize, i * itemSize, (i + 1) * itemSize];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.86, 1, 0.86],
            extrapolate: "clamp",
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5],
            extrapolate: "clamp",
          });
          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [16, 0, 16],
            extrapolate: "clamp",
          });
          const rotate = scrollX.interpolate({
            inputRange,
            outputRange: ["6deg", "0deg", "-6deg"],
            extrapolate: "clamp",
          });

          return (
            <Pressable
              key={card.id}
              onPress={() => onPressCard && onPressCard(card)}
              onPressIn={() => setPressedId(card.id)}
              onPressOut={() => setPressedId(null)}
              style={{ width: itemSize, alignItems: "center" }}
            >
              <Animated.View
                style={[
                  styles.cardOuter,
                  {
                    width: cardWidth,
                    height: CARD_HEIGHT,
                    opacity,
                    transform: [
                      { scale: pressedId === card.id ? Animated.multiply(scale, 0.97) : scale },
                      { translateY },
                      { rotate },
                    ],
                  },
                ]}
              >
                <Image source={card.image} style={styles.cardImg} resizeMode="contain" />
              </Animated.View>
            </Pressable>
          );
        })}
      </Animated.ScrollView>

      {/* Dot indicators — tapping one snaps that card into focus */}
      <View style={styles.dots}>
        {cards.map((c, i) => {
          const inputRange = [(i - 1) * itemSize, i * itemSize, (i + 1) * itemSize];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [6, 20, 6],
            extrapolate: "clamp",
          });
          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.35, 1, 0.35],
            extrapolate: "clamp",
          });
          return (
            <Pressable key={c.id} onPress={() => snapToIndex(i)} hitSlop={6}>
              <Animated.View
                style={{
                  width: dotWidth,
                  height: 6,
                  borderRadius: 3,
                  marginHorizontal: 3,
                  backgroundColor: colors.navy,
                  opacity: dotOpacity,
                }}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 24 },
  cardOuter: { alignItems: "center", justifyContent: "center" },
  cardImg: { width: "100%", height: "100%" },
  dots: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 14 },
});
