import useSWR from "swr";

import fetcher from "@/lib/fetcher";

export function useProducts() {
  const { data, error } = useSWR("/api/products", fetcher);

  console.log("USEPRODUCTS Fetched products from database:", data.products);

  return {
    products: data?.products || [],
    isLoading: !error && !data,
    isError: error,
  };
}
