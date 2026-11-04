const STEP_MONTHS = { monthly: 1, yearly: 12 };

function parseDate(text) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (!m) throw new Error(`bad date: ${text}`);
  const [y, mo, d] = m.slice(1).map(Number);
  if (mo < 1 || mo > 12 || d < 1 || d > daysIn(y, mo - 1)) throw new Error(`bad date: ${text}`);
  return { y, m: mo - 1, d };
}

function daysIn(year, month) {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

function format(y, m, d) {
  return `${String(y).padStart(4, "0")}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function nextBillingDates(startDate, interval, count) {
  const start = parseDate(startDate);
  if (!Number.isInteger(count) || count < 0) throw new Error(`bad count: ${count}`);
  if (interval === "weekly") {
    const base = Date.UTC(start.y, start.m, start.d);
    return Array.from({ length: count }, (_, i) => new Date(base + (i + 1) * 7 * 86400000).toISOString().slice(0, 10));
  }
  const step = STEP_MONTHS[interval];
  if (!step) throw new Error(`bad interval: ${interval}`);
  return Array.from({ length: count }, (_, i) => {
    const total = start.m + (i + 1) * step;
    const y = start.y + Math.floor(total / 12);
    const m = total % 12;
    return format(y, m, Math.min(start.d, daysIn(y, m)));
  });
}
