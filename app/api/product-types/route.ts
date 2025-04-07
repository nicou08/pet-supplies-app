import { NextResponse } from "next/server";

import { prisma } from "@/lib/prismadb";

export async function GET(request: Request) {
  if (request.method !== "GET") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    const productTypes = await prisma.productType.findMany({
      select: {
        id: true,
        name: true,
        displayName: true,
      },
    });

    return NextResponse.json({ productTypes });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
