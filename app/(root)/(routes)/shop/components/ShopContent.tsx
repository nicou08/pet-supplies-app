"use client";

/**
 * ShopContent (client component)
 *
 * Responsibilities:
 * - Fetch and normalize data needed to render the shop page (pet types, product types, products).
 * - Manage all filter state and UI (desktop sidebar + mobile drawer).
 * - Keep filter state in sync with URL query parameters and vice versa.
 * - Persist and restore scroll position across navigations.
 * - Render product list based on current filters.
 *
 * URL Query Contract:
 * - petType: comma-separated values (e.g., "dog,cat")
 * - productType: comma-separated values (e.g., "toys,food")
 * - offersType: comma-separated values (labels from constants.offers)
 * - brandsType: comma-separated values (labels from constants.brands)
 * - priceRange: "min-max" (hyphen-delimited; e.g., "0-1000")
 * - inStock: "true" when enabled
 *
 * Notes:
 * - priceRange is validated and always serialized as "min-max" to avoid encoding issues (e.g., 0%2C1000).
 * - URL updates are delayed slightly to avoid React warning about updating the Router during render.
 * - Consider replacing the setTimeout-based URL update with a transition (React 18 startTransition) if needed.
 */

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { FilterSideBar } from "./FilterSideBar";
import { ProductList } from "./ProductList";
import Loading from "../loading";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { usePetTypes } from "@/hooks/usePetTypes";
import { useProductTypes } from "@/hooks/useProductTypes";
import { useProducts } from "@/hooks/useProducts";

import { offers, brands } from "@/constants";

/**
 * Type definition for the filter state.
 * - petType: machine names from API (e.g., "dog", "cat")
 * - productType: machine names from API (e.g., "food", "toys")
 * - offersType: labels from constants.offers (e.g., "On Sale")
 * - brandsType: labels from constants.brands (e.g., "Acme")
 * - priceRange: [min, max] numeric range. Serialized as "min-max" in URL.
 * - inStock: boolean flag; present in URL as "inStock=true" only when true
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
 */
export function ShopContent() {
  /**
   * Key used to persist the vertical scroll position of the shop list.
   */
  const scrollPositionKey = "shop-scroll-position";

  // Router and URL utilities
  const router = useRouter();
  const searchParams = useSearchParams();
  // Page-level loading gate. Ensures we don't render the main UI until data is ready.
  const [generalLoading, setGeneralLoading] = useState(true);

  /**
   * Names of filters to show as "default open" in the UI (if the sidebar supports that behavior).
   * "offers" is opened by default; others are pushed as they are discovered in URL params.
   */
  const [defaultFilters, setDefaultFilters] = useState<string[]>(["offers"]);

  /**
   * Mapping of productType machine name -> display name.
   * Example: "toys" -> "Toys"
   */
  const [productTypeMap, setProductTypeMap] = useState<{
    [key: string]: string;
  }>({});

  /**
   * Mapping of petType machine name -> display name.
   * Example: "dog" -> "Dog"
   */
  const [petTypesMap, setPetTypesMap] = useState<{ [key: string]: string }>({});

  // Mobile drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Lightweight "busy" indicator while filters are changing
  const [isFilterChanging, setIsFilterChanging] = useState(false);

  // Track if scroll restoration ran already for this mount
  const hasRestoredScroll = useRef(false);

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

  /**
   * Available filter options (not the user's current selection).
   * These are populated after petTypes/productTypes are loaded.
   */
  const [filters, setFilters] = useState<FilterState>({
    petType: [],
    productType: [],
    offersType: offers.map((offer) => offer.label),
    brandsType: brands.map((brand) => brand.label),
    priceRange: [0, 1000],
    inStock: false,
  });

  /**
   * Currently selected filters (the user's selection).
   * This state is the source of truth for what to render and for building the URL.
   */
  const [currentlySelectedFilters, setCurrentlySelectedFilters] =
    useState<FilterState>({
      petType: [],
      productType: [],
      offersType: [],
      brandsType: [],
      priceRange: [0, 1000],
      inStock: false,
    });

  /**
   * Once petTypes and productTypes are loaded, compute name->displayName maps and
   * set the available filters list.
   */
  useEffect(() => {
    if (
      petTypes &&
      productTypes &&
      petTypes.length > 0 &&
      productTypes.length > 0
    ) {
      // Build product type name-to-displayName map
      const productTypeMapTemp: { [key: string]: string } = {};
      productTypes.forEach(
        (productType: { id: string; name: string; displayName: string }) => {
          productTypeMapTemp[productType.name] = productType.displayName;
        }
      );
      setProductTypeMap(productTypeMapTemp);

      // Build pet type name-to-displayName map
      const petTypesMapTemp: { [key: string]: string } = {};
      petTypes.forEach(
        (petType: { id: string; name: string; displayName: string }) => {
          petTypesMapTemp[petType.name] = petType.displayName;
        }
      );
      setPetTypesMap(petTypesMapTemp);

      // Update available filter options
      setFilters({
        petType: petTypes.map(
          (type: { id: string; name: string }) => type.name
        ),
        productType: productTypes.map(
          (type: { id: string; name: string }) => type.name
        ),
        offersType: offers.map((offer) => offer.label),
        brandsType: brands.map((brand) => brand.label),
        priceRange: [0, 1000],
        inStock: false,
      });
    }
  }, [petTypes, productTypes]);

  /**
   * Sync currentlySelectedFilters from URL search params.
   *
   * Behavior:
   * - Reads each known filter key from URL and updates the selection accordingly.
   * - priceRange must be "min-max". Non-numeric values are ignored.
   * - Only runs once filters list is available (so we don't initialize with empty arrays).
   *
   * Why dependencies:
   * - searchParams: re-run when the URL query changes.
   * - filters.petType.length / filters.productType.length: ensure options are loaded first.
   */
  useEffect(() => {
    // Defer processing until available filter options are known
    if (filters.petType.length === 0 || filters.productType.length === 0) {
      return;
    }

    const newFilters: FilterState = {
      petType: [],
      productType: [],
      offersType: [],
      brandsType: [],
      priceRange: [0, 1000],
      inStock: false,
    };
    const nextDefaultFilters = new Set(["offers"]);

    // petType (CSV)
    const petTypeParam = searchParams.get("petType");
    if (petTypeParam) {
      const petTypes = petTypeParam.split(",");
      newFilters.petType = petTypes;
      nextDefaultFilters.add("petType");
    }

    // productType (CSV)
    const productTypeParam = searchParams.get("productType");
    if (productTypeParam) {
      const productTypes = productTypeParam.split(",");
      newFilters.productType = productTypes;
      nextDefaultFilters.add("productType");
    }

    // offersType (CSV)
    const offersTypeParam = searchParams.get("offersType");
    if (offersTypeParam) {
      const offersTypes = offersTypeParam.split(",");
      newFilters.offersType = offersTypes;
      nextDefaultFilters.add("offersType");
    }

    // brandsType (CSV)
    const brandsTypeParam = searchParams.get("brandsType");
    if (brandsTypeParam) {
      const brandsTypes = brandsTypeParam.split(",");
      newFilters.brandsType = brandsTypes;
      nextDefaultFilters.add("brandsType");
    }

    // priceRange ("min-max")
    const priceRangeParam = searchParams.get("priceRange");
    if (priceRangeParam) {
      const [min, max] = priceRangeParam.split("-").map(Number);
      // Only update if we have valid numbers
      if (!isNaN(min) && !isNaN(max)) {
        newFilters.priceRange = [min, max];
      }
    }

    // inStock ("true")
    const inStockParam = searchParams.get("inStock");
    if (inStockParam === "true") {
      newFilters.inStock = true;
    }

    setCurrentlySelectedFilters(newFilters);
    setDefaultFilters(Array.from(nextDefaultFilters));
  }, [searchParams, filters.petType.length, filters.productType.length]);

  /**
   * Aggregate loading state for the entire page. When all data hooks finish,
   * we clear generalLoading to render the main UI.
   */
  useEffect(() => {
    if (!isPetTypesLoading && !isProductTypesLoading && !isProductsLoading) {
      setGeneralLoading(false);
    }
  }, [isPetTypesLoading, isProductTypesLoading, isProductsLoading]);

  /**
   * Persist scroll position while the user scrolls the page.
   * Uses a throttled listener to avoid excessive writes to localStorage.
   */
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        localStorage.setItem(scrollPositionKey, window.scrollY.toString());
      }
    };

    // Simple throttle using a timeout
    let timeoutId: NodeJS.Timeout;
    const throttledScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 200);
    };

    window.addEventListener("scroll", throttledScroll);

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  /**
   * Restore the user's scroll position after initial content render.
   * Runs once after loading is complete.
   */
  useEffect(() => {
    if (
      !generalLoading &&
      !hasRestoredScroll.current &&
      typeof window !== "undefined"
    ) {
      const savedPosition = localStorage.getItem(scrollPositionKey);

      if (savedPosition) {
        // Small delay to ensure content is rendered
        setTimeout(() => {
          window.scrollTo({
            top: parseInt(savedPosition),
            behavior: "instant", // Use "smooth" for animated scrolling
          });
          hasRestoredScroll.current = true;
        }, 100);
      }
    }
  }, [generalLoading]);

  /**
   * Handle filter change event.
   *
   * Updates local selection state immediately and then (after a short delay)
   * serializes the selection into URL query params. The delay avoids React's
   * "Cannot update a component (Router) while rendering a different component" warning.
   *
   * URL serialization rules:
   * - Arrays are CSV (petType, productType, offersType, brandsType).
   * - priceRange is serialized as "min-max" (hyphen), only if both are numeric.
   * - inStock only present when true.
   *
   * @param filterType The type of filter being changed.
   * @param value The new value for the filter.
   */
  const handleFilterChange = (
    filterType: FilterType,
    value: string[] | number[] | boolean
  ) => {
    // Show lightweight busy state
    setIsFilterChanging(true);

    // Update selected filters first
    setCurrentlySelectedFilters((prevFilters) => {
      return { ...prevFilters, [filterType]: value };
    });

    // After state commit, update the URL (avoid router updates inside render)
    // NOTE: Consider using React startTransition + router.replace for a more idiomatic approach.
    setTimeout(() => {
      const params = new URLSearchParams();

      // Use the latest selection to build URL params
      const updatedFilters = {
        ...currentlySelectedFilters,
        [filterType]: value,
      };

      // priceRange: ensure numbers, serialize as "min-max"
      if (
        Array.isArray(updatedFilters.priceRange) &&
        updatedFilters.priceRange.length === 2
      ) {
        const min = Number(updatedFilters.priceRange[0]);
        const max = Number(updatedFilters.priceRange[1]);

        if (!isNaN(min) && !isNaN(max)) {
          params.set("priceRange", `${min}-${max}`);
        }
      }

      // Other arrays: serialize as CSV when non-empty
      if (updatedFilters.petType.length > 0) {
        params.set("petType", updatedFilters.petType.join(","));
      }
      if (updatedFilters.productType.length > 0) {
        params.set("productType", updatedFilters.productType.join(","));
      }
      if (updatedFilters.offersType.length > 0) {
        params.set("offersType", updatedFilters.offersType.join(","));
      }
      if (updatedFilters.brandsType.length > 0) {
        params.set("brandsType", updatedFilters.brandsType.join(","));
      }

      // inStock only when true
      if (updatedFilters.inStock === true) {
        params.set("inStock", "true");
      }

      // Update URL without a full page reload (and without scrolling)
      router.push(`/shop?${params.toString()}`, { scroll: false });

      // Clear busy indicator
      setIsFilterChanging(false);
    }, 400);
  };

  /**
   * Toggle mobile filter drawer open/close.
   */
  const handleOpenMobileFilter = (openValue: boolean) => {
    setIsMobileFilterOpen(openValue);
    console.log("Mobile filter open state:", openValue);
  };

  /**
   * Render: loading state.
   * We gate on:
   * - all data hooks resolved
   * - available filters computed (petType/productType arrays set)
   */
  if (
    isPetTypesLoading ||
    isProductTypesLoading ||
    isProductsLoading ||
    generalLoading ||
    filters.petType.length === 0 || // Wait for filters to be set
    filters.productType.length === 0
  ) {
    console.log("Loading data...");
    return <Loading />;
  }

  /**
   * Render: error state.
   */
  if (isPetTypesError || isProductTypesError || isProductsError) {
    return <div>Error loading data</div>;
  }

  /**
   * Render: main shop content
   * - Desktop: sidebar visible, product list on the right
   * - Mobile: filter in a bottom drawer
   */
  return (
    <div className="grid grid-cols-1 2lg:grid-cols-5 gap-4 pr-0 2lg:pr-4 min-h-[calc(100vh-145px)] h-full ">
      {/* Desktop filter sidebar */}
      <div className="hidden 2lg:block">
        <FilterSideBar
          filters={filters}
          filterNameMap={productTypeMap}
          petNameMap={petTypesMap}
          defaultFilters={defaultFilters}
          onFilterChange={handleFilterChange}
          currentlySelectedFilters={currentlySelectedFilters}
        />
      </div>

      {/* Product list (drives the main content) */}
      <ProductList
        filters={currentlySelectedFilters}
        products={products}
        onMobileFilterChange={handleOpenMobileFilter}
        isFilterChanging={isFilterChanging}
      />

      {/* Mobile filter drawer */}
      <Drawer open={isMobileFilterOpen} onOpenChange={handleOpenMobileFilter}>
        <DrawerContent className="p-0">
          <div className="overflow-y-auto max-h-[calc(100vh-120px)] px-4 pb-4">
            <DrawerHeader>
              <DrawerTitle>Filter</DrawerTitle>
              <DrawerDescription>
                Use filters to narrow down your search
              </DrawerDescription>
            </DrawerHeader>

            <FilterSideBar
              filters={filters}
              filterNameMap={productTypeMap}
              petNameMap={petTypesMap}
              defaultFilters={defaultFilters}
              onFilterChange={handleFilterChange}
              currentlySelectedFilters={currentlySelectedFilters}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
