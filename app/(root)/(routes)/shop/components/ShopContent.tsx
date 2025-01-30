"use client";

import { Suspense, useState } from "react";
import Loading from "../loading";
import { FilterSideBar } from "./FilterSideBar";
import { ProductList } from "./ProductList";

type FilterState = {
  petType: string[];
  productType: string[];
};

type FilterType = keyof FilterState;

export function ShopContent() {
  const [filters, setFilters] = useState<FilterState>({
    petType: [],
    productType: [],
  });

  const handleFilterChange = (filterType: FilterType, value: string[]) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <FilterSideBar filters={filters} onFilterChange={handleFilterChange} />
      <Suspense fallback={<Loading />}>
        <ProductList filters={filters} />
      </Suspense>
    </div>
  );
}
