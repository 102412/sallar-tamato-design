export const user = {
  name: "Ryland K Ritchie",
  email: "Rylandritchie12@gmail.com",
};

export const accounts = [
  {
    id: "checking",
    name: "Rylands Checking",
    accountNumber: "3476********",
    availableBalance: 3387.98,
    totalBalance: 3487.98,
    linkedCards: ["sallar-visa", "amex-platinum"],
  },
  {
    id: "savings",
    name: "Rylands Savings",
    accountNumber: "3498********",
    totalBalance: 1276.76,
    linkedCards: [],
  },
];

export const otherAccounts = [
  {
    id: "robinhood",
    name: "Robinhood® Ultimate Investors",
    accountNumber: "3365********",
    totalBalance: 549.73,
  },
];

// Cards shown in the interactive stacked carousel at the top of the wallet.
// Each entry may link to an account in `accounts` via accountId, or null
// if it isn't connected to any Sallar account yet.
export const carouselCards = [
  {
    id: "sallar-visa",
    label: "Sallar Visa",
    network: "Visa®",
    last4: "6269",
    image: require("../assets/sallar_top_card.png"),
    accountId: "checking",
  },
  {
    id: "amex-platinum",
    label: "Amex Platinum Plus",
    network: "American Express®",
    last4: "4395",
    image: require("../assets/amex_platinum.png"),
    accountId: "checking",
  },
  {
    id: "venmo-mastercard",
    label: "Venmo Mastercard Debit",
    network: "Mastercard®",
    last4: "9926",
    image: require("../assets/venmo_mastercard.png"),
    accountId: null,
  },
];

// Cards shown as simple chips further down the wallet (credit card +
// other banking debit card, not primary Sallar-issued cards).
export const cards = [
  {
    id: "ccu-visa",
    label: "Commonwealth Credit Union",
    network: "Visa® Black Strip® Plus",
    last4: "6472",
    type: "credit",
  },
  {
    id: "venmo-debit",
    label: "Other Banking Card",
    network: "Venmo® Mastercard® Debit",
    last4: "9926",
    type: "debit",
  },
];

// Grand total across all accounts (Sallar + linked third-party accounts)
export function getTotalBalance() {
  const sallarTotal = accounts.reduce((sum, a) => sum + a.totalBalance, 0);
  const otherTotal = otherAccounts.reduce((sum, a) => sum + a.totalBalance, 0);
  return sallarTotal + otherTotal;
}

export function getAccountById(id) {
  return accounts.find((a) => a.id === id) || null;
}
