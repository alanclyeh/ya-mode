import { currencyInfo } from "./currency.js";

export function shippingFee(subtotalCents, currency = "USD") {
  const { freeOver, shipping } = currencyInfo(currency);
  return subtotalCents >= freeOver ? 0 : shipping;
}
