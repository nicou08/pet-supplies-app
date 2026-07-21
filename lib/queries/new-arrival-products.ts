import { prisma } from "@/lib/prismadb";
import { activeSaleSelect, mapActiveSale } from "@/lib/queries/sales";
import type { Product } from "@/types/product";

// How far back a product's createdAt can be and still count as a "new arrival".
const NEW_ARRIVAL_WINDOW_DAYS = 30;
// One full grid row on the widest layout (xl:grid-cols-4 × 2). If the rolling
// window yields fewer than this, we fall back to the most-recent products so the
// page never looks empty while the seed catalogue is still thin (TODO step 1).
const MIN_RESULTS = 8;

// Field selection mirrors branch 3 of app/api/products/route.ts and
// lib/queries/sale-products.ts, so the mapped shape satisfies productSchema and
// feeds ProductCard with no adaptation.
const productCardSelect = {
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
} as const;

// newest-first ordering makes the client "Newest" sort the identity order of the
// prop array, so the tile never needs a createdAt field (keeps the Product DTO
// unchanged).
function queryRecent(args: { where?: object; take?: number }) {
  return prisma.product.findMany({
    where: args.where,
    orderBy: { createdAt: "desc" },
    take: args.take,
    select: productCardSelect,
  });
}

function normalize(rows: Awaited<ReturnType<typeof queryRecent>>): Product[] {
  return rows.map((p) => ({
    ...p,
    petTypes: p.petTypes.map((pt) => ({
      ...pt.petType,
      displayName: pt.petType.displayName ?? undefined,
    })),
    sale: mapActiveSale(p.sales),
  }));
}

/**
 * Recently added products, newest-first, shaped as the storefront `Product` DTO
 * (flattened petTypes + single resolved `sale`).
 *
 * Primary: products created within `NEW_ARRIVAL_WINDOW_DAYS`. Fallback: if that
 * set is smaller than one grid row (`MIN_RESULTS`), return the most-recent
 * `MIN_RESULTS` products regardless of window — this keeps the page populated
 * while seed dates are still thin, and self-corrects to a true rolling window
 * once enough recent products exist.
 */
export async function getNewArrivalProducts(): Promise<Product[]> {
  const since = new Date();
  since.setDate(since.getDate() - NEW_ARRIVAL_WINDOW_DAYS);

  const windowed = await queryRecent({ where: { createdAt: { gte: since } } });
  if (windowed.length >= MIN_RESULTS) return normalize(windowed);

  const fallback = await queryRecent({ take: MIN_RESULTS });
  return normalize(fallback);
}
