const withCommas = (text) => text.replace(/\B(?=(\d{3})+\.)/g, ",");

export function displayAmount(cents) {
  const sign = cents < 0 ? "-" : "";
  return `${sign}$${withCommas((Math.abs(cents) / 100).toFixed(2))}`;
}

export function statementLine(label, cents) {
  return `${label}: ${displayAmount(cents)}`;
}

// Reads the amount back from a line statementLine wrote.
export function readStatementLine(text) {
  const amount = text.slice(text.lastIndexOf(": ") + 2).replace("$", "").replace(",", "");
  return Math.round(Number(amount) * 100);
}
