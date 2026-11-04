export function lineTotal(line, customer) {
  let total = 0;
  if (line.type === "product") {
    if (customer && customer.tier === "gold") {
      total = line.unitCents * line.qty;
      total = total - Math.round(total * 0.1);
      if (line.qty >= 10) {
        total = total - Math.round(total * 0.05);
      }
    } else if (customer && customer.tier === "silver") {
      total = line.unitCents * line.qty;
      total = total - Math.round(total * 0.05);
      if (line.qty >= 10) {
        total = total - Math.round(total * 0.05);
      }
    } else {
      total = line.unitCents * line.qty;
      if (line.qty >= 10) {
        total = total - Math.round(total * 0.05);
      }
    }
    if (line.taxable !== false) {
      total = total + Math.round(total * 0.08);
    }
  } else if (line.type === "service") {
    if (customer && customer.tier === "gold") {
      total = line.unitCents * line.hours;
      total = total - Math.round(total * 0.1);
    } else if (customer && customer.tier === "silver") {
      total = line.unitCents * line.hours;
      total = total - Math.round(total * 0.05);
    } else {
      total = line.unitCents * line.hours;
    }
  } else if (line.type === "subscription") {
    total = line.unitCents * line.months;
    if (line.months >= 12) {
      total = total - Math.round(total * 0.15);
    } else if (customer && customer.tier === "gold") {
      total = total - Math.round(total * 0.1);
    }
    if (line.taxable !== false) {
      total = total + Math.round(total * 0.08);
    }
  } else {
    throw new Error("unknown line type: " + line.type);
  }
  return total;
}

export function invoiceTotal(lines, customer) {
  let sum = 0;
  for (let i = 0; i < lines.length; i++) {
    sum = sum + lineTotal(lines[i], customer);
  }
  return sum;
}
