import { test } from "node:test";
import assert from "node:assert/strict";
import { lineTotal, invoiceTotal } from "../src/index.js";

test("a plain product line is taxed", () => {
  assert.equal(lineTotal({ type: "product", unitCents: 1000, qty: 2 }), 2160);
});

test("gold customers get ten percent off products", () => {
  assert.equal(lineTotal({ type: "product", unitCents: 1000, qty: 1, taxable: false }, { tier: "gold" }), 900);
});

test("invoice sums its lines", () => {
  const lines = [
    { type: "product", unitCents: 1000, qty: 1, taxable: false },
    { type: "service", unitCents: 5000, hours: 2 },
  ];
  assert.equal(invoiceTotal(lines), 11000);
});
