import type { Coupon, PriceBreakdown } from "@/types";

/** Platform policy: 10% service fee charged to customer (added on top).
 *  Provider net = subtotal + addons − discount (fee deducted from memo only for revenue reporting).
 *  Platform revenue = platformFee. Documented consistently across UI.
 */
export const PLATFORM_FEE_PERCENT = 10;

export function calcTotals(opts: {
  basePrice: number;
  qty?: number;
  addonsTotal?: number;
  discount?: number;
  feePercent?: number;
  couponCode?: string;
}): PriceBreakdown {
  const qty = opts.qty ?? 1;
  const subtotal = Math.round(opts.basePrice * qty);
  const addonTotal = Math.round(opts.addonsTotal ?? 0);
  const discount = Math.round(opts.discount ?? 0);
  const net = Math.max(0, subtotal + addonTotal - discount);
  const feePercent = opts.feePercent ?? PLATFORM_FEE_PERCENT;
  const platformFee = Math.round((net * feePercent) / 100);
  const total = net + platformFee;
  const providerNet = net;
  return {
    subtotal,
    addonTotal,
    discount,
    platformFee,
    total,
    providerNet,
    couponCode: opts.couponCode,
  };
}

export function couponDiscount(coupon: Coupon, subtotal: number): number {
  if (!coupon.active) return 0;
  if (subtotal < coupon.minAmount) return 0;
  const now = new Date();
  if (new Date(coupon.start) > now || new Date(coupon.expiry) < now) return 0;
  if (coupon.used >= coupon.usageLimit) return 0;
  let d = coupon.type === "percent" ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
  d = Math.min(d, coupon.maxDiscount);
  return Math.min(d, subtotal);
}
