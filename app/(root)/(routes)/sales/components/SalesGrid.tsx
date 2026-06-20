"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product, Sale } from "@/types/product";
import { ProductCard } from "../../shop/components/ProductCard";

type SaleFilter = "all" | "PERCENTAGE" | "BUY_X_GET_Y";
type SaleSort = "discount" | "price_asc" | "price_desc" | "rating";

interface SalesGridProps {
  products: Product[];
}

const FILTERS: { value: SaleFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "PERCENTAGE", label: "% Off" },
  { value: "BUY_X_GET_Y", label: "Buy X Get Y" },
];

const SORT_LABELS: Record<SaleSort, string> = {
  discount: "Biggest discount",
  price_asc: "Price: Low → High",
  price_desc: "Price: High → Low",
  rating: "Top rated",
};

/**
 * Effective discount as a percent, used ONLY for ordering ("Biggest discount").
 * PERCENTAGE → its percentOff; BOGO → free / (buy + free) as a percent so the
 * two sale types are comparable. This never displays money — all prices/badges
 * flow through lib/pricing.ts via ProductCard.
 */
function effectiveDiscountPct(sale: Sale | null | undefined): number {
  if (!sale) return 0;
  if (sale.type === "PERCENTAGE") return sale.percentOff ?? 0;
  const buy = sale.buyQuantity ?? 0;
  const free = sale.freeQuantity ?? 0;
  return buy + free > 0 ? Math.round((free / (buy + free)) * 100) : 0;
}

/**
 * Filter/sort toolbar + responsive ProductCard grid for the sales page. State is
 * held client-side and derived over the prop array with useMemo — no effects, no
 * fetching (the curated sale set ships in full on first paint).
 */
export function SalesGrid({ products }: SalesGridProps) {
  const [filter, setFilter] = useState<SaleFilter>("all");
  const [sort, setSort] = useState<SaleSort>("discount");

  const visible = useMemo(() => {
    const filtered =
      filter === "all"
        ? products
        : products.filter((p) => p.sale?.type === filter);

    const sorted = [...filtered];
    switch (sort) {
      case "discount":
        sorted.sort(
          (a, b) => effectiveDiscountPct(b.sale) - effectiveDiscountPct(a.sale)
        );
        break;
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
  }, [products, filter, sort]);

  if (products.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center rounded-xl border bg-card px-6 py-16 text-center shadow-sm">
        <Tag className="h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
        <h2 className="mt-4 text-xl font-bold">No deals right now</h2>
        <p className="mt-1 text-muted-foreground">
          Check back soon — new sales drop regularly.
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
          {FILTERS.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
          <span className="ml-1 text-sm text-muted-foreground">
            {visible.length} {visible.length === 1 ? "deal" : "deals"}
          </span>
        </div>

        <Select value={sort} onValueChange={(v) => setSort(v as SaleSort)}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(SORT_LABELS) as SaleSort[]).map((key) => (
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
          No deals match this filter.
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
