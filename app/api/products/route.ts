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

    // Build the query conditionally based on the presence of petTypeId
    let whereClause = undefined; // No filtering if petTypeId is not provided

    if (petId) {
      // Set the where clause to filter products by petTypeId
      console.log(
        "PRODUCTS ROUTE HANDLER: Fetching products by petTypeId:",
        petId
      );
      whereClause = { petTypeId: petId };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
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
        petType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // if (products)
    //   console.log("ROUTE HANDLER: Fetched products from database:", products);

    // Validate the data using Zod
    const result = productSchema.array().safeParse(products);

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
