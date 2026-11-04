import { test } from "node:test";
import assert from "node:assert/strict";
import { parseQuote, shippingFee, receipt, toAccountingCsv } from "../src/index.js";

test("quotes read quantity and price", () => {
  assert.deepEqual(parseQuote("3 x 10.50"), { qty: 3, unitCents: 1050 });
  assert.throws(() => parseQuote("3 x 10"), /bad quote/);
});

test("orders at the threshold ship free", () => {
  assert.equal(shippingFee(4999), 500);
  assert.equal(shippingFee(5000), 0);
});

test("a receipt lists lines and a total", () => {
  const text = receipt([{ sku: "A-1", qty: 2, unitCents: 1050 }]);
  assert.equal(text, "A-1        2 x      10.50\nTOTAL 21.00");
});

test("accounting rows carry the line amount", () => {
  assert.equal(toAccountingCsv([{ sku: "A-1", qty: 2, unitCents: 1050 }]), "sku,amount\nA-1,21.00\n");
});
