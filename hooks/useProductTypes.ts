import useSWR from "swr";

import fetcher from "@/lib/fetcher";
import { ProductTypeOption } from "@/types";

export const useProductTypes = () => {
  const { data, error } = useSWR<ProductTypeOption[]>(
    "/api/product-types",
    fetcher
  );

  // if (data)
  //   console.log("USEPRODUCTTYPES Fetched product types from database:", data);

  return {
    productTypes: data,
    isLoading: !error && !data,
    isError: error,
  };
};
