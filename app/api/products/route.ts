/**
 * Route handler: GET /api/products
 * ---------------------------------
 * The single read endpoint for product listings across the storefront. It serves
 * three distinct response shapes depending on the query string, in priority order:
 *
 *   1. `?petId=<id>`        → all products linked to one pet type (unpaginated list).
 *   2. `?isFeatured=true`   → the curated featured-products list (delegated helper).
 *   3. (no special param)   → the main paginated, filterable, sortable catalogue.
 *
 * These branches are mutually exclusive and evaluated top-to-bottom: `petId` wins
 * over `isFeatured`, which wins over the default paginated path. Only the default
 * path supports the filter/sort/pagination query parameters documented below.
 *
 * Cross-cutting concerns shared by every branch:
 *
 *   - Pet types: products relate to pet types through the `ProductPetType` junction.
 *     Every branch flattens those junction rows into a plain `petTypes[]` array so
 *     clients never see the junction shape. (See CLAUDE.md "Product normalization".)
 *
 *   - Sales: a product is "on sale" purely by virtue of an active row in the
 *     `Sale`/`ProductSale` tables — NOT the legacy `Product.isOnSale` column, which
 *     is dead and read nowhere. Each branch pulls active sales with
 *     `activeSaleSelect` (which pre-filters to `sale.active = true`) and collapses
 *     them to a single `sale` field (or null) via `mapActiveSale`. The actual
 *     discount math lives in `lib/pricing.ts` and is applied downstream by clients.
 *
 * All DB access goes through the singleton in `lib/prismadb.ts`.
 */
import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prismadb";
import { getFeaturedProducts } from "@/lib/queries/featured-products";
import { activeSaleSelect, mapActiveSale } from "@/lib/queries/sales";
import { paginatedProductsSchema } from "@/types/product";

export async function GET(request: NextRequest) {
  // Next.js only dispatches GET requests to this exported `GET` handler, so this
  // guard is defensive/belt-and-suspenders — it should never actually trip.
  if (request.method !== "GET") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    // Read the query string. `request.nextUrl` is Next's parsed URL; its
    // `searchParams` is a standard URLSearchParams instance.
    const searchParams = request.nextUrl.searchParams;
    // Branch selectors. `petId` selects branch 1; `isFeatured=true` selects
    // branch 2. Anything else falls through to the paginated catalogue below.
    const petId = searchParams.get("petId");
    const isFeaturedParam = searchParams.get("isFeatured");
    // Strict "true" comparison: any other value (including null/"false") is treated as false.
    const isFeatured = isFeaturedParam === "true";

    // ── Branch 1: products for a single pet type ─────────────────────────────
    // Returns a flat (unpaginated) array of lightweight product cards for the
    // given pet type. Used by pet-type landing/category views.
    if (petId) {
      const petProducts = await prisma.product.findMany({
        where: {
          // Match products linked to this pet type through the many-to-many
          // junction. `some` = "has at least one ProductPetType row with this id".
          // This deliberately ignores the legacy one-to-many `petTypeId` FK and
          // uses only the junction, which is the source of truth for pet types.
          petTypes: {
            some: { petTypeId: petId },
          },
        },
        // Hand-pick only the fields the product card UI needs — keeps the payload
        // small and avoids leaking columns the client shouldn't depend on.
        select: {
          id: true,
          name: true,
          price: true,
          mainImageUrl: true,
          averageRating: true,
          brand: {
            select: {
              id: true,
              name: true,
            },
          },
          productType: {
            select: {
              id: true,
              name: true,
              displayName: true,
              icon: true,
              description: true,
            },
          },
          // Pull pet types as nested junction rows here; flattened below.
          petTypes: {
            select: {
              petType: { select: { id: true, name: true, displayName: true } },
            },
          },
          // Pull active sales for each product (pre-filtered to active === true).
          sales: activeSaleSelect,
        },
      });

      // Reshape each Prisma row into the DTO the client expects:
      //  - `petTypes`: collapse `[{ petType }]` junction rows into a flat `petType[]`.
      //  - `sale`: collapse the active-sales list into a single applicable sale
      //    (or null) via the shared resolver in lib/pricing.ts.
      const mapped = petProducts.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        mainImageUrl: p.mainImageUrl,
        brand: p.brand,
        productType: p.productType,
        petTypes: p.petTypes.map((ppt) => ppt.petType),
        sale: mapActiveSale(p.sales),
      }));

      return NextResponse.json(mapped);
    } else if (isFeatured) {
      // ── Branch 2: featured products ────────────────────────────────────────
      // Delegated to a dedicated query helper so the featured selection logic
      // (and its own pet-type/sale flattening) lives in one place.
      const featuredProducts = await getFeaturedProducts();
      return NextResponse.json(featuredProducts);
    }

    // ── Branch 3: paginated, filterable catalogue (default) ───────────────────
    // Reached when neither `petId` nor `isFeatured` is set. This is the main shop
    // grid endpoint and the only branch that honours the filter/sort/page params.

    // Raw query params. Multi-value filters arrive as comma-separated strings
    // (e.g. `petType=dog,cat`); price is a single `min-max` string.
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const sortParam = searchParams.get("sort");
    const petTypeParam = searchParams.get("petType");
    const productTypeParam = searchParams.get("productType");
    const offersTypeParam = searchParams.get("offersType");
    const brandsTypeParam = searchParams.get("brandsType");
    const priceRangeParam = searchParams.get("priceRange");
    const inStockParam = searchParams.get("inStock");

    // Pagination, clamped to safe bounds:
    //  - page: at least 1 (defaults to 1).
    //  - limit: between 1 and 100, defaults to 24. The 100 cap prevents a client
    //    from requesting an unbounded page size.
    //  - skip: offset into the result set for the requested page.
    const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
    const limit = limitParam ? Math.min(100, Math.max(1, parseInt(limitParam, 10))) : 24;
    const skip = (page - 1) * limit;

    // Split comma-separated multi-value filters into arrays, dropping empty
    // entries (so a trailing comma or "" doesn't produce a bogus filter value).
    const petTypeNames = petTypeParam ? petTypeParam.split(",").filter(Boolean) : [];
    const productTypeNames = productTypeParam ? productTypeParam.split(",").filter(Boolean) : [];
    const offersTypeValues = offersTypeParam ? offersTypeParam.split(",").filter(Boolean) : [];
    const brandsTypeNames = brandsTypeParam ? brandsTypeParam.split(",").filter(Boolean) : [];

    // Build the Prisma `where` incrementally. Each block is additive (logical AND),
    // and each is only added when its corresponding filter is actually present, so
    // absent params impose no constraint.
    const where: Prisma.ProductWhereInput = {};

    // Pet type filter — match any product linked (via junction) to one of the
    // named pet types. Filters by human-readable `name`, unlike the `petId`
    // branch above which filters by id.
    if (petTypeNames.length > 0) {
      where.petTypes = { some: { petType: { name: { in: petTypeNames } } } };
    }
    // Product type (category) filter — match any of the named product types.
    if (productTypeNames.length > 0) {
      where.productType = { name: { in: productTypeNames } };
    }
    // Offers filter — match the product's `offersType` against the requested values.
    if (offersTypeValues.length > 0) {
      where.offersType = { in: offersTypeValues };
    }
    // Brand filter — match any of the named brands.
    if (brandsTypeNames.length > 0) {
      where.brand = { name: { in: brandsTypeNames } };
    }
    // Price range filter — a single `min-max` string (e.g. "10-50"). Only applied
    // when both ends parse as numbers; malformed ranges are silently ignored.
    if (priceRangeParam) {
      const [minStr, maxStr] = priceRangeParam.split("-");
      const min = parseFloat(minStr);
      const max = parseFloat(maxStr);
      if (!isNaN(min) && !isNaN(max)) {
        where.price = { gte: min, lte: max };
      }
    }
    // In-stock filter — only constrain when explicitly "true"; otherwise show all.
    if (inStockParam === "true") {
      where.inStock = true;
    }

    // Sorting. Left undefined (Prisma default order) unless one of the known sort
    // keys is supplied; unrecognised `sort` values fall back to default order.
    let orderBy: Prisma.ProductOrderByWithRelationInput | undefined;
    if (sortParam === "price_asc") orderBy = { price: "asc" };
    else if (sortParam === "price_desc") orderBy = { price: "desc" };
    else if (sortParam === "rating_desc") orderBy = { averageRating: "desc" };

    // Field selection for the catalogue cards. Mirrors branch 1 but also exposes
    // `offersType` and `inStock` (surfaced as badges/filters in the shop grid).
    const select = {
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
      // Active sales for each product; flattened to a single `sale` below.
      sales: activeSaleSelect,
    };

    // Run the page query and the total count in parallel against the SAME `where`,
    // so the count reflects the filtered set (needed for accurate `totalPages`).
    const [rawProducts, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy, select, skip, take: limit }),
      prisma.product.count({ where }),
    ]);

    // Same reshaping as branch 1: flatten pet-type junction rows and collapse
    // active sales into a single `sale` (or null). Spread the rest of the row as-is.
    const mappedProducts = rawProducts.map((product) => ({
      ...product,
      petTypes: product.petTypes.map((pt) => pt.petType),
      sale: mapActiveSale(product.sales),
    }));

    // Validate the assembled payload against the Zod schema before returning. This
    // is the API's DTO contract — if our mapping drifts from what clients expect,
    // we fail loudly here rather than shipping a malformed response.
    const result = paginatedProductsSchema.safeParse({
      items: mappedProducts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });

    if (!result.success) {
      // Validation failure indicates a server-side shape bug, not bad client input;
      // log the details for debugging and return a generic 400.
      console.error("Validation errors:", result.error.errors);
      return NextResponse.json(
        { error: "Invalid product data" },
        { status: 400 }
      );
    }

    // `result.data` is the parsed (and type-narrowed) payload.
    return NextResponse.json(result.data);
  } catch {
    // Any unexpected failure (DB error, etc.) surfaces as a generic 500. The error
    // is intentionally swallowed to avoid leaking internals to the client.
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
