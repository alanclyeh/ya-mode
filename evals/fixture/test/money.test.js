import { test } from "node:test";
import assert from "node:assert/strict";
import { toCents, formatCents } from "../src/index.js";

test("whole and half amounts convert to cents", () => {
  assert.equal(toCents("10"), 1000);
  assert.equal(toCents("2.50"), 250);
});

test("cents format with two decimals and a sign", () => {
  assert.equal(formatCents(1999), "19.99");
  assert.equal(formatCents(5), "0.05");
  assert.equal(formatCents(-250), "-2.50");
});
