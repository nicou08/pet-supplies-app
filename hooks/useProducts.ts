import useSWR from "swr";

import fetcher from "@/lib/fetcher";
import { PaginatedProducts } from "@/types/product";

interface UseProductsParams {
  page?: number;
  limit?: number;
  sort?: string;
  petType?: string[];
  productType?: string[];
  offersType?: string[];
  brandsType?: string[];
  priceRange?: number[];
  inStock?: boolean;
}

function buildProductsUrl(params: UseProductsParams): string {
  const {
    page = 1,
    limit = 24,
    sort,
    petType,
    productType,
    offersType,
    brandsType,
    priceRange,
    inStock,
  } = params;

  const sp = new URLSearchParams();
  sp.set("page", String(page));
  sp.set("limit", String(limit));

  if (sort) sp.set("sort", sort);
  if (petType?.length) sp.set("petType", petType.join(","));
  if (productType?.length) sp.set("productType", productType.join(","));
  if (offersType?.length) sp.set("offersType", offersType.join(","));
  if (brandsType?.length) sp.set("brandsType", brandsType.join(","));
  if (priceRange && (priceRange[0] > 0 || priceRange[1] < 1000)) {
    sp.set("priceRange", `${priceRange[0]}-${priceRange[1]}`);
  }
  if (inStock) sp.set("inStock", "true");

  return `/api/products?${sp.toString()}`;
}

export function useProducts(params: UseProductsParams = {}) {
  const key = buildProductsUrl(params);
  const { data, error } = useSWR<PaginatedProducts>(key, fetcher, {
    keepPreviousData: true,
  });

  return {
    products: data?.items ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    page: data?.page ?? 1,
    isLoading: !error && !data,
    isError: error,
  };
}
