// Fake recurring subscriptions for the demo wallet. `icon`/`iconColor` drive
// a simple brand-colored badge (see components/BrandBadge.js) — not a
// reproduction of any real logo artwork, same treatment as the Visa®/
// Mastercard® text labels used elsewhere in this app.
export const subscriptions = [
  {
    id: "anthropic-claude-max",
    name: "Anthropic Claude Max",
    amount: 200.0,
    cardLabel: "Commonwealth Credit Union",
    cardNetwork: "Visa® Black Strip® Plus",
    cardLast4: "6472",
    brand: "anthropic",
  },
  {
    id: "doordash-dashpass",
    name: "DoorDash DashPass",
    amount: 8.99,
    cardLabel: "Commonwealth Credit Union",
    cardNetwork: "Visa® Black Strip® Plus",
    cardLast4: "6472",
    brand: "doordash",
  },
  {
    id: "apple-music",
    name: "Apple Music Individual",
    amount: 11.99,
    cardLabel: "Other Banking Card",
    cardNetwork: "Venmo® Mastercard® Debit",
    cardLast4: "9926",
    brand: "applemusic",
  },
  {
    id: "xbox-game-pass",
    name: "Xbox Game Pass Ultimate",
    amount: 22.99,
    cardLabel: "Other Banking Card",
    cardNetwork: "Venmo® Mastercard® Debit",
    cardLast4: "9926",
    brand: "xbox",
  },
];

export function getMonthlySubscriptionTotal() {
  return subscriptions.reduce((sum, s) => sum + s.amount, 0);
}
