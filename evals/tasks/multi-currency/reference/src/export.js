import { formatCents } from "./money.js";

// One "sku,amount" row per line for the accounting system.
export function toAccountingCsv(lines, currency = "USD") {
  const rows = lines.map((line) => `${line.sku},${formatCents(line.unitCents * line.qty, currency)}`);
  return ["sku,amount", ...rows].join("\n") + "\n";
}
