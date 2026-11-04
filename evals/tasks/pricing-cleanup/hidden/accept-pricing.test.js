import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { lineTotal, invoiceTotal } from "../src/index.js";

const expected = JSON.parse(readFileSync(new URL("./accept-pricing.json", import.meta.url), "utf8"));

test("every recorded line prices as before", () => {
  for (const { line, customer, total } of expected.lines) {
    assert.equal(lineTotal(line, customer ?? undefined), total, JSON.stringify({ line, customer }));
  }
});

test("invoices total as before", () => {
  for (const { lines, customer, total } of expected.invoices) {
    assert.equal(invoiceTotal(lines, customer ?? undefined), total);
  }
});

test("unknown line types still throw", () => {
  assert.throws(() => lineTotal({ type: "bundle", unitCents: 100, qty: 1 }), /unknown line type/);
});
