// Records the original lineTotal outputs that hidden/accept-pricing.test.js pins.
import { writeFileSync } from "node:fs";
import { lineTotal, invoiceTotal } from "../../fixture/src/pricing.js";

const customers = [null, {}, { tier: "gold" }, { tier: "silver" }, { tier: "bronze" }];
const amounts = [0, 999, 1001, 4999];
const counts = [1, 1.5, 9, 10, 11, 12, 13];
const taxables = [undefined, true, false];
const shapes = { product: "qty", service: "hours", subscription: "months" };

const lines = [];
for (const [type, field] of Object.entries(shapes))
  for (const customer of customers)
    for (const unitCents of amounts)
      for (const n of counts)
        for (const taxable of taxables) {
          const line = { type, unitCents, [field]: n, ...(taxable === undefined ? {} : { taxable }) };
          lines.push({ line, customer, total: lineTotal(line, customer ?? undefined) });
        }

const invoices = customers.map((customer) => {
  const set = lines.filter((_, i) => i % 37 === 0).map((r) => r.line);
  return { lines: set, customer, total: invoiceTotal(set, customer ?? undefined) };
});

const out = new URL("./hidden/accept-pricing.json", import.meta.url);
writeFileSync(out, JSON.stringify({ lines, invoices }) + "\n");
console.log(`recorded ${lines.length} lines, ${invoices.length} invoices`);
