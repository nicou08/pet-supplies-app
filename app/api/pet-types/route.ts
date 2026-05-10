import { NextResponse, type NextRequest } from "next/server";

import {
  getAllPetTypes,
  getPetTypeByName,
  getTopPetTypes,
} from "@/lib/queries/pet-types";

export async function GET(request: NextRequest) {
  if (request.method !== "GET") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const petName = searchParams.get("name");

    if (petName) {
      const petType = await getPetTypeByName(petName);
      if (!petType) {
        return NextResponse.json(
          { error: `Pet type with name "${petName}" not found` },
          { status: 404 }
        );
      }
      return NextResponse.json(petType, { status: 200 });
    }

    const top = searchParams.get("top");
    if (top) {
      const topCount = parseInt(top, 10) || 6;
      const petTypes = await getTopPetTypes(topCount);
      return NextResponse.json(petTypes, { status: 200 });
    }

    const petTypes = await getAllPetTypes();
    return NextResponse.json(petTypes, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
