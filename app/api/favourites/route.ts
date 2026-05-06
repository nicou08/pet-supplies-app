import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prismadb";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already favourited
    const existing = await prisma.favourite.findUnique({
      where: { userId_productId: { userId: user.id, productId } },
    });

    if (existing) {
      // Remove from favourites
      await prisma.favourite.delete({
        where: { userId_productId: { userId: user.id, productId } },
      });
      return NextResponse.json({ favourited: false });
    } else {
      // Add to favourites
      await prisma.favourite.create({
        data: { userId: user.id, productId },
      });
      return NextResponse.json({ favourited: true });
    }
  } catch (error) {
    console.error("Error toggling favourite:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.email) {
    return NextResponse.json({ favourited: false });
  }
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  if (!productId) return NextResponse.json({ favourited: false });

  console.log("GET FAVOURITES");
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) return NextResponse.json({ favourited: false });

  const fav = await prisma.favourite.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  });
  return NextResponse.json({ favourited: !!fav });
}
