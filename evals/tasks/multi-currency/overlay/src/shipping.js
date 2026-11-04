const FREE_OVER = 5000;
const FLAT_FEE = 500;

export function shippingFee(subtotalCents) {
  return subtotalCents >= FREE_OVER ? 0 : FLAT_FEE;
}
