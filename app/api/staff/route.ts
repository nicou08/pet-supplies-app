import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "@/lib/prismadb";

export async function GET(request: NextRequest) {
  if (request.method !== "GET") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    const staff = await prisma.staff.findMany({
      select: {
        id: true,
        name: true,
        role: true,
      },
    });

    if (!staff) {
      return NextResponse.json({ error: "No staff found" }, { status: 404 });
    }

    //console.log("Fetched staff from database triggered!!!!!!!!!!");

    return NextResponse.json(staff, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
