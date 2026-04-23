import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "@/lib/prismadb";
import { productSchema } from "@/types/product";

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

    // Build the query conditionally based on the presence of petTypeId
    let whereClause = undefined; // No filtering if petTypeId is not provided

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
      }));

      return NextResponse.json(mapped);
    } else if (isFeatured) {
      const featuredProducts = await prisma.product.findMany({
        where: {
          isFeatured: true,
        },
        select: {
          id: true,
          name: true,
          price: true,
          mainImageUrl: true,
        },
        orderBy: { createdAt: "desc" },
        take: 7,
      });

      // Map junction rows into petTypes[]
      const mappedFeatured = featuredProducts.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        mainImageUrl: p.mainImageUrl,
      }));

      return NextResponse.json(mappedFeatured);
    }

    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        mainImageUrl: true,
        offersType: true,
        inStock: true,
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
          },
        },
        // Pet types (many-to-many via junction)
        petTypes: {
          select: {
            petType: {
              select: { id: true, name: true, displayName: true },
            },
          },
        },
      },
    });

    // Map productToPetTypes to petTypes array for each product
    const mappedProducts = products.map((product) => ({
      ...product,
      petTypes: product.petTypes.map((pt) => pt.petType),
    }));

    //console.log("ALL Products found:", mappedProducts);
    // Validate the data using Zod
    const result = productSchema.array().safeParse(mappedProducts);

    if (!result.success) {
      console.error("Validation errors:", result.error.errors);
      return NextResponse.json(
        { error: "Invalid product data" },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
