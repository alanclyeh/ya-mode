// One "sku,amount" row per line for the accounting system.
export function toAccountingCsv(lines) {
  const rows = lines.map((line) => {
    const digits = String(line.unitCents * line.qty).padStart(3, "0");
    return `${line.sku},${digits.slice(0, -2)}.${digits.slice(-2)}`;
  });
  return ["sku,amount", ...rows].join("\n") + "\n";
}
