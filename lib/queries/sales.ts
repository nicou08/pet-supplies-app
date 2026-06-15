import type { Prisma } from "@prisma/client";

import { resolveActiveSale, type SaleInfo } from "@/lib/pricing";

/**
 * Prisma `select` fragment for pulling a product's active sales through the
 * ProductSale junction. Drop this into a product `select`/`include`.
 */
export const activeSaleSelect = {
  where: { sale: { active: true } },
  select: {
    sale: {
      select: {
        id: true,
        name: true,
        type: true,
        percentOff: true,
        buyQuantity: true,
        freeQuantity: true,
        active: true,
        startsAt: true,
        endsAt: true,
      },
    },
  },
} satisfies Prisma.Product$salesArgs;

type SaleRow = {
  sale: SaleInfo & {
    active: boolean;
    startsAt: Date | null;
    endsAt: Date | null;
  };
};

/**
 * Flatten junction rows fetched via {@link activeSaleSelect} into the single
 * active sale that applies to the product (or null).
 */
export function mapActiveSale(rows: SaleRow[]): SaleInfo | null {
  const resolved = resolveActiveSale(rows.map((r) => r.sale));
  if (!resolved) return null;
  return {
    id: resolved.id,
    name: resolved.name,
    type: resolved.type,
    percentOff: resolved.percentOff ?? null,
    buyQuantity: resolved.buyQuantity ?? null,
    freeQuantity: resolved.freeQuantity ?? null,
  };
}
