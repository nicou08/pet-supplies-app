"use client";

import { Suspense, useState, useEffect } from "react";

import { usePetTypes } from "@/hooks/usePetTypes";
import { useProductTypes } from "@/hooks/useProductTypes";
import Loading from "../loading";
import { FilterSideBar } from "./FilterSideBar";
import { ProductList } from "./ProductList";

type FilterState = {
  petType: string[];
  productType: string[];
};

type FilterType = keyof FilterState;

export function ShopContent() {
  const {
    petTypes,
    isLoading: isPetTypesLoading,
    isError: isPetTypesError,
  } = usePetTypes();
  const {
    productTypes,
    isLoading: isProductTypesLoading,
    isError: isProductTypesError,
  } = useProductTypes();

  const [filters, setFilters] = useState<FilterState>({
    petType: [],
    productType: [],
  });

  useEffect(() => {
    if (Array.isArray(petTypes) && Array.isArray(productTypes)) {
      setFilters({
        petType: petTypes.map((type) => type.name),
        productType: productTypes.map((type) => type.name),
      });
    }
  }, [petTypes, productTypes]);

  const handleFilterChange = (filterType: FilterType, value: string[]) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  if (isPetTypesLoading || isProductTypesLoading) {
    return <Loading />;
  }

  if (isPetTypesError || isProductTypesError) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <FilterSideBar filters={filters} onFilterChange={handleFilterChange} />
      <Suspense fallback={<Loading />}>
        <ProductList filters={filters} />
      </Suspense>
    </div>
  );
}
