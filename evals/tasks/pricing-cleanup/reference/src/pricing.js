const TIER_OFF = {
  product: { gold: 0.1, silver: 0.05 },
  service: { gold: 0.1, silver: 0.05 },
  subscription: { gold: 0.1 },
};
const UNITS = { product: "qty", service: "hours", subscription: "months" };
const TAXED = { product: true, service: false, subscription: true };

const off = (total, rate) => total - Math.round(total * rate);

export function lineTotal(line, customer) {
  const units = UNITS[line.type];
  if (!units) throw new Error("unknown line type: " + line.type);
  const tierOff = TIER_OFF[line.type][customer?.tier] ?? 0;
  let total = line.unitCents * line[units];
  if (line.type === "subscription" && line.months >= 12) total = off(total, 0.15);
  else if (tierOff) total = off(total, tierOff);
  if (line.type === "product" && line.qty >= 10) total = off(total, 0.05);
  if (TAXED[line.type] && line.taxable !== false) total = total + Math.round(total * 0.08);
  return total;
}

export function invoiceTotal(lines, customer) {
  return lines.reduce((sum, line) => sum + lineTotal(line, customer), 0);
}
