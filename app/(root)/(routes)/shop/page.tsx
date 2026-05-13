import { prisma } from "@/lib/prismadb";
import { ShopContent } from "./components/ShopContent";
import { SWRProvider } from "@/components/swr-provider";
import { PaginatedProducts } from "@/types/product";

const LIMIT = 24;

export default async function ShopPage() {
  const [petTypes, productTypes, rawProducts, total] = await Promise.all([
    prisma.petType.findMany({
      select: { id: true, name: true, displayName: true },
    }),
    prisma.productType.findMany({
      select: { id: true, name: true, displayName: true },
    }),
    prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        mainImageUrl: true,
        offersType: true,
        inStock: true,
        averageRating: true,
        brand: { select: { id: true, name: true } },
        productType: { select: { id: true, name: true } },
        petTypes: {
          select: {
            petType: { select: { id: true, name: true, displayName: true } },
          },
        },
      },
      take: LIMIT,
      skip: 0,
    }),
    prisma.product.count(),
  ]);

  const products = rawProducts.map((product) => ({
    ...product,
    petTypes: product.petTypes.map((pt) => ({
      ...pt.petType,
      displayName: pt.petType.displayName ?? undefined,
    })),
  }));

  const seedData: PaginatedProducts = {
    items: products,
    total,
    page: 1,
    limit: LIMIT,
    totalPages: Math.ceil(total / LIMIT),
  };

  return (
    <SWRProvider
      fallback={{
        "/api/pet-types": petTypes,
        "/api/product-types": productTypes,
        "/api/products?page=1&limit=24": seedData,
      }}
    >
      <div className="min-h-[calc(100%-145px)] flex-1">
        <ShopContent />
      </div>
    </SWRProvider>
  );
}
