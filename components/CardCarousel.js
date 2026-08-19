import React, { useRef, useState } from "react";
import { Animated, Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = Math.min(SCREEN_WIDTH - 40, 420);
const CARD_HEIGHT = 340;
const SPACING = 18;
const ITEM_SIZE = CARD_WIDTH + SPACING;
const SIDE_INSET = (SCREEN_WIDTH - CARD_WIDTH) / 2;

// Horizontal, snapping, staggered card stack. Adjacent cards peek in and
// scale/fade based on scroll distance from center — the "alive" feel comes
// from every frame of the scroll driving the transform, not a fixed layout.
export default function CardCarousel({ cards, activeIndex, onChangeIndex }) {
  const { colors, shadow } = useTheme();
  const scrollX = useRef(new Animated.Value(0)).current;
  const listRef = useRef(null);
  const [pressedId, setPressedId] = useState(null);

  const handleMomentumEnd = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / ITEM_SIZE);
    const clamped = Math.max(0, Math.min(cards.length - 1, index));
    if (clamped !== activeIndex) onChangeIndex(clamped);
  };

  const scrollToIndex = (index) => {
    listRef.current?.scrollTo({ x: index * ITEM_SIZE, animated: true });
    onChangeIndex(index);
  };

  return (
    <View style={styles.wrap}>
      <Animated.ScrollView
        ref={listRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_SIZE}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: SIDE_INSET }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumEnd}
      >
        {cards.map((card, i) => {
          const inputRange = [(i - 1) * ITEM_SIZE, i * ITEM_SIZE, (i + 1) * ITEM_SIZE];
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
              onPress={() => scrollToIndex(i)}
              onPressIn={() => setPressedId(card.id)}
              onPressOut={() => setPressedId(null)}
              style={{ width: ITEM_SIZE, alignItems: "center" }}
            >
              <Animated.View
                style={[
                  styles.cardOuter,
                  {
                    width: CARD_WIDTH,
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

      {/* Dot indicators */}
      <View style={styles.dots}>
        {cards.map((c, i) => {
          const inputRange = [(i - 1) * ITEM_SIZE, i * ITEM_SIZE, (i + 1) * ITEM_SIZE];
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
            <Animated.View
              key={c.id}
              style={{
                width: dotWidth,
                height: 6,
                borderRadius: 3,
                marginHorizontal: 3,
                backgroundColor: colors.navy,
                opacity: dotOpacity,
              }}
            />
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
