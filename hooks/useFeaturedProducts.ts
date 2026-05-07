import useSWR from "swr";

import fetcher from "@/lib/fetcher";
import { Product } from "@/types/product";

export function useFeaturedProducts() {
  const { data, error } = useSWR<Product[]>(
    "/api/products?isFeatured=true",
    fetcher
  );

  return {
    products: data ?? [],
    isLoading: !error && !data,
    isError: error,
  };
}
