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
    <Link href={`/products/${product.id}`} className="block h-full">
      <div className="flex flex-col h-[350px] bg-stone-100 dark:bg-neutral-950 rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden mb-5">
        {/* Image */}
        <div className="relative w-full h-48 bg-white dark:bg-neutral-900 flex-shrink-0">
          <Image
            src={product.mainImageUrl || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 400px"
            priority={false}
          />
          {product.offersType === "On Sale" && (
            <Badge className="absolute top-3 left-3 bg-white text-black rounded-full shadow">
              {product.offersType}
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 px-4 py-2">
          {/* Title */}
          <h3
            className="font-bold text-lg leading-5 mb-1 line-clamp-2"
            title={product.name}
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.name}
          </h3>
          {/* Brand */}
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">
            {product.brand.name}
          </div>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
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
          {/* Spacer */}
          <div className="flex-1" />
          {/* Price & Stock */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-2xl font-bold">
              ${product.price.toFixed(2)}
            </span>
            <Badge variant={product.inStock ? "default" : "secondary"}>
              {product.inStock ? "In Stock" : "Sold out"}
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}
