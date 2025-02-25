import useSWR from "swr";

import fetcher from "@/lib/fetcher";
import { DetailedProduct } from "@/types/product";

export function useProduct(productId: string) {
  const { data, error } = useSWR<DetailedProduct>(
    `/api/products/${productId}`,
    fetcher
  );

  if (data) console.log("USEPRODUCT Fetched product from database:", data);

  return {
    product: data,
    isLoading: !error && !data,
    isError: error,
  };
}
