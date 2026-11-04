import { test } from "node:test";
import assert from "node:assert/strict";
import { parseOrderCsv, parseDiscount, applyDiscount } from "../src/index.js";

test("order rows become lines", () => {
  const lines = parseOrderCsv("sku,qty,price\nA-1,2,10.50\nB-2,1,3\n");
  assert.deepEqual(lines, [
    { sku: "A-1", qty: 2, unitCents: 1050 },
    { sku: "B-2", qty: 1, unitCents: 300 },
  ]);
});

test("a malformed row names its line", () => {
  assert.throws(() => parseOrderCsv("sku,qty,price\nA-1,x,1"), /row 2/);
});

test("percent and fixed discounts", () => {
  assert.equal(applyDiscount(2000, parseDiscount("10%")), 1800);
  assert.equal(applyDiscount(2000, parseDiscount("5")), 1500);
  assert.equal(applyDiscount(300, parseDiscount("5")), 0);
});
