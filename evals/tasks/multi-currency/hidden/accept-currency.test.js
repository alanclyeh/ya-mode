import { test } from "node:test";
import assert from "node:assert/strict";
import * as kit from "../src/index.js";

const {
  toCents, formatCents, parseOrderCsv, parseDiscount, parseQuote, shippingFee, receiptLine, receipt,
  toAccountingCsv, displayAmount, statementLine, readStatementLine, refundNote, revenueSummary,
} = kit;

test("USD parsing has no float error", () => {
  for (const [text, cents] of [["19.99", 1999], ["0.29", 29], ["4.35", 435], ["2.5", 250], [" 2.50 ", 250], ["-19.99", -1999], ["1234567.89", 123456789]]) {
    assert.equal(toCents(text), cents, text);
  }
});

test("JPY and KWD parse to their minor units", () => {
  assert.equal(toCents("1500", "JPY"), 1500);
  assert.equal(toCents("1.001", "KWD"), 1001);
  assert.equal(toCents("4.35", "KWD"), 4350);
  assert.equal(toCents("1.5", "KWD"), 1500);
  assert.equal(toCents("-0.029", "KWD"), -29);
});

test("too many decimals throw", () => {
  assert.throws(() => toCents("19.99", "JPY"));
  assert.throws(() => toCents("19.999"));
  assert.throws(() => toCents("1.2345", "KWD"));
});

test("plain formatting follows the decimals", () => {
  assert.equal(formatCents(1999), "19.99");
  assert.equal(formatCents(1500, "JPY"), "1500");
  assert.equal(formatCents(-1500, "JPY"), "-1500");
  assert.equal(formatCents(1234, "KWD"), "1.234");
  assert.equal(formatCents(5, "KWD"), "0.005");
  assert.equal(formatCents(-1500, "KWD"), "-1.500");
});

test("order import and discounts use the currency", () => {
  assert.deepEqual(parseOrderCsv("sku,qty,price\nA-1,2,1500\n", "JPY"), [{ sku: "A-1", qty: 2, unitCents: 1500 }]);
  assert.deepEqual(parseOrderCsv("sku,qty,price\nA-1,2,1.234\n", "KWD"), [{ sku: "A-1", qty: 2, unitCents: 1234 }]);
  assert.throws(() => parseOrderCsv("sku,qty,price\nA-1,2,19.99\n", "JPY"));
  assert.deepEqual(parseDiscount("500", "JPY"), { kind: "fixed", cents: 500 });
  assert.deepEqual(parseDiscount("1.250", "KWD"), { kind: "fixed", cents: 1250 });
  assert.deepEqual(parseDiscount("10%", "JPY"), { kind: "percent", percent: 10 });
});

test("quotes accept each currency's decimals", () => {
  assert.deepEqual(parseQuote("3 x 1500", "JPY"), { qty: 3, unitCents: 1500 });
  assert.deepEqual(parseQuote("2 x 1.234", "KWD"), { qty: 2, unitCents: 1234 });
  assert.deepEqual(parseQuote("3 x 19.99"), { qty: 3, unitCents: 1999 });
  assert.throws(() => parseQuote("3 x 19.99", "JPY"));
});

test("shipping follows the per-currency table", () => {
  assert.equal(shippingFee(6999, "JPY"), 700);
  assert.equal(shippingFee(7000, "JPY"), 0);
  assert.equal(shippingFee(14999, "KWD"), 1500);
  assert.equal(shippingFee(15000, "KWD"), 0);
  assert.equal(shippingFee(5000), 0);
});

test("receipts do not reuse a price from another currency", () => {
  const line = { sku: "A-1", qty: 1, unitCents: 1500 };
  assert.match(receiptLine(line), /15\.00$/);
  assert.match(receiptLine(line, "JPY"), / 1500$/);
  assert.match(receiptLine(line, "KWD"), /1\.500$/);
  assert.match(receipt([line], "JPY"), /TOTAL 1500$/);
  assert.match(receipt([line], "KWD"), /TOTAL 1\.500$/);
});

test("accounting export follows the decimals", () => {
  const lines = (unitCents) => [{ sku: "A-1", qty: 1, unitCents }];
  assert.equal(toAccountingCsv(lines(1500), "JPY"), "sku,amount\nA-1,1500\n");
  assert.equal(toAccountingCsv(lines(5), "JPY"), "sku,amount\nA-1,5\n");
  assert.equal(toAccountingCsv(lines(1234), "KWD"), "sku,amount\nA-1,1.234\n");
  assert.equal(toAccountingCsv(lines(5), "KWD"), "sku,amount\nA-1,0.005\n");
  assert.equal(toAccountingCsv(lines(-5), "KWD"), "sku,amount\nA-1,-0.005\n");
  assert.equal(toAccountingCsv(lines(-1500), "JPY"), "sku,amount\nA-1,-1500\n");
});

test("display amounts group thousands in every currency", () => {
  assert.equal(displayAmount(123456), "$1,234.56");
  assert.equal(displayAmount(1234567, "JPY"), "¥1,234,567");
  assert.equal(displayAmount(999, "JPY"), "¥999");
  assert.equal(displayAmount(-1500, "JPY"), "-¥1,500");
  assert.equal(displayAmount(1234567, "KWD"), "KD 1,234.567");
  assert.equal(displayAmount(-5, "KWD"), "-KD 0.005");
});

test("statement lines read back at any size", () => {
  for (const [cents, currency] of [[123456789, "USD"], [1234567, "JPY"], [1234567890, "JPY"], [1234567, "KWD"], [1234567890, "KWD"], [-1500, "JPY"], [-1500, "KWD"]]) {
    assert.equal(readStatementLine(statementLine("Total", cents, currency), currency), cents, `${cents} ${currency}`);
  }
});

test("refund notes follow the decimals", () => {
  assert.equal(refundNote(3000, 10, 30, "JPY"), "Refund 2000 for 20 unused days");
  assert.equal(refundNote(1000, 2, 3, "JPY"), "Refund 333 for 1 unused days");
  assert.equal(refundNote(3000, 10, 30, "KWD"), "Refund 2.000 for 20 unused days");
  assert.equal(refundNote(1000, 2, 3, "KWD"), "Refund 0.333 for 1 unused days");
});

test("revenue reports round averages to the minor unit", () => {
  const invoices = [{ totalCents: 1000 }, { totalCents: 1001 }, { totalCents: 1001 }];
  assert.deepEqual(revenueSummary(invoices, "JPY"), { count: 3, total: "3002", average: "1001" });
  assert.deepEqual(revenueSummary(invoices, "KWD"), { count: 3, total: "3.002", average: "1.001" });
  assert.deepEqual(revenueSummary([], "JPY"), { count: 0, total: "0", average: "0" });
});

test("unsupported currencies throw everywhere", () => {
  const line = { sku: "A-1", qty: 1, unitCents: 100 };
  for (const call of [
    () => toCents("1", "EUR"), () => formatCents(1, "EUR"), () => parseOrderCsv("sku,qty,price\nA-1,1,1\n", "EUR"),
    () => parseDiscount("1", "EUR"), () => parseQuote("1 x 1.00", "EUR"), () => shippingFee(1, "EUR"),
    () => receiptLine(line, "EUR"), () => toAccountingCsv([line], "EUR"), () => displayAmount(1, "EUR"),
    () => refundNote(100, 1, 2, "EUR"), () => revenueSummary([], "EUR"),
  ]) assert.throws(call);
});
