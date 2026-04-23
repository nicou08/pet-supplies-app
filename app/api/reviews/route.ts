import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prismadb";
import { createReviewSchema } from "@/types";

export async function GET(request: NextRequest) {
  if (request.method !== "GET") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: { user: { select: { name: true } } },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (request.method !== "POST") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session?.user?.email) {
      console.error("!session.user.email: Unauthorized or invalid session");
      return NextResponse.json(
        { error: "Unauthorized or invalid session" },
        { status: 401 }
      );
    }

    // Find the current user
    const currentUser = await prisma.user.findUnique({
      select: {
        id: true,
      },
      where: {
        email: session.user.email,
      },
    });

    if (!currentUser) {
      console.error("!currentUser: User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();

    // Inject userId from session, not from client
    const dataToValidate = {
      ...body,
      userId: currentUser.id,
    };

    //console.log("Creating review with dataToValidate:", dataToValidate);

    const parsedData = createReviewSchema.safeParse(dataToValidate);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Invalid data format", details: parsedData.error.errors },
        { status: 400 }
      );
    }

    //console.log("Parsed data for review creation:", parsedData.data);

    const { productId, rating, review, userId } = parsedData.data;

    const createdReview = await prisma.review.create({
      data: {
        productId,
        rating,
        review,
        userId,
      },
    });

    // Update product's averageRating and numberOfRatings
    const aggregate = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        averageRating: aggregate._avg.rating || 0,
        numberOfRatings: aggregate._count.rating,
      },
    });

    return NextResponse.json(createdReview, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
