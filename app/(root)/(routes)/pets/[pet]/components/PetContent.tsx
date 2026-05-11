"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Utensils,
  PillBottle,
  Link2,
  Container,
  BedDouble,
  Toilet,
  ToyBrick,
  Settings,
  Fish,
  Tent,
  PawPrint,
} from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { usePetProducts } from "@/hooks/usePetProducts";
import { Product } from "@/types/product";

type PetContentProps = {
  petId: string;
};

type PetProductType = Product["productType"] & {
  displayName?: string;
  icon?: string;
  description?: string;
};

type PetProduct = Omit<Product, "productType"> & {
  productType?: PetProductType;
};

type ProductTypeSummary = {
  id: string;
  name: string;
  displayName: string;
  icon?: string;
  description?: string;
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  utensils: Utensils,
  capsule: PillBottle,
  "link-2": Link2,
  container: Container,
  "bed-double": BedDouble,
  toilet: Toilet,
  "toy-brick": ToyBrick,
  tool: Settings,
  fish: Fish,
  tent: Tent,
  pawprint: PawPrint,
};

export function PetContent({ petId }: PetContentProps) {
  const {
    products,
    isLoading: petProductsLoading,
    isError: petProductsError,
  } = usePetProducts(petId);

  const typedProducts = useMemo(
    () => (products ?? []) as PetProduct[],
    [products]
  );

  const productsByType = useMemo(() => {
    return typedProducts.reduce<Record<string, PetProduct[]>>((acc, product) => {
      const typeKey = product.productType?.name ?? "Other";
      (acc[typeKey] ||= []).push(product);
      return acc;
    }, {});
  }, [typedProducts]);

  const productTypes = useMemo(() => {
    const map = new Map<string, ProductTypeSummary>();

    typedProducts.forEach((product) => {
      const productType = product.productType;
      if (productType && !map.has(productType.id)) {
        map.set(productType.id, {
          id: productType.id,
          name: productType.name,
          displayName: productType.displayName ?? productType.name,
          icon: productType.icon,
          description: productType.description,
        });
      }
    });

    return Array.from(map.values());
  }, [typedProducts]);

  const productTypeNames = useMemo(
    () => Object.keys(productsByType),
    [productsByType]
  );

  if (petProductsLoading) {
    return <div className="text-3xl text-center py-10">Loading...</div>;
  }

  if (petProductsError) {
    return (
      <div className="text-3xl text-center py-10 text-red-600">
        Failed to load products.
      </div>
    );
  }

  if (typedProducts.length === 0) {
    return (
      <div className="text-3xl text-center py-10 text-muted-foreground">
        No products available for this pet.
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      <h2 className="text-lg md:text-2xl font-semibold text-center mb-6">
        Shop by Categories
      </h2>

      <div className="flex justify-center">
        <Tabs defaultValue={productTypeNames[0]} className="w-full">
          <TabsList className="w-full flex justify-center bg-transparent mb-10 h-auto">
            <div
              className="
                relative w-full -mx-4 px-4 pb-5 pt-2
                overflow-x-auto
                scroll-smooth
                scrollbar-thin
                [&::-webkit-scrollbar]:h-2
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-neutral-300
                dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700
              "
            >
              <div
                className="
                  flex flex-nowrap gap-4 w-max mx-auto
                  snap-x snap-mandatory
                  scroll-px-4
                "
              >
                {productTypes.map((productType) => {
                  const IconComponent =
                    (productType.icon && iconMap[productType.icon]) || PawPrint;

                  return (
                    <TabsTrigger
                      key={productType.id}
                      value={productType.name}
                      className="
                        flex-none
                        w-40 md:w-48
                        snap-start
                        flex flex-col items-center
                        p-3 md:p-4 rounded-xl cursor-pointer transition-all
                        data-[state=active]:ring-2 data-[state=active]:ring-blue-500
                        data-[state=active]:bg-stone-100 dark:data-[state=active]:bg-stone-950
                        bg-stone-100 dark:bg-stone-800 hover:shadow-md
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                      "
                    >
                      <IconComponent className="w-7 h-7 md:w-8 md:h-8" />
                      <h3 className="font-bold text-xs md:text-sm mt-2 text-center line-clamp-2">
                        {productType.displayName}
                      </h3>
                      <p className="hidden md:block text-xs mt-1 dark:data-[state=inactive]:text-gray-500 dark:data-[state=active]:text-white line-clamp-2">
                        {productType.description}
                      </p>
                    </TabsTrigger>
                  );
                })}
              </div>
            </div>
          </TabsList>
          {productTypeNames.map((type) => (
            <TabsContent key={type} value={type} className="w-full">
              <div
                className="
                  grid
                  gap-1
                  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
                "
              >
                {productsByType[type].map((product) => (
                  <div
                    key={product.id}
                    className="
                      bg-card
                      rounded-lg shadow
                      flex flex-col items-start
                      px-2
                      overflow-hidden
                      transition
                      pb-4
                    "
                  >
                    <div className="flex justify-center w-full">
                      <Image
                        src={product.mainImageUrl || "/placeholder.svg"}
                        alt={product.name}
                        width={192}
                        height={192}
                        className="w-28 h-28 sm:w-48 sm:h-48 object-contain mb-2"
                      />
                    </div>
                    <div className="font-bold text-sm sm:text-base mb-1 text-center line-clamp-2">
                      {product.name}
                    </div>
                    <div className="text-muted-foreground mb-1 text-center text-xs">
                      {product.brand?.name}
                    </div>

                    <div className="font-semibold text-base sm:text-lg mb-2">
                      ${product.price?.toFixed(2)}
                    </div>
                    <Link
                      href={`/products/${product.id}`}
                      className="mt-auto px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-xs"
                    >
                      View Product
                    </Link>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
