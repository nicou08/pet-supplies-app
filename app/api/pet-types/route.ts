import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "@/lib/prismadb";

export async function GET(request: NextRequest) {
  if (request.method !== "GET") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    // Parse the query parameters from the request URL
    const searchParams = request.nextUrl.searchParams;
    const petName = searchParams.get("name");

    if (petName) {
      // Fetch a specific pet type by name
      //console.log("ROUTE HANDLER: Fetching pet type by name:", petName);
      const petType = await prisma.petType.findFirst({
        where: {
          name: petName,
        },
        select: {
          id: true,
          name: true,
          displayName: true,
        },
      });

      if (!petType) {
        return NextResponse.json(
          { error: `Pet type with name "${petName}" not found` },
          { status: 404 }
        );
      }

      console.log("ROUTE HANDLER: Fetched pet type from database:", petType);
      console.log("ROUTE HANDLER: Fetched pet id from database:", petType.id);

      return NextResponse.json(petType, { status: 200 });
    }

    // If no name is provided, return all pet types
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
