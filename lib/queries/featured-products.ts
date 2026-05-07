import { prisma } from "@/lib/prismadb";

export function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isFeatured: true },
    select: { id: true, name: true, price: true, mainImageUrl: true },
    orderBy: { createdAt: "desc" },
    take: 7,
  });
}
