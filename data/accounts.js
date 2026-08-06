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
    linkedCard: "Sallar Visa ****6269",
  },
  {
    id: "savings",
    name: "Rylands Savings",
    accountNumber: "3498********",
    totalBalance: 1276.76,
    linkedCard: null,
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
