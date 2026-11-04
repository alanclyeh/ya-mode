export function refundNote(paidCents, usedDays, totalDays) {
  if (!(totalDays > 0) || usedDays < 0 || usedDays > totalDays) throw new Error("bad billing period");
  const unused = totalDays - usedDays;
  const refund = (paidCents * unused) / totalDays;
  return `Refund ${(refund / 100).toFixed(2)} for ${unused} unused days`;
}
