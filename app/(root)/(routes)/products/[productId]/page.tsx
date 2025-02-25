"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

import { useProduct } from "@/hooks/useProduct";

export default function ProductDetailsPage() {
  const params = useParams<{ productId: string }>();

  const { product, isLoading, isError } = useProduct(params.productId);
  return (
    <div className="bg-red-300">
      <div className="grid md:grid-cols-2 gap-8">
        Product details {product?.name}
      </div>
    </div>
  );
}
