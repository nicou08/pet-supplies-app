"use client";

import { useState, useEffect } from "react";

import { usePetTypes } from "@/hooks/usePetTypes";
import { useProductTypes } from "@/hooks/useProductTypes";
import { useProducts } from "@/hooks/useProducts";
import Loading from "../loading";
import { FilterSideBar } from "./FilterSideBar";
import { ProductList } from "./ProductList";
import { offers, brands, dummyProducts } from "@/constants";

/**
 * Type definition for the filter state.
 */
type FilterState = {
  petType: string[];
  productType: string[];
  offersType: string[];
  brandsType: string[];
  priceRange: number[];
  inStock: boolean;
};

/**
 * Type definition for the filter type keys.
 */
type FilterType = keyof FilterState;

/**
 * The ShopContent component is responsible for rendering the shop page content,
 * including the filter sidebar and the product list.
 *
 */
export function ShopContent() {
  // Fetch pet types using the custom hook
  const {
    petTypes,
    isLoading: isPetTypesLoading,
    isError: isPetTypesError,
  } = usePetTypes();

  // Fetch product types using the custom hook
  const {
    productTypes,
    isLoading: isProductTypesLoading,
    isError: isProductTypesError,
  } = useProductTypes();

  // Fetch products using the custom hook
  const {
    products,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useProducts();

  useEffect(() => {
    if (products) {
      console.log("SHOPCONTENT Fetched products from database:", products);
    }
  }, [products]);

  // State for storing the filter options
  const [filters, setFilters] = useState<FilterState>({
    petType: [],
    productType: [],
    offersType: offers.map((offer) => offer.label),
    brandsType: brands.map((brand) => brand.label),
    priceRange: [0, 500],
    inStock: false,
  });

  // State for storing the currently selected filters
  const [currentlySelectedFilters, setCurrentlySelectedFilters] =
    useState<FilterState>({
      petType: [],
      productType: [],
      offersType: [],
      brandsType: [],
      priceRange: [0, 500],
      inStock: false,
    });

  /**
   * Effect to update the filter options when pet types or product types change.
   */
  useEffect(() => {
    if (petTypes && productTypes) {
      if (
        Array.isArray(petTypes.petTypes) &&
        Array.isArray(productTypes.productTypes)
      ) {
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
          brandsType: brands.map((brand) => brand.label),
          priceRange: [0, 500],
          inStock: false,
        };

        setFilters(newFilters);
      }
    }
  }, [petTypes, productTypes]);

  /**
   * Handle filter change event.
   *
   * @param {FilterType} filterType - The type of filter being changed.
   * @param {string[] | number[] | boolean} value - The new value for the filter.
   */
  const handleFilterChange = (
    filterType: FilterType,
    value: string[] | number[] | boolean
  ) => {
    setCurrentlySelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  // Render loading state if any of the data is still loading
  if (isPetTypesLoading || isProductTypesLoading || isProductsLoading) {
    console.log("Loading data...");
    return <Loading />;
  }

  // Render error state if any of the data failed to load
  if (isPetTypesError || isProductTypesError || isProductsError) {
    return <div>Error loading data</div>;
  }

  // Render the shop content
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pr-4 min-h-[calc(100vh-145px)] h-full ">
      <FilterSideBar
        filters={filters}
        onFilterChange={handleFilterChange}
        currentlySelectedFilters={currentlySelectedFilters}
      />
      <ProductList filters={currentlySelectedFilters} products={products} />
    </div>
  );
}
