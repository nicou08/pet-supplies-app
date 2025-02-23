import { NextResponse } from "next/server";

import { prisma } from "@/lib/prismadb";
import { productSchema } from "@/types/product";

export async function GET(request: Request) {
  if (request.method !== "GET") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
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
        petType: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    //console.log("ROUTE HANDLER: Fetched products from database:", products);

    // Validate the data using Zod
    const result = productSchema.array().safeParse(products);

    if (!result.success) {
      console.error("Validation errors:", result.error.errors);
      return NextResponse.json(
        { error: "Invalid product data" },
        { status: 400 }
      );
    }

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
