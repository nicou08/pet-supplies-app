import { useState } from "react";
import Image from "next/image";
import { z } from "zod";
import { Star, StarHalf, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";

const productCardSchema = z.object({
  image: z.string().url(), // product image URL
  name: z.string().min(1), // product name with at least 1 character
  description: z.string().optional(), // product description (optional)
  price: z.number().positive(), // product price (must be a positive number)
  rating: z.number().min(0).max(5), // product rating (between 0 and 5)
});

type ProductCardValues = z.infer<typeof productCardSchema>;

interface ProductCardProps {
  product: ProductCardValues;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border p-4 rounded-md shadow-md">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md"
      />
      <div className="mt-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600">{product.description}</p>
        <div className="mt-2 text-xl font-bold">${product.price}</div>
        <Button className="mt-4 w-full">Add to Cart</Button>
      </div>
    </div>
  );
}

export function ProductCard2({ product }: ProductCardProps) {
  return (
    <div className="flex border p-4 rounded-md shadow-md">
      <img
        src={product.image}
        alt={product.name}
        className="w-1/3 h-48 object-cover rounded-md"
      />
      <div className="ml-4 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-gray-600">{product.description}</p>
        </div>
        <div>
          <div className="mt-2 text-xl font-bold">${product.price}</div>
          <Button className="mt-4 w-full">Add to Cart</Button>
        </div>
      </div>
    </div>
  );
}

export function ProductCard3({ product }: ProductCardProps) {
  const fullStars = Math.floor(product.rating);
  const hasHalfStar = product.rating % 1 !== 0;

  return (
    <div className="border p-4 rounded-md shadow-md">
      <Image
        width={500}
        height={500}
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md"
      />
      <div className="mt-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600">{product.description}</p>
        <div className="flex items-center mt-2">
          <div className="relative">
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  strokeWidth={1}
                  className="w-5 h-5 text-gray-300"
                />
              ))}
            </div>
            <div className="flex gap-1 absolute top-0">
              {Array.from({ length: fullStars }, (_, i) => (
                <Star
                  key={i}
                  fill="yellow"
                  strokeWidth={0}
                  className="w-5 h-5"
                />
              ))}
              {hasHalfStar && (
                <StarHalf fill="yellow" strokeWidth={0} className="w-5 h-5" />
              )}
            </div>
          </div>
          <span className="ml-2 text-gray-600">({product.rating})</span>
        </div>
        <div className="mt-2 text-xl font-bold">${product.price}</div>
        <Button className="mt-4 w-full">Add to Cart</Button>
      </div>
    </div>
  );
}
