import { NextResponse } from "next/server";

import { prisma } from "@/lib/prismadb";
import { detailedProductSchema } from "@/types/product";

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

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        brand: true,
        productType: true,
        petType: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Validate the data using Zod
    const result = detailedProductSchema.safeParse(product);

    //console.log("PRODUCTT:", product);

    if (!result.success) {
      console.error("Validation errors:", result.error.errors);
      return NextResponse.json(
        { error: "Invalid product data", details: result.error.errors },
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
