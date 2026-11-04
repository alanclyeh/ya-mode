const CURRENCIES = {
  USD: { decimals: 2, symbol: "$", freeOver: 5000, shipping: 500 },
  JPY: { decimals: 0, symbol: "¥", freeOver: 7000, shipping: 700 },
  KWD: { decimals: 3, symbol: "KD ", freeOver: 15000, shipping: 1500 },
};

export function currencyInfo(currency) {
  const info = Object.hasOwn(CURRENCIES, currency) ? CURRENCIES[currency] : null;
  if (!info) throw new Error(`unsupported currency: ${currency}`);
  return info;
}
