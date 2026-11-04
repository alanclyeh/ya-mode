import { test } from "node:test";
import assert from "node:assert/strict";
import { displayAmount, statementLine, readStatementLine, refundNote, revenueSummary } from "../src/index.js";

test("amounts display with a symbol and commas", () => {
  assert.equal(displayAmount(123456), "$1,234.56");
  assert.equal(displayAmount(-500), "-$5.00");
});

test("statement lines read back", () => {
  assert.equal(readStatementLine(statementLine("Total", 123456)), 123456);
});

test("refund notes cover the unused days", () => {
  assert.equal(refundNote(3000, 10, 30), "Refund 20.00 for 20 unused days");
});

test("revenue summary totals and averages", () => {
  const summary = revenueSummary([{ totalCents: 1000 }, { totalCents: 2001 }]);
  assert.deepEqual(summary, { count: 2, total: "30.01", average: "15.01" });
});
