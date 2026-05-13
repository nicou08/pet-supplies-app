"use client";

/**
 * ShopContent (client component)
 *
 * URL Query Contract:
 * - petType: comma-separated machine names (e.g., "dog,cat")
 * - productType: comma-separated machine names (e.g., "toys,food")
 * - offersType: comma-separated labels from constants.offers
 * - brandsType: comma-separated labels from constants.brands
 * - priceRange: "min-max" (hyphen-delimited; e.g., "10-500")
 * - inStock: "true" when enabled
 * - page: integer ≥ 1 (default 1)
 * - sort: "price_asc" | "price_desc" | "rating_desc" (omit = best match)
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

type FilterState = {
  petType: string[];
  productType: string[];
  offersType: string[];
  brandsType: string[];
  priceRange: number[];
  inStock: boolean;
};

type FilterType = keyof FilterState;

export function ShopContent() {
  const scrollPositionKey = "shop-scroll-position";

  const router = useRouter();
  const searchParams = useSearchParams();

  // Data hooks first — their results are used in lazy initializers below
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

  // Pagination / sort state (no dependencies)
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSort, setCurrentSort] = useState("");

  // UI state
  const [generalLoading, setGeneralLoading] = useState(false);
  const [defaultFilters, setDefaultFilters] = useState<string[]>(["offers"]);
  const [productTypeMap, setProductTypeMap] = useState<{ [key: string]: string }>(() => {
    if (!productTypes) return {};
    const map: { [key: string]: string } = {};
    productTypes.forEach((pt) => { map[pt.name] = pt.displayName; });
    return map;
  });
  const [petTypesMap, setPetTypesMap] = useState<{ [key: string]: string }>(() => {
    if (!petTypes) return {};
    const map: { [key: string]: string } = {};
    petTypes.forEach((pt) => { map[pt.name] = pt.displayName; });
    return map;
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isFilterChanging, setIsFilterChanging] = useState(false);
  const hasRestoredScroll = useRef(false);

  // Available filter options (seeded from server data on first render)
  const [filters, setFilters] = useState<FilterState>(() => {
    if (petTypes && productTypes && petTypes.length > 0 && productTypes.length > 0) {
      return {
        petType: petTypes.map((type) => type.name),
        productType: productTypes.map((type) => type.name),
        offersType: offers.map((offer) => offer.label),
        brandsType: brands.map((brand) => brand.label),
        priceRange: [0, 1000],
        inStock: false,
      };
    }
    return {
      petType: [],
      productType: [],
      offersType: offers.map((offer) => offer.label),
      brandsType: brands.map((brand) => brand.label),
      priceRange: [0, 1000],
      inStock: false,
    };
  });

  // Currently selected filters — source of truth for what to fetch and display
  const [currentlySelectedFilters, setCurrentlySelectedFilters] =
    useState<FilterState>({
      petType: [],
      productType: [],
      offersType: [],
      brandsType: [],
      priceRange: [0, 1000],
      inStock: false,
    });

  // Products hook — called after all filter state is declared
  const {
    products,
    total,
    totalPages,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useProducts({
    page: currentPage,
    limit: 24,
    sort: currentSort || undefined,
    petType: currentlySelectedFilters.petType.length > 0 ? currentlySelectedFilters.petType : undefined,
    productType: currentlySelectedFilters.productType.length > 0 ? currentlySelectedFilters.productType : undefined,
    offersType: currentlySelectedFilters.offersType.length > 0 ? currentlySelectedFilters.offersType : undefined,
    brandsType: currentlySelectedFilters.brandsType.length > 0 ? currentlySelectedFilters.brandsType : undefined,
    priceRange: currentlySelectedFilters.priceRange,
    inStock: currentlySelectedFilters.inStock || undefined,
  });

  // Once petTypes and productTypes are loaded, compute maps and available filter options
  useEffect(() => {
    if (
      petTypes &&
      productTypes &&
      petTypes.length > 0 &&
      productTypes.length > 0
    ) {
      const productTypeMapTemp: { [key: string]: string } = {};
      productTypes.forEach(
        (productType: { id: string; name: string; displayName: string }) => {
          productTypeMapTemp[productType.name] = productType.displayName;
        }
      );
      setProductTypeMap(productTypeMapTemp);

      const petTypesMapTemp: { [key: string]: string } = {};
      petTypes.forEach(
        (petType: { id: string; name: string; displayName: string }) => {
          petTypesMapTemp[petType.name] = petType.displayName;
        }
      );
      setPetTypesMap(petTypesMapTemp);

      setFilters({
        petType: petTypes.map((type: { id: string; name: string }) => type.name),
        productType: productTypes.map((type: { id: string; name: string }) => type.name),
        offersType: offers.map((offer) => offer.label),
        brandsType: brands.map((brand) => brand.label),
        priceRange: [0, 1000],
        inStock: false,
      });
    }
  }, [petTypes, productTypes]);

  // Sync page and sort from URL (no filter-availability dependency needed)
  useEffect(() => {
    const pageParam = searchParams.get("page");
    setCurrentPage(pageParam && !isNaN(Number(pageParam)) ? Math.max(1, Number(pageParam)) : 1);
    const sortParam = searchParams.get("sort");
    setCurrentSort(sortParam || "");
  }, [searchParams]);

  // Sync currentlySelectedFilters from URL search params
  useEffect(() => {
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

    const petTypeParam = searchParams.get("petType");
    if (petTypeParam) {
      newFilters.petType = petTypeParam.split(",");
      nextDefaultFilters.add("petType");
    }

    const productTypeParam = searchParams.get("productType");
    if (productTypeParam) {
      newFilters.productType = productTypeParam.split(",");
      nextDefaultFilters.add("productType");
    }

    const offersTypeParam = searchParams.get("offersType");
    if (offersTypeParam) {
      newFilters.offersType = offersTypeParam.split(",");
      nextDefaultFilters.add("offersType");
    }

    const brandsTypeParam = searchParams.get("brandsType");
    if (brandsTypeParam) {
      newFilters.brandsType = brandsTypeParam.split(",");
      nextDefaultFilters.add("brandsType");
    }

    const priceRangeParam = searchParams.get("priceRange");
    if (priceRangeParam) {
      const [min, max] = priceRangeParam.split("-").map(Number);
      if (!isNaN(min) && !isNaN(max)) {
        newFilters.priceRange = [min, max];
      }
    }

    const inStockParam = searchParams.get("inStock");
    if (inStockParam === "true") {
      newFilters.inStock = true;
    }

    setCurrentlySelectedFilters(newFilters);
    setDefaultFilters(Array.from(nextDefaultFilters));
  }, [searchParams, filters.petType.length, filters.productType.length]);

  useEffect(() => {
    if (!isPetTypesLoading && !isProductTypesLoading && !isProductsLoading) {
      setGeneralLoading(false);
    }
  }, [isPetTypesLoading, isProductTypesLoading, isProductsLoading]);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        localStorage.setItem(scrollPositionKey, window.scrollY.toString());
      }
    };

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

  useEffect(() => {
    if (
      !generalLoading &&
      !hasRestoredScroll.current &&
      typeof window !== "undefined"
    ) {
      const savedPosition = localStorage.getItem(scrollPositionKey);
      if (savedPosition) {
        setTimeout(() => {
          window.scrollTo({ top: parseInt(savedPosition), behavior: "instant" });
          hasRestoredScroll.current = true;
        }, 100);
      }
    }
  }, [generalLoading]);

  const handleFilterChange = (
    filterType: FilterType,
    value: string[] | number[] | boolean
  ) => {
    setIsFilterChanging(true);

    setCurrentlySelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));

    setTimeout(() => {
      const params = new URLSearchParams();

      const updatedFilters = { ...currentlySelectedFilters, [filterType]: value };

      if (
        Array.isArray(updatedFilters.priceRange) &&
        updatedFilters.priceRange.length === 2
      ) {
        const min = Number(updatedFilters.priceRange[0]);
        const max = Number(updatedFilters.priceRange[1]);
        if (!isNaN(min) && !isNaN(max) && (min > 0 || max < 1000)) {
          params.set("priceRange", `${min}-${max}`);
        }
      }

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
      if (updatedFilters.inStock === true) {
        params.set("inStock", "true");
      }

      // Preserve current sort; page resets to 1 (omitted = 1)
      if (currentSort) params.set("sort", currentSort);

      router.push(`/shop?${params.toString()}`, { scroll: false });
      setIsFilterChanging(false);
    }, 400);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/shop?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sort) params.set("sort", sort);
    else params.delete("sort");
    params.set("page", "1");
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const handleOpenMobileFilter = (openValue: boolean) => {
    setIsMobileFilterOpen(openValue);
  };

  if (isPetTypesLoading || isProductTypesLoading || generalLoading) {
    return <Loading />;
  }

  if (isPetTypesError || isProductTypesError || isProductsError) {
    return <div>Error loading data</div>;
  }

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

      {/* Product list */}
      <ProductList
        products={products}
        onMobileFilterChange={handleOpenMobileFilter}
        isFilterChanging={isFilterChanging}
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        sortOption={currentSort}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
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
