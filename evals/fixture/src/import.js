import { toCents } from "./money.js";

// Parses "sku,qty,price" rows, one order line per row, with a header row first.
export function parseOrderCsv(text) {
  const rows = text.trim().split(/\r?\n/).slice(1);
  return rows
    .filter((row) => row.trim() !== "")
    .map((row, i) => {
      const [sku, qty, price] = row.split(",").map((cell) => cell.trim());
      const quantity = Number(qty);
      if (!sku || !Number.isInteger(quantity) || quantity <= 0 || price === undefined || Number.isNaN(parseFloat(price))) {
        throw new Error(`bad order row ${i + 2}: ${row}`);
      }
      return { sku, qty: quantity, unitCents: toCents(price) };
    });
}
