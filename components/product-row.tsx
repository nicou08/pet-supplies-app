"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
//import { headers } from "next/headers";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCart } from "@/context/CartContext";

interface ProductRowItemProps {
  id: string;
  name: string;
  image: string;
  price: number;
}

function ProductRowItem({ id, name, image, price }: ProductRowItemProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Add to cart clicked");
    addToCart({
      id,
      name,
      price,
      quantity: 1,
      imageUrl: image,
    });
  };

  return (
    <Link href={`/products/${id}`} className="block h-full">
      <Card className="h-64 w-[160px] sm:h-72 sm:w-[200px] flex-shrink-0 bg-white rounded-lg shadow cursor-pointer transition hover:shadow-lg">
        <div className="w-full h-36 sm:h-44 flex justify-center items-center pt-3 px-2 overflow-hidden">
          <Image
            src={image}
            alt={name}
            width={150}
            height={150}
            className="object-contain h-full w-full rounded-sm"
          />
        </div>
        <div className="w-full px-2 sm:px-3 mt-1 flex-1 flex flex-col justify-between">
          <div className="font-normal text-stone-950 flex justify-start text-sm sm:text-base">
            {name}
          </div>
          <div className="font-bold text-black pt-1 text-base sm:text-lg flex justify-start">
            ${price}
          </div>
          <div className="pt-1">
            <Button
              onClick={handleAddToCart}
              className="w-full h-8 bg-yellow-300 hover:bg-yellow-100 text-stone-950 rounded-full py-5 text-xs sm:text-base"
              tabIndex={-1} // Prevents button from being focused when card is focused
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
  const [items, setItems] = useState<ProductRowItemProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        // Get protocol and host for absolute URL
        // const host = (await headers()).get("host");
        // const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
        // const url = `${protocol}://${host}/api/products?isFeatured=true`;

        // console.log("Fetching featured products from:", url);

        const res = await fetch("/api/products?isFeatured=true", {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to load featured products");
        const data = (await res.json()) as Array<{
          id: string;
          name: string;
          price: number;
          mainImageUrl: string;
        }>;
        if (!cancelled) {
          setItems(
            data.map((p) => ({
              id: p.id,
              name: p.name,
              image: p.mainImageUrl,
              price: p.price,
            }))
          );
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    console.log("Featured items:", items);
  }, [items]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-zinc-300 w-full rounded-lg h-auto pb-4">
      <div className="text-2xl sm:text-3xl font-medium py-5 px-5  text-gray-800">
        Featured
      </div>
      <div className="flex flex-row gap-3 sm:gap-4 overflow-x-auto px-2 sm:px-5">
        {loading ? (
          <div className="text-gray-700 px-5 py-6">Loading…</div>
        ) : items.length === 0 ? (
          <div className="text-gray-700 px-5 py-6">No featured products.</div>
        ) : (
          items.map((p) => (
            <ProductRowItem
              key={p.id}
              id={p.id}
              name={p.name}
              image={p.image}
              price={p.price}
            />
          ))
        )}
      </div>
    </div>
  );
}
