import { test } from "node:test";
import assert from "node:assert/strict";
import { toCents, parseOrderCsv, parseDiscount } from "../src/index.js";

const cases = { "19.99": 1999, "0.29": 29, "4.35": 435, "1.15": 115, "0.07": 7, "100": 10000, " 2.50 ": 250, "-19.99": -1999 };

test("amounts convert to exact cents", () => {
  for (const [text, cents] of Object.entries(cases)) assert.equal(toCents(text), cents, text);
});

test("imported unit prices keep every cent", () => {
  const lines = parseOrderCsv("sku,qty,price\nA-1,1,19.99\nB-2,3,0.29\n");
  assert.deepEqual(lines.map((l) => l.unitCents), [1999, 29]);
});

test("fixed discount codes keep every cent", () => {
  assert.deepEqual(parseDiscount("4.35"), { kind: "fixed", cents: 435 });
  assert.deepEqual(parseDiscount("1.15"), { kind: "fixed", cents: 115 });
});
