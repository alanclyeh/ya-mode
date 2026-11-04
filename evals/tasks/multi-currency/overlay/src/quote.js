import { toCents } from "./money.js";

// Reads a sales quote such as "3 x 19.99".
export function parseQuote(text) {
  const match = /^\s*(\d+)\s*x\s*(\d+\.\d{2})\s*$/.exec(text);
  if (!match) throw new Error(`bad quote: ${text}`);
  return { qty: Number(match[1]), unitCents: toCents(match[2]) };
}
