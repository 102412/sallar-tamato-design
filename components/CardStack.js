import React, { useEffect, useRef } from "react";
import { Animated, Image, Pressable, StyleSheet, View } from "react-native";

const CARD_HEIGHT = 210;
const PEEK = 16; // vertical reveal per card stacked behind the front one

// Apple-Wallet-style stacked deck: the active card sits full-size up front;
// the rest fan out behind it in their original order, each peeking out a
// little further below. Tapping the front card opens its dedicated page
// (onPressCard); tapping a card peeking out from behind brings it to the
// front (onChangeIndex) — no scrolling involved, so none of the width/
// snap-timing issues a horizontal carousel runs into on web apply here.
export default function CardStack({ cards, activeIndex, onChangeIndex, onPressCard }) {
  const stackHeight = CARD_HEIGHT + (cards.length - 1) * PEEK + 6;

  return (
    <View style={[styles.wrap, { height: stackHeight }]}>
      {cards.map((card, i) => {
        const isActive = i === activeIndex;
        const backRank = i < activeIndex ? i : i - 1; // 0-based rank among the back cards, in original order
        return (
          <StackCard
            key={card.id}
            card={card}
            isActive={isActive}
            backRank={isActive ? 0 : backRank}
            onPress={() => (isActive ? onPressCard?.(card) : onChangeIndex(i))}
          />
        );
      })}
    </View>
  );
}

function StackCard({ card, isActive, backRank, onPress }) {
  const anim = useRef(new Animated.Value(isActive ? 0 : 1)).current;
  const [pressed, setPressed] = React.useState(false);

  useEffect(() => {
    Animated.spring(anim, {
      toValue: isActive ? 0 : 1,
      useNativeDriver: true,
      speed: 16,
      bounciness: 7,
    }).start();
  }, [isActive, anim]);

  const backTranslateY = (backRank + 1) * PEEK;
  const backScale = 1 - Math.min(backRank + 1, 3) * 0.035;
  const backOpacity = 1 - Math.min(backRank + 1, 3) * 0.16;

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, backTranslateY] });
  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, backScale] });
  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [1, backOpacity] });

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
  wrap: { marginTop: 24, position: "relative" },
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
