"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, StarHalf } from "lucide-react";

import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * Props for the ProductCard component.
 */
interface ProductCardProps {
  product: Product;
}

/**
 * The ProductCard component is responsible for rendering a product card
 * with an image, name, brand, rating, price, and stock status.
 *
 * @param {ProductCardProps} props - The props for the ProductCard component.
 * @returns The rendered ProductCard component.
 */

export function ProductCard({ product }: ProductCardProps) {
  const fullStars = Math.floor(product.averageRating);
  const hasHalfStar = product.averageRating % 1 !== 0;
  //bg-[#e1e1e1] dark:bg-neutral-950
  return (
    <Link href={`/products/${product.id}`}>
      <div className="pb-4 overflow-hidden max-h-[390px]">
        <div className="relative">
          <Image
            width={500}
            height={500}
            src={product.mainImageUrl || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-64 object-cover"
          />
          {product.offersType === "On Sale" && (
            <Badge className="absolute top-3 left-3 bg-white text-black rounded-full">
              {product.offersType}
            </Badge>
          )}
        </div>
        <div className="px-4 py-2">
          <h3 className="font-bold text-lg">{product.name}</h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {product.brand.name}
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: fullStars }, (_, i) => (
              <Star
                key={i}
                strokeWidth={0}
                className="w-4 h-4 text-yellow-400 fill-current"
              />
            ))}
            {hasHalfStar && (
              <StarHalf
                strokeWidth={0}
                className="w-4 h-4 text-yellow-400 fill-current"
              />
            )}
            <div className="text-sm">{product.averageRating.toFixed(1)}</div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl font-bold">
              ${product.price.toFixed(2)}
            </span>
            {!product.inStock && (
              <Badge variant={product.inStock ? "default" : "secondary"}>
                {product.inStock ? "In Stock" : "Sold out"}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
