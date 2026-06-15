/**
 * Single source of truth for sale/discount math.
 *
 * This module is plain TypeScript with no server-only imports, so it can run on
 * both the server (Stripe charge, API routes) and the client (cart totals,
 * product cards). Every layer that needs a discounted price MUST go through
 * here — do not duplicate the math elsewhere.
 */

export type SaleType = "PERCENTAGE" | "BUY_X_GET_Y";

/**
 * Minimal, framework-agnostic shape of a sale. Mirrors the `Sale` Prisma model
 * but intentionally avoids importing Prisma types so it stays client-safe.
 */
export interface SaleInfo {
  id: string;
  name: string;
  type: SaleType;
  percentOff?: number | null;
  buyQuantity?: number | null;
  freeQuantity?: number | null;
}

export interface LinePrice {
  /** Original (pre-discount) unit price. */
  unitPrice: number;
  quantity: number;
  /** unitPrice * quantity, rounded to cents. */
  originalTotal: number;
  /** What the customer actually pays for this line, rounded to cents. */
  discountedTotal: number;
  /** originalTotal - discountedTotal, rounded to cents. */
  discountAmount: number;
  /** Number of free units granted (BUY_X_GET_Y only; 0 otherwise). */
  freeUnits: number;
  /**
   * Effective per-unit price for PERCENTAGE sales (for struck-through display).
   * Null when no sale or when the sale isn't a clean per-unit discount (BOGO).
   */
  discountedUnitPrice: number | null;
  /** Whether a discount actually applies at this quantity. */
  hasDiscount: boolean;
}

/** Round to cents to avoid floating-point drift in money math. */
function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Pick the single active sale to apply to a product. The app enforces "one sale
 * per product", but if multiple are linked this resolves deterministically:
 * filters by active + date window, then takes the first remaining.
 */
export function resolveActiveSale(
  sales: Array<SaleInfo & { active?: boolean; startsAt?: Date | string | null; endsAt?: Date | string | null }>,
  now: Date = new Date()
): SaleInfo | null {
  const ts = now.getTime();
  const valid = sales.filter((s) => {
    if (s.active === false) return false;
    if (s.startsAt && new Date(s.startsAt).getTime() > ts) return false;
    if (s.endsAt && new Date(s.endsAt).getTime() < ts) return false;
    return true;
  });
  return valid[0] ?? null;
}

/**
 * Compute the line price for a product given its (optional) active sale.
 * Returns full price untouched when there is no applicable discount.
 */
export function computeLinePrice(
  unitPrice: number,
  quantity: number,
  sale: SaleInfo | null | undefined
): LinePrice {
  const originalTotal = round2(unitPrice * quantity);

  const base: LinePrice = {
    unitPrice,
    quantity,
    originalTotal,
    discountedTotal: originalTotal,
    discountAmount: 0,
    freeUnits: 0,
    discountedUnitPrice: null,
    hasDiscount: false,
  };

  if (!sale || quantity <= 0) return base;

  if (sale.type === "PERCENTAGE") {
    const percent = sale.percentOff ?? 0;
    if (percent <= 0) return base;
    const discountedUnitPrice = round2(unitPrice * (1 - percent / 100));
    const discountedTotal = round2(discountedUnitPrice * quantity);
    return {
      ...base,
      discountedTotal,
      discountAmount: round2(originalTotal - discountedTotal),
      discountedUnitPrice,
      hasDiscount: discountedTotal < originalTotal,
    };
  }

  if (sale.type === "BUY_X_GET_Y") {
    const buy = sale.buyQuantity ?? 0;
    const free = sale.freeQuantity ?? 0;
    const group = buy + free;
    if (buy <= 0 || free <= 0) return base;

    const freeUnits = Math.floor(quantity / group) * free;
    if (freeUnits <= 0) return base;

    const discountedTotal = round2(unitPrice * (quantity - freeUnits));
    return {
      ...base,
      discountedTotal,
      discountAmount: round2(originalTotal - discountedTotal),
      freeUnits,
      hasDiscount: true,
    };
  }

  return base;
}

/** Short label for a sale badge/tag, independent of quantity. */
export function saleBadgeLabel(sale: SaleInfo | null | undefined): string | null {
  if (!sale) return null;
  if (sale.type === "PERCENTAGE" && sale.percentOff) {
    return `${sale.percentOff}% off`;
  }
  if (sale.type === "BUY_X_GET_Y" && sale.buyQuantity && sale.freeQuantity) {
    return `Buy ${sale.buyQuantity} get ${sale.freeQuantity} free`;
  }
  return null;
}
