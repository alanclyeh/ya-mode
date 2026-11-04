import { formatCents } from "./money.js";

export function revenueSummary(invoices, currency = "USD") {
  const total = invoices.reduce((sum, invoice) => sum + invoice.totalCents, 0);
  const average = invoices.length === 0 ? 0 : Math.round(total / invoices.length);
  return { count: invoices.length, total: formatCents(total, currency), average: formatCents(average, currency) };
}
