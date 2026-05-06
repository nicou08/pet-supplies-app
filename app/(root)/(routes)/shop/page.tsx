import { prisma } from "@/lib/prismadb";
import { ShopContent } from "./components/ShopContent";
import { SWRProvider } from "@/components/swr-provider";

export default async function ShopPage() {
  const [petTypes, productTypes, rawProducts] = await Promise.all([
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
        brand: {
          select: { id: true, name: true },
        },
        productType: {
          select: { id: true, name: true },
        },
        petTypes: {
          select: {
            petType: { select: { id: true, name: true, displayName: true } },
          },
        },
      },
    }),
  ]);

  const products = rawProducts.map((product) => ({
    ...product,
    petTypes: product.petTypes.map((pt) => pt.petType),
  }));

  return (
    <SWRProvider
      fallback={{
        "/api/pet-types": petTypes,
        "/api/product-types": productTypes,
        "/api/products": products,
      }}
    >
      <div className="min-h-[calc(100%-145px)] flex-1">
        <ShopContent />
      </div>
    </SWRProvider>
  );
}
