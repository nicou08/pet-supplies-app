"use client";

import { useState, useEffect } from "react";

import { usePetTypes } from "@/hooks/usePetTypes";
import { useProductTypes } from "@/hooks/useProductTypes";
import Loading from "../loading";
import { FilterSideBar } from "./FilterSideBar";
import { ProductList } from "./ProductList";

type FilterState = {
  petType: string[];
  productType: string[];
  offersType: string[];
  priceRange: number[];
  inStock: boolean;
};

type FilterType = keyof FilterState;

const offers = [
  { id: "on-sale", label: "On Sale" },
  { id: "new-arrivals", label: "New Arrivals" },
  { id: "clearance", label: "Clearance" },
];

export function ShopContent() {
  const {
    petTypes: petTypes,
    isLoading: isPetTypesLoading,
    isError: isPetTypesError,
  } = usePetTypes();
  const {
    productTypes: productTypes,
    isLoading: isProductTypesLoading,
    isError: isProductTypesError,
  } = useProductTypes();

  const [filters, setFilters] = useState<FilterState>({
    petType: [],
    productType: [],
    offersType: offers.map((offer) => offer.label),
    priceRange: [0, 500],
    inStock: false,
  });

  const [currentlySelectedFilters, setCurrentlySelectedFilters] =
    useState<FilterState>({
      petType: [],
      productType: [],
      offersType: [],
      priceRange: [0, 500],
      inStock: false,
    });

  useEffect(() => {
    if (petTypes && productTypes) {
      if (
        Array.isArray(petTypes.petTypes) &&
        Array.isArray(productTypes.productTypes)
      ) {
        //console.log("petTypes array:", petTypes.petTypes);
        //console.log("productTypes array:", productTypes.productTypes);

        const newFilters = {
          petType: petTypes.petTypes.map(
            (type: { id: string; name: string }) => {
              return type.name;
            }
          ),
          productType: productTypes.productTypes.map(
            (type: { id: string; name: string }) => {
              return type.name;
            }
          ),
          offersType: offers.map((offer) => offer.label),
          priceRange: [0, 500],
          inStock: false,
        };

        setFilters(newFilters);
      }
    }
  }, [petTypes, productTypes]);

  // Handle Filter Change
  const handleFilterChange = (
    filterType: FilterType,
    value: string[] | number[] | boolean
  ) => {
    setCurrentlySelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  if (isPetTypesLoading || isProductTypesLoading) {
    return <Loading />;
  }

  if (isPetTypesError || isProductTypesError) {
    return <div>Error loading </div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4 border-t border-x border-neutral-700">
      <FilterSideBar
        filters={filters}
        onFilterChange={handleFilterChange}
        currentlySelectedFilters={currentlySelectedFilters}
      />
      <ProductList filters={filters} />
    </div>
  );
}
