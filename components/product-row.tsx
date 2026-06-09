"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/CartContext";
import { useFeaturedProducts } from "@/hooks/useFeaturedProducts";

interface ProductRowItemProps {
  id: string;
  name: string;
  image: string;
  price: number;
}

export function ProductRowSkeleton({ title = "Featured" }: { title?: string }) {
  return (
    <div className="bg-zinc-300 w-full rounded-lg h-auto pb-4">
      <div className="text-2xl sm:text-3xl font-medium py-5 px-5 text-gray-800">
        {title}
      </div>
      <div className="flex flex-row gap-3 sm:gap-4 overflow-x-auto px-2 sm:px-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-[17rem] w-[160px] sm:h-[19.5rem] sm:w-[200px] flex-shrink-0 bg-white rounded-lg shadow"
          >
            <Skeleton className="w-full h-36 sm:h-44 rounded-b-none bg-zinc-200" />
            <div className="px-2 sm:px-3 mt-3 flex flex-col gap-2">
              <Skeleton className="h-4 w-4/5 bg-zinc-200" />
              <Skeleton className="h-5 w-2/5 bg-zinc-200" />
              <Skeleton className="h-8 w-full rounded-full mt-1 bg-zinc-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductRowItem({ id, name, image, price }: ProductRowItemProps) {
  const { addToCart } = useCart();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, name, price, quantity: 1, imageUrl: image });
  };

  return (
    <Link href={`/products/${id}`} className="block h-full">
      <Card className="h-[17rem] w-[160px] sm:h-[19.5rem] sm:w-[200px] flex-shrink-0 flex flex-col overflow-hidden bg-white rounded-lg shadow cursor-pointer transition hover:shadow-lg">
        <div className="relative w-full h-36 sm:h-44 flex-shrink-0 flex justify-center items-center pt-3 px-2 overflow-hidden">
          {!isImageLoaded && (
            <Skeleton className="absolute inset-0 rounded-b-none bg-zinc-200" />
          )}
          <Image
            src={image}
            alt={name}
            width={150}
            height={150}
            onLoad={() => setIsImageLoaded(true)}
            onError={() => setIsImageLoaded(true)}
            className={`object-contain h-full w-full rounded-sm transition-opacity duration-300 ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
        <div className="w-full px-2 sm:px-3 mt-1 flex-1 flex flex-col">
          <div className="font-normal text-stone-950 text-left text-sm sm:text-base line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
            {name}
          </div>
          <div className="font-bold text-black pt-1 text-base sm:text-lg flex justify-start">
            ${price}
          </div>
          <div className="pt-1 mt-auto pb-1">
            <Button
              onClick={handleAddToCart}
              className="w-full h-8 bg-yellow-300 hover:bg-yellow-100 text-stone-950 rounded-full py-5 text-xs sm:text-base"
              tabIndex={-1}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function ProductRow() {
  const { products, isLoading } = useFeaturedProducts();

  if (isLoading) return <ProductRowSkeleton />;

  return (
    <div className="bg-zinc-300 w-full rounded-lg h-auto pb-4">
      <div className="text-2xl sm:text-3xl font-medium py-5 px-5 text-gray-800">
        Featured
      </div>
      <div className="flex flex-row gap-3 sm:gap-4 overflow-x-auto px-2 pb-3 sm:px-5">
        {products.length === 0 ? (
          <div className="text-gray-700 px-5 py-6">No featured products.</div>
        ) : (
          products.map((p) => (
            <ProductRowItem
              key={p.id}
              id={p.id}
              name={p.name}
              image={p.mainImageUrl}
              price={p.price}
            />
          ))
        )}
      </div>
    </div>
  );
}
