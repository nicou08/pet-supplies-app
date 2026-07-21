"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product } from "@/types/product";
import { ProductCard } from "../../shop/components/ProductCard";

type NewArrivalSort = "newest" | "price_asc" | "price_desc" | "rating";

interface NewArrivalsGridProps {
  // Pre-sorted newest-first by the server query, so "newest" is the identity order.
  products: Product[];
}

const SORT_LABELS: Record<NewArrivalSort, string> = {
  newest: "Newest",
  price_asc: "Price: Low → High",
  price_desc: "Price: High → Low",
  rating: "Top rated",
};

/**
 * Filter (by pet type) + sort toolbar over a responsive `ProductCard` grid. State
 * is held client-side and derived over the prop array with `useMemo` — no effects,
 * no fetching (the recent set ships in full on first paint, already newest-first).
 */
export function NewArrivalsGrid({ products }: NewArrivalsGridProps) {
  const [petFilter, setPetFilter] = useState<string>("all");
  const [sort, setSort] = useState<NewArrivalSort>("newest");

  // Pet-type chips are derived from the products actually present, so we never
  // show a filter that yields nothing. Keyed by `name`; labelled by displayName.
  const petTypes = useMemo(() => {
    const byName = new Map<string, string>();
    for (const product of products) {
      for (const pt of product.petTypes) {
        if (!byName.has(pt.name)) byName.set(pt.name, pt.displayName ?? pt.name);
      }
    }
    return Array.from(byName, ([name, label]) => ({ name, label })).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }, [products]);

  const visible = useMemo(() => {
    const filtered =
      petFilter === "all"
        ? products
        : products.filter((p) => p.petTypes.some((pt) => pt.name === petFilter));

    // "newest" keeps server order (already createdAt desc); others re-sort a copy.
    if (sort === "newest") return filtered;

    const sorted = [...filtered];
    switch (sort) {
      case "price_asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.averageRating - a.averageRating);
        break;
    }
    return sorted;
  }, [products, petFilter, sort]);

  if (products.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center rounded-xl border bg-card px-6 py-16 text-center shadow-sm">
        <Sparkles className="h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
        <h2 className="mt-4 text-xl font-bold">No new arrivals yet</h2>
        <p className="mt-1 text-muted-foreground">
          Check back soon — fresh stock lands regularly.
        </p>
        <Button asChild className="mt-6">
          <Link href="/shop">Browse all products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={petFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setPetFilter("all")}
          >
            All
          </Button>
          {petTypes.map((pt) => (
            <Button
              key={pt.name}
              variant={petFilter === pt.name ? "default" : "outline"}
              size="sm"
              onClick={() => setPetFilter(pt.name)}
            >
              {pt.label}
            </Button>
          ))}
          <span className="ml-1 text-sm text-muted-foreground">
            {visible.length} {visible.length === 1 ? "item" : "items"}
          </span>
        </div>

        <Select
          value={sort}
          onValueChange={(v) => setSort(v as NewArrivalSort)}
        >
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(SORT_LABELS) as NewArrivalSort[]).map((key) => (
              <SelectItem key={key} value={key}>
                {SORT_LABELS[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No products match this filter.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {visible.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 4} />
          ))}
        </div>
      )}
    </div>
  );
}
