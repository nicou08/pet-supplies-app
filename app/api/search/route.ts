import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "@/lib/prismadb";

export async function GET(request: NextRequest) {
  try {
    // 1. Method check
    if (request.method !== "GET") {
      return NextResponse.json(
        { error: "Method Not Allowed" },
        { status: 405 }
      );
    }

    // 2. Get search query from URL
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();

    if (!q) {
      return NextResponse.json({ results: [] });
    }

    console.log("Search query:", q);

    // 3. Basic search: find products where name or description contains the query
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 7, // Limit results
      select: {
        id: true,
        name: true,
        mainImageUrl: true,
        price: true,
      },
    });

    console.log("Search results:", products);

    if (products.length === 0) {
      return NextResponse.json([]);
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error occurred during search:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
