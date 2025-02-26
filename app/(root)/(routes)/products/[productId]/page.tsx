"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useProduct } from "@/hooks/useProduct";
import { useCart } from "@/context/CartContext";

export default function ProductDetailsPage() {
  const params = useParams<{ productId: string }>();

  const { product, isLoading, isError } = useProduct(params.productId);

  const { addToCart } = useCart();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !product) {
    return <div>Error loading product details</div>;
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.mainImageUrl,
    });
  };

  return (
    <div className="bg-red-300">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Image
            src="/placeholder-1.svg"
            alt={product.name}
            width={500}
            height={500}
          />
        </div>
        <div>
          <div>{product.name}</div>
          <div>{product.brand.name}</div>
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.averageRating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">123 reviews</span>
          </div>
          <div>${product.price.toFixed(2)}</div>
          <div>{product.description}</div>
          <Button className="w-full" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
