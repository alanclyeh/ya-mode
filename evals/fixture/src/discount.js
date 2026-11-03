import { toCents } from "./money.js";

// "10%" is a percentage off, "4.35" is a fixed amount off.
export function parseDiscount(code) {
  const text = code.trim();
  if (text.endsWith("%")) {
    const percent = Number(text.slice(0, -1));
    if (!(percent > 0 && percent <= 100)) throw new Error(`bad discount: ${code}`);
    return { kind: "percent", percent };
  }
  if (Number.isNaN(parseFloat(text))) throw new Error(`bad discount: ${code}`);
  return { kind: "fixed", cents: toCents(text) };
}

export function applyDiscount(totalCents, discount) {
  const off = discount.kind === "percent" ? Math.round((totalCents * discount.percent) / 100) : discount.cents;
  return Math.max(0, totalCents - off);
}
