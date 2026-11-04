import { formatCents } from "./money.js";

export function refundNote(paidCents, usedDays, totalDays, currency = "USD") {
  if (!(totalDays > 0) || usedDays < 0 || usedDays > totalDays) throw new Error("bad billing period");
  const unused = totalDays - usedDays;
  const refund = Math.round((paidCents * unused) / totalDays);
  return `Refund ${formatCents(refund, currency)} for ${unused} unused days`;
}
