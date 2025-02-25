import useSWR from "swr";

import fetcher from "@/lib/fetcher";
import { Product } from "@/types/product";

export function useProducts() {
  const { data, error } = useSWR<Product[]>("/api/products", fetcher);

  if (data) console.log("USEPRODUCTS Fetched products from database:", data);

  return {
    products: data || [],
    isLoading: !error && !data,
    isError: error,
  };
}
