import { currencyInfo } from "./currency.js";
import { formatCents, toCents } from "./money.js";

const withCommas = (text) => text.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export function displayAmount(cents, currency = "USD") {
  const { symbol } = currencyInfo(currency);
  const sign = cents < 0 ? "-" : "";
  const [whole, fraction] = formatCents(Math.abs(cents), currency).split(".");
  return `${sign}${symbol}${withCommas(whole)}${fraction ? `.${fraction}` : ""}`;
}

export function statementLine(label, cents, currency = "USD") {
  return `${label}: ${displayAmount(cents, currency)}`;
}

// Reads the amount back from a line statementLine wrote.
export function readStatementLine(text, currency = "USD") {
  const { symbol } = currencyInfo(currency);
  const amount = text.slice(text.lastIndexOf(": ") + 2).replace(symbol, "").replaceAll(",", "");
  return toCents(amount, currency);
}
