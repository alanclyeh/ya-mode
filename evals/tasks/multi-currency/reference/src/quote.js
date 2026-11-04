import { currencyInfo } from "./currency.js";
import { toCents } from "./money.js";

// Reads a sales quote such as "3 x 19.99".
export function parseQuote(text, currency = "USD") {
  const { decimals } = currencyInfo(currency);
  const amount = decimals === 0 ? "\\d+" : `\\d+\\.\\d{${decimals}}`;
  const match = new RegExp(`^\\s*(\\d+)\\s*x\\s*(${amount})\\s*$`).exec(text);
  if (!match) throw new Error(`bad quote: ${text}`);
  return { qty: Number(match[1]), unitCents: toCents(match[2], currency) };
}
