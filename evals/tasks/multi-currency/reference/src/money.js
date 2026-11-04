import { currencyInfo } from "./currency.js";

export function toCents(amount, currency = "USD") {
  const { decimals } = currencyInfo(currency);
  const match = /^(-?)(\d*)(?:\.(\d*))?$/.exec(String(amount).trim());
  if (!match || (match[2] === "" && !match[3])) throw new Error(`bad amount: ${amount}`);
  const [, sign, whole, fraction = ""] = match;
  if (fraction.length > decimals) throw new Error(`too many decimals for ${currency}: ${amount}`);
  const minor = Number(whole + fraction.padEnd(decimals, "0"));
  return sign && minor !== 0 ? -minor : minor;
}

export function formatCents(cents, currency = "USD") {
  const { decimals } = currencyInfo(currency);
  const sign = cents < 0 ? "-" : "";
  const digits = String(Math.abs(cents)).padStart(decimals + 1, "0");
  if (decimals === 0) return sign + digits;
  return `${sign}${digits.slice(0, -decimals)}.${digits.slice(-decimals)}`;
}
