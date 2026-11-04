export function revenueSummary(invoices) {
  const total = invoices.reduce((sum, invoice) => sum + invoice.totalCents, 0);
  const average = invoices.length === 0 ? 0 : total / invoices.length;
  return { count: invoices.length, total: (total / 100).toFixed(2), average: (average / 100).toFixed(2) };
}
