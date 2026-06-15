import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prismadb";
import { getFeaturedProducts } from "@/lib/queries/featured-products";
import { activeSaleSelect, mapActiveSale } from "@/lib/queries/sales";
import { paginatedProductsSchema } from "@/types/product";

export async function GET(request: NextRequest) {
  if (request.method !== "GET") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    // // Parse the query parameters from the request URL
    const searchParams = request.nextUrl.searchParams;
    const petId = searchParams.get("petId");
    const isFeaturedParam = searchParams.get("isFeatured");
    const isFeatured = isFeaturedParam === "true";

    if (petId) {
      const petProducts = await prisma.product.findMany({
        where: {
          // Many-to-many via junction
          petTypes: {
            some: { petTypeId: petId },
          },
        },
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
          // Return petTypes from the junction
          petTypes: {
            select: {
              petType: { select: { id: true, name: true, displayName: true } },
            },
          },
          sales: activeSaleSelect,
        },
      });

      // Map junction rows into petTypes[]
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
      const featuredProducts = await getFeaturedProducts();
      return NextResponse.json(featuredProducts);
    }

    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const sortParam = searchParams.get("sort");
    const petTypeParam = searchParams.get("petType");
    const productTypeParam = searchParams.get("productType");
    const offersTypeParam = searchParams.get("offersType");
    const brandsTypeParam = searchParams.get("brandsType");
    const priceRangeParam = searchParams.get("priceRange");
    const inStockParam = searchParams.get("inStock");

    const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
    const limit = limitParam ? Math.min(100, Math.max(1, parseInt(limitParam, 10))) : 24;
    const skip = (page - 1) * limit;

    const petTypeNames = petTypeParam ? petTypeParam.split(",").filter(Boolean) : [];
    const productTypeNames = productTypeParam ? productTypeParam.split(",").filter(Boolean) : [];
    const offersTypeValues = offersTypeParam ? offersTypeParam.split(",").filter(Boolean) : [];
    const brandsTypeNames = brandsTypeParam ? brandsTypeParam.split(",").filter(Boolean) : [];

    const where: Prisma.ProductWhereInput = {};

    if (petTypeNames.length > 0) {
      where.petTypes = { some: { petType: { name: { in: petTypeNames } } } };
    }
    if (productTypeNames.length > 0) {
      where.productType = { name: { in: productTypeNames } };
    }
    if (offersTypeValues.length > 0) {
      where.offersType = { in: offersTypeValues };
    }
    if (brandsTypeNames.length > 0) {
      where.brand = { name: { in: brandsTypeNames } };
    }
    if (priceRangeParam) {
      const [minStr, maxStr] = priceRangeParam.split("-");
      const min = parseFloat(minStr);
      const max = parseFloat(maxStr);
      if (!isNaN(min) && !isNaN(max)) {
        where.price = { gte: min, lte: max };
      }
    }
    if (inStockParam === "true") {
      where.inStock = true;
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput | undefined;
    if (sortParam === "price_asc") orderBy = { price: "asc" };
    else if (sortParam === "price_desc") orderBy = { price: "desc" };
    else if (sortParam === "rating_desc") orderBy = { averageRating: "desc" };

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
      sales: activeSaleSelect,
    };

    const [rawProducts, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy, select, skip, take: limit }),
      prisma.product.count({ where }),
    ]);

    const mappedProducts = rawProducts.map((product) => ({
      ...product,
      petTypes: product.petTypes.map((pt) => pt.petType),
      sale: mapActiveSale(product.sales),
    }));

    const result = paginatedProductsSchema.safeParse({
      items: mappedProducts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });

    if (!result.success) {
      console.error("Validation errors:", result.error.errors);
      return NextResponse.json(
        { error: "Invalid product data" },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
