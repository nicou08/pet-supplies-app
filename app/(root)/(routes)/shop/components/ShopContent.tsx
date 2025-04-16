"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
  const router = useRouter();
  const searchParams = useSearchParams();

  const [generalLoading, setGeneralLoading] = useState(true);

  const [defaultFilters, setDefaultFilters] = useState<string[]>(["offers"]);
  const [productTypeMap, setProductTypeMap] = useState<{
    [key: string]: string;
  }>({});

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
        // Map product types name to displayName
        const productTypeMapTemp: { [key: string]: string } = {};

        productTypes.productTypes.forEach(
          (productType: { id: string; name: string; displayName: string }) => {
            productTypeMapTemp[productType.name] = productType.displayName;
          }
        );

        setProductTypeMap(productTypeMapTemp);
        //console.log("Product Type Map:", productTypeMapTemp);

        // Add filters
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

  // Preload the filters from the URL query parameters
  useEffect(() => {
    const queryProductType = searchParams.get("productType");
    if (queryProductType) {
      console.log("Query product type:", queryProductType);
      handleFilterChange("productType", [queryProductType]);

      // Add productType to query filters
      setDefaultFilters((prevFilters) => [...prevFilters, "productType"]);
      console.log("Default filters:", defaultFilters);
    }

    setGeneralLoading(false);
    /**
     * Possible solution is to do this in FilterSideBar component
     */
  }, [searchParams]);

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

  // Update the URL when filters change
  // const handleFilterChange = (
  //   filterType: FilterType,
  //   value: string[] | number[] | boolean
  // ) => {
  //   setCurrentlySelectedFilters((prevFilters) => {
  //     const updatedFilters = { ...prevFilters, [filterType]: value };

  //     // Update the URL query parameters
  //     const queryParams = new URLSearchParams();
  //     Object.entries(updatedFilters).forEach(([key, val]) => {
  //       if (Array.isArray(val)) {
  //         queryParams.set(key, val.join(","));
  //       } else {
  //         queryParams.set(key, String(val));
  //       }
  //     });
  //     router.push(`?${queryParams.toString()}`);

  //     return updatedFilters;
  //   });
  // };

  // Render loading state if any of the data is still loading
  if (
    isPetTypesLoading ||
    isProductTypesLoading ||
    isProductsLoading ||
    generalLoading
  ) {
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
        filterNameMap={productTypeMap}
        defaultFilters={defaultFilters}
        onFilterChange={handleFilterChange}
        currentlySelectedFilters={currentlySelectedFilters}
      />
      <ProductList filters={currentlySelectedFilters} products={products} />
    </div>
  );
}
