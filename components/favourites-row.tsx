"use client";

import { ProductRowItem, ProductRowSkeleton } from "@/components/product-row";
import { useFavourites } from "@/hooks/useFavourites";

export function FavouritesRow() {
  const { favourites, isLoading } = useFavourites();

  if (isLoading) return <ProductRowSkeleton title="My Favourites" />;
  if (favourites.length === 0) return null; // hide for guests / empty

  return (
    <div className="bg-zinc-300 w-full rounded-lg h-auto pb-4">
      <div className="text-2xl sm:text-3xl font-medium py-5 px-5 text-gray-800">
        My Favourites
      </div>
      <div className="flex flex-row gap-3 sm:gap-4 overflow-x-auto px-2 pb-3 sm:px-5">
        {favourites.map((p) => (
          <ProductRowItem
            key={p.id}
            id={p.id}
            name={p.name}
            image={p.mainImageUrl}
            price={p.price}
          />
        ))}
      </div>
    </div>
  );
}
