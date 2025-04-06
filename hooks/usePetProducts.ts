import useSWR from "swr";

import fetcher from "@/lib/fetcher";
import { Product } from "@/types/product";

export const usePetProducts = (petId: string) => {
  // Fetch the products for the pet ID
  const { data: productsData, error: productsError } = useSWR<Product[]>(
    petId ? `/api/products?petId=${petId}` : null,
    fetcher
  );

  if (productsData)
    console.log("USEPETPRODUCTS Fetched products from database:", productsData);

  const isLoading = !productsError && !productsData;
  const isError = !!productsError;

  return {
    products: productsData,
    isLoading,
    isError,
    status: productsError?.status,
  };
};
