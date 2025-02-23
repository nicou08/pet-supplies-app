"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type FilterState = {
  petType: string[];
  productType: string[];
  offersType: string[];
  brandsType: string[];
  priceRange: number[];
  inStock: boolean;
};

interface ProductListProps {
  filters: FilterState;
  products: Product[];
}

export function ProductList({ filters, products }: ProductListProps) {
  const [sortOption, setSortOption] = useState("Best Match");

  const filteredProducts = (products || []).filter((product) => {
    const matchesPetType = filters.petType.length
      ? filters.petType.includes(product.petType.name)
      : true;
    const matchesProductType = filters.productType.length
      ? filters.productType.includes(product.productType.name)
      : true;
    const matchesOffersType = filters.offersType.length
      ? product.offersType !== null &&
        filters.offersType.includes(product.offersType)
      : true;
    const matchesBrandsType = filters.brandsType.length
      ? filters.brandsType.includes(product.brand.name)
      : true;
    const matchesPriceRange =
      product.price >= filters.priceRange[0] &&
      product.price <= filters.priceRange[1];
    const matchesInStock = filters.inStock ? product.inStock : true;

    return (
      matchesPetType &&
      matchesProductType &&
      matchesOffersType &&
      matchesBrandsType &&
      matchesPriceRange &&
      matchesInStock
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "Price Low-High":
        return a.price - b.price;
      case "Price High-Low":
        return b.price - a.price;
      case "Highest Rated":
        return b.averageRating - a.averageRating;
      default:
        return 0; // Best Match (default order)
    }
  });

  return (
    <div className="col-span-4 w-full py-4">
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              {sortOption} <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSortOption("Best Match")}>
              Best Match
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption("Price Low-High")}>
              Price Low-High
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption("Price High-Low")}>
              Price High-Low
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOption("Highest Rated")}>
              Highest Rated
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
        {sortedProducts.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
}
