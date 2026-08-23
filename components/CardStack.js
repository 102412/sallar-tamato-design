import React, { useRef } from "react";
import { Animated, Image, Pressable, StyleSheet, View } from "react-native";

const CARD_HEIGHT = 210;
const PEEK_COLLAPSED = 16; // resting peek per stacked card
const PEEK_EXPANDED = 72; // peek once fully scrolled/pulled open
const EXTRA_PAD = 10;

// Apple-Wallet-style stacked deck. At rest the active card sits full-size
// up front with the others peeking a little behind it; scrolling down over
// the stack (wheel, trackpad, or a touch drag) pulls it open, spreading the
// back cards apart so more of each is visible — the actual scroll logic
// that reveals the next cards, not just a static sliver. Tapping a card
// once it's visible brings it to the front; tapping the front card opens
// its dedicated page.
export default function CardStack({ cards, activeIndex, onChangeIndex, onPressCard }) {
  const backCount = Math.max(0, cards.length - 1);
  const extraRange = backCount * (PEEK_EXPANDED - PEEK_COLLAPSED);
  const visibleHeight = CARD_HEIGHT + backCount * PEEK_COLLAPSED + EXTRA_PAD;

  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <View style={[styles.wrap, { height: visibleHeight }]}>
      <Animated.ScrollView
        style={{ height: visibleHeight }}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
      >
        <View style={{ height: visibleHeight + extraRange, position: "relative" }}>
          {cards.map((card, i) => {
            const isActive = i === activeIndex;
            const backRank = isActive ? 0 : i < activeIndex ? i : i - 1;
            return (
              <StackCard
                key={card.id}
                card={card}
                isActive={isActive}
                backRank={backRank}
                scrollY={scrollY}
                extraRange={extraRange || 1}
                onPress={() => (isActive ? onPressCard?.(card) : onChangeIndex(i))}
              />
            );
          })}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

function StackCard({ card, isActive, backRank, scrollY, extraRange, onPress }) {
  const [pressed, setPressed] = React.useState(false);

  // Cards are real children of the scrolling content, so they'd otherwise
  // scroll away with it. Adding scrollY back cancels that natural
  // follow-through for the active card (pins it in place) and, for back
  // cards, layers a growing spread on top of it (revealing more of each as
  // the stack is scrolled open) — both from one continuous `scrollY` value,
  // no custom snap/settle logic needed since the ScrollView's own content
  // bounds already clamp it between fully closed and fully open.
  const desiredOffset = isActive
    ? new Animated.Value(0)
    : scrollY.interpolate({
        inputRange: [0, extraRange],
        outputRange: [(backRank + 1) * PEEK_COLLAPSED, (backRank + 1) * PEEK_EXPANDED],
        extrapolate: "clamp",
      });
  const translateY = Animated.add(scrollY, desiredOffset);

  const scale = isActive
    ? 1
    : scrollY.interpolate({
        inputRange: [0, extraRange],
        outputRange: [
          1 - Math.min(backRank + 1, 3) * 0.035,
          1 - Math.min(backRank + 1, 3) * 0.012,
        ],
        extrapolate: "clamp",
      });
  const opacity = isActive
    ? 1
    : scrollY.interpolate({
        inputRange: [0, extraRange],
        outputRange: [
          1 - Math.min(backRank + 1, 3) * 0.16,
          1 - Math.min(backRank + 1, 3) * 0.05,
        ],
        extrapolate: "clamp",
      });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[styles.cardSlot, { zIndex: isActive ? 100 : 50 - backRank }]}
    >
      <Animated.View
        style={[
          styles.cardOuter,
          {
            opacity,
            transform: [
              { translateY },
              { scale: pressed ? Animated.multiply(scale, 0.98) : scale },
            ],
          },
        ]}
      >
        <Image source={card.image} style={styles.cardImg} resizeMode="contain" />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 24, position: "relative", overflow: "visible" },
  cardSlot: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  cardOuter: {
    width: "100%",
    maxWidth: 420,
    height: CARD_HEIGHT,
  },
  cardImg: { width: "100%", height: "100%" },
});
