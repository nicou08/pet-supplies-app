"use client";

import { ChevronDown } from "lucide-react";

import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ProductListProps {
  products: Product[];
  onMobileFilterChange: (open: boolean) => void;
  isFilterChanging: boolean;
  currentPage: number;
  totalPages: number;
  total: number;
  sortOption: string;
  onPageChange: (page: number) => void;
  onSortChange: (sort: string) => void;
}

const SORT_LABELS: Record<string, string> = {
  price_asc: "Price Low-High",
  price_desc: "Price High-Low",
  rating_desc: "Highest Rated",
};

function buildPageRange(currentPage: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (currentPage - 1 > 2) pages.push("...");

  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    pages.push(i);
  }

  if (currentPage + 1 < totalPages - 1) pages.push("...");

  pages.push(totalPages);

  return pages;
}

export function ProductList({
  products,
  onMobileFilterChange,
  isFilterChanging,
  currentPage,
  totalPages,
  sortOption,
  onPageChange,
  onSortChange,
}: ProductListProps) {
  const sortLabel = SORT_LABELS[sortOption] ?? "Best Match";

  return (
    <div className="px-4 sm:px-0 col-span-4 w-full py-4">
      <div className="flex justify-between">
        <div className="block 2lg:hidden">
          <Button variant="outline" onClick={() => onMobileFilterChange(true)}>
            Filter
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              {sortLabel} <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onSortChange("")}>
              Best Match
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("price_asc")}>
              Price Low-High
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("price_desc")}>
              Price High-Low
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("rating_desc")}>
              Highest Rated
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div
        className={`
          grid
          gap-1
          grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 2lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4
          py-4
          ${isFilterChanging ? "opacity-50 transition-opacity duration-300" : ""}
        `}
      >
        {isFilterChanging
          ? Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-[350px] bg-muted rounded-lg animate-pulse"
              />
            ))
          : products.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center py-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) onPageChange(currentPage - 1);
                  }}
                  aria-disabled={currentPage === 1}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {buildPageRange(currentPage, totalPages).map((item, i) =>
                item === "..." ? (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PaginationLink
                      href="#"
                      isActive={item === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(item as number);
                      }}
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) onPageChange(currentPage + 1);
                  }}
                  aria-disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
