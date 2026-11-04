import { test } from "node:test";
import assert from "node:assert/strict";
import { nextBillingDates } from "../src/index.js";

test("weekly crosses the year", () => {
  assert.deepEqual(nextBillingDates("2026-12-28", "weekly", 2), ["2027-01-04", "2027-01-11"]);
});

test("mid-month monthly keeps the day", () => {
  assert.deepEqual(nextBillingDates("2026-01-15", "monthly", 2), ["2026-02-15", "2026-03-15"]);
});

test("month-end signups clamp and return to the anchor day", () => {
  assert.deepEqual(nextBillingDates("2026-01-31", "monthly", 4), ["2026-02-28", "2026-03-31", "2026-04-30", "2026-05-31"]);
  assert.deepEqual(nextBillingDates("2028-01-31", "monthly", 1), ["2028-02-29"]);
  assert.deepEqual(nextBillingDates("2026-11-30", "monthly", 3), ["2026-12-30", "2027-01-30", "2027-02-28"]);
});

test("leap-day yearly signups bill on 2/28 and return to 2/29", () => {
  assert.deepEqual(nextBillingDates("2028-02-29", "yearly", 4), ["2029-02-28", "2030-02-28", "2031-02-28", "2032-02-29"]);
});

test("zero count gives no dates", () => {
  assert.deepEqual(nextBillingDates("2026-03-01", "monthly", 0), []);
});

test("invalid arguments throw", () => {
  assert.throws(() => nextBillingDates("2026-02-30", "monthly", 1), "nonexistent date");
  assert.throws(() => nextBillingDates("2026-1-5", "monthly", 1), "unpadded date");
  assert.throws(() => nextBillingDates("2026-01-05", "daily", 1), "unknown interval");
  assert.throws(() => nextBillingDates("2026-01-05", "monthly", -1), "negative count");
  assert.throws(() => nextBillingDates("2026-01-05", "monthly", 1.5), "fractional count");
});
