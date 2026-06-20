import { prisma } from "@/lib/prismadb";
import { activeSaleSelect, mapActiveSale } from "@/lib/queries/sales";
import type { Product } from "@/types/product";

/**
 * Products that currently have an active sale, shaped as the storefront `Product`
 * DTO (flattened petTypes + single resolved `sale`). Date-window resolution is
 * delegated to mapActiveSale → resolveActiveSale, so a product whose sale row is
 * active=true but outside its startsAt/endsAt window is filtered out here.
 *
 * The `select` mirrors branch 3 of `app/api/products/route.ts` so the result
 * satisfies `productSchema` and feeds `ProductCard` with no adaptation.
 */
export async function getSaleProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    // At least one linked sale that is flagged active. The precise date-window
    // check happens in mapActiveSale below (Prisma can't easily express the
    // "now within [startsAt, endsAt]" predicate across nullable bounds).
    where: { sales: { some: { sale: { active: true } } } },
    select: {
      id: true,
      name: true,
      price: true,
      mainImageUrl: true,
      offersType: true,
      inStock: true,
      averageRating: true,
      brand: { select: { id: true, name: true } },
      productType: { select: { id: true, name: true } },
      petTypes: {
        select: { petType: { select: { id: true, name: true, displayName: true } } },
      },
      sales: activeSaleSelect,
    },
  });

  return rows
    .map((p) => ({
      ...p,
      petTypes: p.petTypes.map((pt) => ({
        ...pt.petType,
        displayName: pt.petType.displayName ?? undefined,
      })),
      sale: mapActiveSale(p.sales),
    }))
    // Drop products whose only "active" sale is outside its date window (mapActiveSale → null).
    .filter((p) => p.sale !== null);
}
