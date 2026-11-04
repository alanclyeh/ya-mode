import { formatCents } from "./money.js";

// Receipts repeat the same few prices, so each one is formatted once.
const priceText = new Map();

function price(cents) {
  if (!priceText.has(cents)) priceText.set(cents, formatCents(cents));
  return priceText.get(cents);
}

export function receiptLine(line) {
  return `${line.sku.padEnd(8)} ${String(line.qty).padStart(3)} x ${price(line.unitCents).padStart(10)}`;
}

export function receipt(lines) {
  const total = lines.reduce((sum, line) => sum + line.unitCents * line.qty, 0);
  return [...lines.map((line) => receiptLine(line)), `TOTAL ${price(total)}`].join("\n");
}
