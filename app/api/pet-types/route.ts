import { NextResponse } from "next/server";

import { prisma } from "@/lib/prismadb";

export async function GET(request: Request) {
  if (request.method !== "GET") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    const petTypes = await prisma.petType.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json({ petTypes });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
