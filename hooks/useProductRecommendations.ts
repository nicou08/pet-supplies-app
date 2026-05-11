import useSWR from "swr";

import fetcher from "@/lib/fetcher";
import { Product } from "@/types/product";

export function useProductRecommendations(productId: string) {
  const { data, error } = useSWR<Product[]>(
    productId ? `/api/products/${productId}/recommendations` : null,
    fetcher
  );

  return {
    products: data || [],
    isLoading: !error && !data,
    isError: error,
  };
}
