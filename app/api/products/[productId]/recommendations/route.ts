import { NextResponse } from "next/server";

import { prisma } from "@/lib/prismadb";
import { productSchema } from "@/types/product";

const TOP_N = 8;
const PRICE_BAND = 0.25;

const candidateSelect = {
  id: true,
  name: true,
  price: true,
  mainImageUrl: true,
  offersType: true,
  inStock: true,
  averageRating: true,
  numberOfRatings: true,
  productTypeId: true,
  brandId: true,
  petTypeId: true,
  brand: { select: { id: true, name: true } },
  productType: { select: { id: true, name: true } },
  petTypes: {
    select: {
      petTypeId: true,
      petType: { select: { id: true, name: true, displayName: true } },
    },
  },
} as const;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  if (request.method !== "GET") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    const productId = (await params).productId;

    if (!productId || typeof productId !== "string") {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const currentProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        price: true,
        productTypeId: true,
        brandId: true,
        petTypeId: true,
        petTypes: { select: { petTypeId: true } },
      },
    });

    if (!currentProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const currentPetTypeIds = new Set(
      [
        currentProduct.petTypeId,
        ...currentProduct.petTypes.map((pt) => pt.petTypeId),
      ].filter((id): id is string => Boolean(id))
    );

    const priceMin = currentProduct.price * (1 - PRICE_BAND);
    const priceMax = currentProduct.price * (1 + PRICE_BAND);

    const petTypeIdList = [...currentPetTypeIds];

    const candidates = await prisma.product.findMany({
      where: {
        id: { not: currentProduct.id },
        inStock: true,
        OR: [
          { productTypeId: currentProduct.productTypeId },
          { brandId: currentProduct.brandId },
          ...(petTypeIdList.length
            ? [
                { petTypeId: { in: petTypeIdList } },
                {
                  petTypes: { some: { petTypeId: { in: petTypeIdList } } },
                },
              ]
            : []),
          { price: { gte: priceMin, lte: priceMax } },
        ],
      },
      select: candidateSelect,
    });

    const scored = candidates.map((c) => {
      let score = 0;
      if (c.productTypeId === currentProduct.productTypeId) score += 2;

      const candidatePetTypeIds = new Set(
        [c.petTypeId, ...c.petTypes.map((pt) => pt.petTypeId)].filter(
          (id): id is string => Boolean(id)
        )
      );
      const petOverlap = [...currentPetTypeIds].some((id) =>
        candidatePetTypeIds.has(id)
      );
      if (petOverlap) score += 2;

      if (c.brandId === currentProduct.brandId) score += 1;
      if (c.price >= priceMin && c.price <= priceMax) score += 1;

      return { product: c, score };
    });

    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.product.averageRating !== a.product.averageRating) {
        return b.product.averageRating - a.product.averageRating;
      }
      return b.product.numberOfRatings - a.product.numberOfRatings;
    });

    const top = scored.slice(0, TOP_N).map(({ product }) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      mainImageUrl: product.mainImageUrl,
      offersType: product.offersType,
      inStock: product.inStock,
      averageRating: product.averageRating,
      brand: product.brand,
      productType: product.productType,
      petTypes: product.petTypes.map((pt) => pt.petType),
    }));

    const result = productSchema.array().safeParse(top);

    if (!result.success) {
      console.error("Validation errors:", result.error.errors);
      return NextResponse.json(
        { error: "Invalid product data" },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
