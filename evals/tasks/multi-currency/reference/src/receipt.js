import { formatCents } from "./money.js";

export function receiptLine(line, currency = "USD") {
  return `${line.sku.padEnd(8)} ${String(line.qty).padStart(3)} x ${formatCents(line.unitCents, currency).padStart(10)}`;
}

export function receipt(lines, currency = "USD") {
  const total = lines.reduce((sum, line) => sum + line.unitCents * line.qty, 0);
  return [...lines.map((line) => receiptLine(line, currency)), `TOTAL ${formatCents(total, currency)}`].join("\n");
}
