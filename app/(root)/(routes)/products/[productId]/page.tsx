import { prisma } from "@/lib/prismadb";
import { detailedProductSchema } from "@/types/product";
import { SWRProvider } from "@/components/swr-provider";
import { ProductContent } from "./components/ProductContent";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      brand: true,
      productType: true,
      petType: true,
      petTypes: {
        include: { petType: true },
      },
    },
  });

  if (!product) {
    return <div>Product not found</div>;
  }

  const result = detailedProductSchema.safeParse(product);

  if (!result.success) {
    return <div>Error loading product details</div>;
  }

  return (
    <SWRProvider fallback={{ [`/api/products/${productId}`]: result.data }}>
      <ProductContent />
    </SWRProvider>
  );
}
